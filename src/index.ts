import dotenv from 'dotenv'
dotenv.config()

import Provider from './provider'
import { userRouter } from './routers/user'
import { json, url } from './middlewares'

//memory db
import { Database } from './db'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const databaseInstance: Database = Database.getInstance()

const provider = new Provider(databaseInstance)

provider.use(json)
provider.use(url(`${BASE_URL}${PORT}`))

provider.addRouter(userRouter)

provider.listen(Number(PORT), () => console.log(`Server started on port ${PORT}`))
