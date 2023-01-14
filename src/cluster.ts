import 'dotenv/config'
import cluster, { Worker } from 'cluster'
import { cpus } from 'os'

import Provider from './provider/index'
import { json, url } from './middlewares'
import { userRouter } from './routers/user/index'
import { IServer } from './interfaces'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const totalCPU = cpus().length

const workers: Worker[] = []
const current = 0

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPU}`)

  for (let i = 1; i < totalCPU; i++) {
    const worker = cluster.fork({ APP_PORT: Number(PORT) + i })
    workers.push(worker)
  }

  const provider = new Provider()

  provider.use(json)
  provider.use(url(`${BASE_URL}${PORT}`))

  provider.addRouter(userRouter)

  provider.balancer(provider.server, current, workers)
  provider.listen(Number(PORT), () => {
    console.log(`Server running on  port ${PORT}`)
  })

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

  provider.listen(Number(childPort), () => {
    console.log(`Server running on  port ${childPort}`)
  })

  process.on('message', (message: { name: string }, socket: { server: IServer }) => {
    if (message.name === 'socket') {
      socket.server = provider.server
      provider.server.emit('connection', socket)
    }
  })
}
