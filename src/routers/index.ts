import { IEndpoints, IHandler } from '../interfaces/common'

export class Router {
  endpoints: IEndpoints
  constructor(endpoints = {}) {
    this.endpoints = endpoints
  }

  request(method: string, path: string, handler: IHandler): void {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {}
    }

    const endpoint = this.endpoints[path]
    if (endpoint[method]) {
      throw new Error(`The ${method} is already exist`)
    }

    endpoint[method] = handler
  }

  get(path: string, handler: IHandler) {
    this.request('GET', path, handler)
  }

  post(path: string, handler: IHandler) {
    this.request('POST', path, handler)
  }

  put(path: string, handler: IHandler) {
    this.request('PUT', path, handler)
  }

  delete(path: string, handler: IHandler) {
    this.request('DELETE', path, handler)
  }
}
