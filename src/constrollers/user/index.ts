import { IReq, IRes } from '../../interfaces/common'
import { UserService } from '../../services/user'

export const headers = { 'Content-Type': 'application/json' }

export class UserController {
  static getUsers(req: IReq, res: IRes) {
    try {
      const { code, users } = UserService.getUsers()
      if (!String(code).startsWith('2')) {
        throw new Error()
      }
      res.writeHead(code, headers)
      res.send(users)
    } catch (e) {
      console.log(e)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ message: '500 Internal Server Error' }))
    }
  }

  static getUser(req: IReq, res: IRes) {
    try {
      const { id } = req
      const { code, user, message } = UserService.getUser(id)
      res.writeHead(code, headers)
      if (String(code).startsWith('2')) {
        res.send(user)
      } else {
        res.end(JSON.stringify({ message }))
      }
    } catch (e) {
      console.log(e)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ message: '500 Internal Server Error' }))
    }
  }

  static addUser(req: IReq, res: IRes) {
    try {
      const { body } = req
      const { code, message } = UserService.addUser(body)
      res.writeHead(code, headers)
      res.end(JSON.stringify({ message }))
    } catch (e) {
      console.log(e)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ message: '500 Internal Server Error' }))
    }
  }

  static updateUser(req: IReq, res: IRes) {
    try {
      const { id, body } = req
      const { code, message } = UserService.updateUser(id, body)
      res.writeHead(code, headers)
      res.end(JSON.stringify({ message }))
    } catch (e) {
      console.log(e)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ message: '500 Internal Server Error' }))
    }
  }

  static deleteUser(req: IReq, res: IRes) {
    try {
      const { id } = req
      const { code, message } = UserService.deleteUser(id)
      res.writeHead(code, headers)
      res.end(JSON.stringify({ message }))
    } catch (e) {
      console.log(e)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ message: '500 Internal Server Error' }))
    }
  }
}
