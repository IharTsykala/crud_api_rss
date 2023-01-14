import { IRes } from '../../interfaces'

import { HEADERS, RESPONSE_MESSAGES, STATUS_CODES } from '../../constants'

export const catchError = (e: Error | unknown, res: IRes) => {
  console.log(e)
  res.writeHead(STATUS_CODES['500'], HEADERS.CONTENT_TYPES)
  res.end(JSON.stringify({ message: RESPONSE_MESSAGES.INTERNAL_ERROR }))
}
