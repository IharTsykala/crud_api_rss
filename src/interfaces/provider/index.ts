import { EventEmitter } from 'events'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { IReq, IRes } from '../requests'

export type IServer = Server<typeof IncomingMessage, typeof ServerResponse>

export interface IMiddleware {
  (req: IReq, res: IRes): any;
}

export interface IProvider {
  emitter: EventEmitter;
  server: IServer;
  middlewares: IMiddleware[];
}
