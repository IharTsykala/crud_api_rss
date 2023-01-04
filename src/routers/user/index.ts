import { Router } from '../index'
import { UserController } from '../../constrollers/user'

export const userRouter = new Router()

userRouter.get('/api/users/:id', UserController.getUser)

userRouter.get('/api/users', UserController.getUsers)

userRouter.post('/api/users', UserController.addUser)

userRouter.put('/api/users/:id', UserController.updateUser)

userRouter.delete('/api/users/:id', UserController.deleteUser)
