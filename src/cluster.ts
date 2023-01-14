import 'dotenv/config'
import cluster from 'cluster'
import { cpus } from 'os'

import Provider from './provider/index'
import { json, url } from './middlewares'
import { userRouter } from './routers/user/index'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const totalCPU = cpus().length

const pig = process.pid

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPU}`)
  for (let i = 0; i < totalCPU; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  startWorker()
}

function startWorker() {
  const id = String(cluster.worker?.id ?? 0)
  const childPort = Number(PORT) + Number(id)
  const provider = new Provider()

  provider.use(json)
  provider.use(url(`${BASE_URL}${childPort}`))

  provider.addRouter(userRouter)
  console.log(`Worker ${pig} started`)

  provider.listen(Number(PORT), () => {
    console.log(`Server running on  port ${childPort}`)
  })
}
