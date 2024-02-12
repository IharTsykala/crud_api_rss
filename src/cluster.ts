import 'dotenv/config'
import cluster, { Worker } from 'cluster'
import { cpus } from 'os'

import Provider from './provider/index'
import { json, url } from './middlewares'
import { userRouter } from './routers'

//memory db
import { Database } from './db'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const totalCPU = cpus().length

const workers: Worker[] = []
let current = 0

const databaseInstance: Database = Database.getInstance()

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPU}`)

  for (let i = 1; i < totalCPU; i++) {
    const worker = cluster.fork({ APP_PORT: Number(PORT) + i })
    worker.send({ type: 'database', databaseInstance })
    current = Number(PORT) + i

    workers.push(worker)
  }

  let provider = new Provider(databaseInstance)

  provider.use(json)
  provider.use(url(`${BASE_URL}${PORT}`))

  provider.balancer(provider.server, current, workers)

  provider.addRouter(userRouter)

  provider.listen(Number(PORT), () => {
    console.log(`Server Balancer running on  port ${PORT}`)
  })

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  startWorker(databaseInstance)
}

function startWorker(databaseInstance: Database) {
  const { APP_PORT } = process.env

  if (!APP_PORT) {
    console.error('Missing environment variables.')
    process.exit(1)
  }

  const provider = new Provider(databaseInstance)

  provider.use(json)
  provider.use(url(`${BASE_URL}${APP_PORT}`))
  provider.addRouter(userRouter)

  provider.listen(Number(APP_PORT), () => {
    console.log(`Server running on port ${APP_PORT}`)
  })
}
