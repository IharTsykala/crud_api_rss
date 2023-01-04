import { IReq, IRes } from '../interfaces/common'

export const json = (req: IReq, res: IRes) => {
  res.send = (data: object) => {
    res.writeHead(200, {
      'Content-type': 'application/json',
    })
    res.end(JSON.stringify(data))
  }
}
