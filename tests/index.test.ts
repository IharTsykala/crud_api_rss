import request from 'supertest'

import Provider from '../src/provider'

import { userRouter } from '../src/routers/user'
import { json, url } from '../src/middlewares'
import { HEADERS, ROUTS_API, STATUS_CODES } from '../src/constants'

//memory db
import { Database } from '../src/db'

const dataBase: Database = Database.getInstance()

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const provider = new Provider(dataBase)

provider.use(json)
provider.use(url(`${BASE_URL}${PORT}`))

provider.addRouter(userRouter)

const server = provider.server

let id = ''

describe('First scenario', () => {
  it('should return empty array', async () => {
    const res = await request(server).get(ROUTS_API.USERS)

    expect(res.statusCode).toBe(STATUS_CODES['200'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body).toEqual([])
  })

  it('should create new users and return successfully message', async () => {
    const user = {
      name: 'Ihar Tsykala',
      age: 31,
      hobbies: ['sport, mounts'],
    }
    const res = await request(server).post(ROUTS_API.USERS).send(user)

    id = dataBase.data.users[dataBase.data.users.length - 1].id

    const { id: idUser, ...responseUser } = res.body

    expect(res.statusCode).toBe(STATUS_CODES['201'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(JSON.stringify(responseUser)).toBe(JSON.stringify(user))
  })

  it('should return last added users by specified id', async () => {
    const res = await request(server).get(`${ROUTS_API.USERS}${id}`)

    expect(res.statusCode).toBe(STATUS_CODES['200'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.name).toBe('Ihar Tsykala')
    dataBase.data.users.length = 0
  })
})

describe('Second scenario', () => {
  it('should create new users and return successfully message', async () => {
    const user = {
      name: 'Denis Ivanov',
      age: 51,
      hobbies: ['running'],
    }
    const res = await request(server).post(ROUTS_API.USERS).send(user)

    id = dataBase.data.users[dataBase.data.users.length - 1].id

    const { id: idUser, ...responseUser } = res.body

    expect(res.statusCode).toBe(STATUS_CODES['201'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(JSON.stringify(responseUser)).toBe(JSON.stringify(user))
  })

  it('should return message about id is not uuid', async () => {
    const res = await request(server).get(`${ROUTS_API.USERS}123`)

    expect(res.statusCode).toBe(STATUS_CODES['400'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.message).toBe('id needed to be uuid')
  })

  it('should return array with length equal 1', async () => {
    const res = await request(server).get(ROUTS_API.USERS)

    expect(res.statusCode).toBe(STATUS_CODES['200'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.length).toBe(1)
  })

  it('should delete users by id', async () => {
    const res = await request(server).delete(`${ROUTS_API.USERS}${id}`)

    expect(res.statusCode).toBe(STATUS_CODES['204'])
  })

  it('should return empty array', async () => {
    const res = await request(server).get(ROUTS_API.USERS)

    expect(res.statusCode).toBe(STATUS_CODES['200'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body).toEqual([])
  })
})

describe('Third scenario', () => {
  it('should create new users and return successfully message', async () => {
    const user = {
      name: 'Ekaterina Anisovich',
      age: 51,
      hobbies: ['painting'],
    }
    const res = await request(server).post(ROUTS_API.USERS).send(user)

    id = dataBase.data.users[dataBase.data.users.length - 1].id

    const { id: idUser, ...responseUser } = res.body

    expect(res.statusCode).toBe(STATUS_CODES['201'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(JSON.stringify(responseUser)).toBe(JSON.stringify(user))
  })

  it('should return message that users by id not found', async () => {
    const res = await request(server).get('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(STATUS_CODES['404'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.message).toBe('Is not exist users with this id')
  })

  it('should return message that body is required', async () => {
    const res = await request(server).put('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(STATUS_CODES['400'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.message).toBe('Body is required')
  })

  it('should return message that users by id not found', async () => {
    const res = await request(server).delete('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(STATUS_CODES['404'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.message).toBe('Is not exist users with this id')
  })

  it('should delete users by id', async () => {
    const res = await request(server).delete(`${ROUTS_API.USERS}${id}`)

    expect(res.statusCode).toBe(STATUS_CODES['204'])
  })

  it('should return length users equal 0', async () => {
    const res = await request(server).get(ROUTS_API.USERS)

    expect(res.statusCode).toBe(STATUS_CODES['200'])
    expect(res.header['content-type']).toEqual(HEADERS.CONTENT_TYPES['Content-Type'])
    expect(res.body.length).toEqual(0)
  })
})
