import http, { IncomingMessage, Server, ServerResponse } from 'http'
import { EventEmitter } from 'events'
import { IReq, IRes } from '../interfaces/common'
import { headers } from '../constrollers/user'
import { removeLastSlash } from '../utils/routs'

type IServer = Server<typeof IncomingMessage, typeof ServerResponse>

interface IProvider {
  emitter: EventEmitter;
  server: IServer;
  middlewares: IMiddleware[];
}

interface IMiddleware {
  (req: IReq, res: IRes): any;
}

interface IProvider {
  emitter: EventEmitter;
  server: IServer;
  middlewares: IMiddleware[];
}

// interface ICustomIncomingMessage extends IncomingMessage {
//   body: object;
//   pathname: string;
// }

export default class Provider implements IProvider {
  emitter: EventEmitter
  server: IServer
  middlewares: IMiddleware[]

  constructor() {
    this.emitter = new EventEmitter()
    this.server = this._createServer()
    this.middlewares = []
  }

  _createServer() {
    return http.createServer((req, res) => {
      try {
        let body = ''
        req.on('data', (chunk) => {
          // console.log(chunk)
          body = body + chunk
        })

        req.on('end', () => {
          if (body) {
            try {
              // @ts-ignore
              req.body = JSON.parse(body)
            } catch {
              res.writeHead(404, headers)
              res.end(JSON.stringify({ message: 'JSON is not right' }))
              return
            }
          }

          this.middlewares.forEach((middleware) => middleware(req, res))

          const emitStatus = this.emitter.emit(this._getMask(this._setId(req)), req, res)

          if (!emitStatus) {
            res.writeHead(404, headers)
            res.end(JSON.stringify({ message: 'route is not exist' }))
          }
        })
      } catch {
        console.log('500 Internal Server Error')
        res.writeHead(500, headers)
        res.end(JSON.stringify({ message: '500 Internal Server Error' }))
        return
      }
    })
  }

  _setId(req: IReq) {
    const { pathname } = req

    let newPathname = removeLastSlash(pathname)
    const statusIdUrl = ['/api/users/'].find((api) => newPathname.includes(api))

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
    const { pathname = '/', method = 'GET' } = req

    console.log(`[${pathname}][${method}]`)

    return `[${pathname}][${method}]`
  }

  addRouter(router: { [key: string]: any }) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path]
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(this._getMask({ pathname: path, method }), (req, res) => {
          const handler = endpoint[method]
          handler(req, res)
        })
      })
    })
  }

  use(middleware: IMiddleware) {
    this.middlewares.push(middleware)
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback)
  }
}
