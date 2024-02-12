import { UserService } from '../../services/user'

import { IReq, IRes } from '../../interfaces'
import { HEADERS } from '../../constants'
import { catchError, checkUserResponse } from '../../utils'

export class UserController {
  static getUsers(req: IReq, res: IRes) {
    try {
      const { code, users } = UserService.getUsers(req)

      if (users) {
        // res.writeHead(code, HEADERS.CONTENT_TYPES)
        res.send(users)
        return
      }

      throw new Error()
    } catch (e) {
      catchError(e, res)
    }
  }

  static getUser(req: IReq, res: IRes) {
    try {
      const { id } = req
      const { code, user, message } = UserService.getUser(id, req)

      res.writeHead(code, HEADERS.CONTENT_TYPES)

      checkUserResponse(user, res, message)
    } catch (e) {
      catchError(e, res)
    }
  }

  static addUser(req: IReq, res: IRes) {
    try {
      const { body } = req
      const { code, message, user } = UserService.addUser(body, req)

      res.writeHead(code, HEADERS.CONTENT_TYPES)

      checkUserResponse(user, res, message)
    } catch (e) {
      catchError(e, res)
    }
  }

  static updateUser(req: IReq, res: IRes) {
    try {
      const { id, body } = req
      const { code, message, user } = UserService.updateUser(id, body, req)

      res.writeHead(code, HEADERS.CONTENT_TYPES)

      checkUserResponse(user, res, message)
    } catch (e) {
      catchError(e, res)
    }
  }

  static deleteUser(req: IReq, res: IRes) {
    try {
      const { id } = req
      const { code, message } = UserService.deleteUser(id, req)

      res.writeHead(code, HEADERS.CONTENT_TYPES)

      res.end(JSON.stringify({ message }))
    } catch (e) {
      catchError(e, res)
    }
  }
}
