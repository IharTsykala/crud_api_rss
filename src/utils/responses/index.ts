import { IRes, IUser } from '../../interfaces'

export const checkUserResponse = (user: IUser | undefined, res: IRes, message: string | undefined) => {
  if (user) {
    res.end(JSON.stringify(user))
  } else {
    res.end(JSON.stringify({ message }))
  }
}
