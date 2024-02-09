import http from 'http'
import { EventEmitter } from 'events'

import { removeLastSlash } from '../utils'

import { IMiddleware, IProvider, IServer, IReq } from '../interfaces'

import { HEADERS, REQUEST_TYPES, RESPONSE_MESSAGES, ROUTS_API, STATUS_CODES } from '../constants'
import { Worker } from 'cluster'

export default class Provider implements IProvider {
  emitter: EventEmitter
  server: IServer
  middlewares: IMiddleware[]

  constructor() {
    this.emitter = new EventEmitter()
    this.server = this._createServer()
    this.middlewares = []
  }

  addRouter(router: { [key: string]: any }) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path]
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(this._getMask(this._setId({ pathname: path, method })), (req, res) => {
          const handler = endpoint[method]
          handler(req, res)
        })
      })
    })
  }

  _createServer() {
    return http.createServer((req, res) => {
      try {
        let body = ''
        req.on('data', (chunk) => {
          body = body + chunk
        })

        req.on('end', () => {
          if (body) {
            try {
              // @ts-ignore
              req.body = JSON.parse(body)
            } catch {
              res.writeHead(STATUS_CODES['400'], HEADERS.CONTENT_TYPES)
              res.end(JSON.stringify({ message: RESPONSE_MESSAGES.JSON_PARSE_ERROR }))
              return
            }
          }

          this.middlewares.forEach((middleware) => middleware(req, res))

          const emitStatus = this.emitter.emit(this._getMask(this._setId(req)), req, res)

          if (!emitStatus) {
            res.writeHead(STATUS_CODES['404'], HEADERS.CONTENT_TYPES)
            res.end(JSON.stringify({ message: RESPONSE_MESSAGES.WRONG_ROUTE }))
          }
        })
      } catch {
        console.log(RESPONSE_MESSAGES.INTERNAL_ERROR)
        res.writeHead(STATUS_CODES['500'], HEADERS.CONTENT_TYPES)
        res.end(JSON.stringify({ message: RESPONSE_MESSAGES.INTERNAL_ERROR }))
        return
      }
    })
  }

  _getMask(req: IReq) {
    const { pathname = '/', method = REQUEST_TYPES.GET } = req
    return `[${pathname}][${method}]`
  }

  _setId(req: IReq) {
    const { pathname } = req

    let newPathname = removeLastSlash(pathname)
    const statusIdUrl = [ROUTS_API.USERS].find((api) => newPathname.includes(api))

    if (statusIdUrl) {
      const splitPathname = pathname.split('/')
      newPathname = splitPathname.slice(0, -1).concat(':id').join('/')
      const id = splitPathname[splitPathname.length - 1]
      req.id = id
    }

    req.pathname = newPathname
    return req
  }

  use(middleware: IMiddleware) {
    this.middlewares.push(middleware)
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback)
  }

  balancer(socket: IServer, current: number, workers: Worker[]) {
    current === workers.length - 1 ? (current = 1) : current++
    const worker = workers[current]
    if (worker) {
      worker.send({ name: 'socket' }, socket)
    }
  }
}
