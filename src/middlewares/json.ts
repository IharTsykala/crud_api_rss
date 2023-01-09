import { IReq, IRes } from '../interfaces/common'
import { headers } from '../constrollers/user'

export const json = (req: IReq, res: IRes) => {
  res.send = (data: object) => {
    res.writeHead(200, headers)
    res.end(JSON.stringify(data))
  }
}
