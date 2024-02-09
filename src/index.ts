import dotenv from 'dotenv'
dotenv.config()

import Provider from './provider'
import { userRouter } from './routers/user'
import { json, url } from './middlewares'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const provider = new Provider()

provider.use(json)
provider.use(url(`${BASE_URL}${PORT}`))

provider.addRouter(userRouter)

provider.listen(Number(PORT), () => console.log(`Server started on port ${PORT}`))
