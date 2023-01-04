import { IReq } from '../interfaces/common'

interface ISearchParams {
  [key: string]: string;
}

export const url = (baseUrl: string) => (req: IReq) => {
  const urlObj = new URL(req.url, baseUrl)
  const searchParams: ISearchParams = {}

  urlObj.searchParams.forEach((value, key) => (searchParams[key] = value))

  req.pathname = urlObj.pathname
  req.searchParams = searchParams
}
