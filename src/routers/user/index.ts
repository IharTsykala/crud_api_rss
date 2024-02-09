import { Router } from '../router'

import { UserController } from '../../constrollers/users'
import { ROUTS_API } from '../../constants'

export const userRouter = new Router()

userRouter.get(ROUTS_API.USER_BY_ID, UserController.getUser)

userRouter.get(ROUTS_API.USERS, UserController.getUsers)

userRouter.post(ROUTS_API.USERS, UserController.addUser)

userRouter.put(ROUTS_API.USER_BY_ID, UserController.updateUser)

userRouter.delete(ROUTS_API.USER_BY_ID, UserController.deleteUser)
