import { IReq, IRes } from '../../interfaces'
import { HEADERS, STATUS_CODES } from '../../constants'

export const json = (req: IReq, res: IRes) => {
  res.send = (data: object) => {
    res.writeHead(STATUS_CODES['200'], HEADERS.CONTENT_TYPES)
    res.end(JSON.stringify(data))
  }
}
