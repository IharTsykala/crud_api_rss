import http from 'http'
import { EventEmitter } from 'events'
import { Worker } from 'cluster'

import { removeLastSlash } from '../utils'

import { IMiddleware, IProvider, IServer, IReq, IUser } from '../interfaces'

import { HEADERS, REQUEST_TYPES, RESPONSE_MESSAGES, ROUTS_API, STATUS_CODES } from '../constants'
import { Database } from '../db'

export default class Provider implements IProvider {
  emitter: EventEmitter
  server: IServer
  middlewares: IMiddleware[]

  constructor(private dataBase: Database) {
    this.emitter = new EventEmitter()
    this.server = this._createServer()
    this.middlewares = []
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

  _getMask(req: IReq) {
    const { pathname = '/', method = REQUEST_TYPES.GET } = req
    return `[${pathname}][${method}]`
  }

  addRouter(router: { [key: string]: any }) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path]

      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(this._getMask(this._setId({ pathname: path, method })), (req, res) => {
          const handler = endpoint[method]
          req.dataBase = this.dataBase
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

  use(middleware: IMiddleware) {
    this.middlewares.push(middleware)
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback)
  }

  balancer(socket: IServer, current: number, workers: Worker[]) {
    // console.log('Provider222.dataBase', this.dataBase)
  }
}
