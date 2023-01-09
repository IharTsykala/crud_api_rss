import request from 'supertest'

import Provider from '../src/provider'
import { json } from '../src/middlewares/json'
import { url } from '../src/middlewares/url'
import { userRouter } from '../src/routers/user'
import { dataBase } from '../src/services/user'

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

const provider = new Provider()

provider.use(json)
provider.use(url(`${BASE_URL}${PORT}`))

provider.addRouter(userRouter)

const server = provider.server

let id = ''

describe('First scenario', () => {
  it('should return empty array', async () => {
    const res = await request(server).get('/api/users')

    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body).toEqual([])
  })

  it('should create new user and return successfully message', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        name: 'Ihar Tsykala',
        age: 31,
        hobbies: ['sport, mounts'],
      })

    id = dataBase.users[dataBase.users.length - 1].id

    expect(res.statusCode).toBe(201)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('User was successfully added')
  })

  it('should return last added user by specified id', async () => {
    const res = await request(server).get(`/api/users/${id}`)

    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.name).toBe('Ihar Tsykala')
    dataBase.users.length = 0
  })
})

describe('Second scenario', () => {
  it('should create new user and return successfully message', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        name: 'Denis Ivanov',
        age: 51,
        hobbies: ['running'],
      })

    id = dataBase.users[dataBase.users.length - 1].id

    expect(res.statusCode).toBe(201)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('User was successfully added')
  })

  it('should return message about id is not uuid', async () => {
    const res = await request(server).get('/api/users/123')

    expect(res.statusCode).toBe(400)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('id needed to be uuid')
  })

  it('should return array with length equal 1', async () => {
    const res = await request(server).get('/api/users')

    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.length).toBe(1)
  })

  it('should delete user by id', async () => {
    const res = await request(server).delete(`/api/users/${id}`)

    expect(res.statusCode).toBe(204)
  })

  it('should return empty array', async () => {
    const res = await request(server).get('/api/users')

    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body).toEqual([])
  })
})

describe('Third scenario', () => {
  it('should create new user and return successfully message', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        name: 'Ekaterina Anisovich',
        age: 51,
        hobbies: ['painting'],
      })

    id = dataBase.users[dataBase.users.length - 1].id

    expect(res.statusCode).toBe(201)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('User was successfully added')
  })

  it('should return message that user by id not found', async () => {
    const res = await request(server).get('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(404)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('Is not exist user with this id')
  })

  it('should return message that body is required', async () => {
    const res = await request(server).put('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(400)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('Body is required')
  })

  it('should return message that user by id not found', async () => {
    const res = await request(server).delete('/api/users/3e3ca8d8-fa44-59bc-722c-4568425bb678')

    expect(res.statusCode).toBe(404)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.message).toBe('Is not exist user with this id')
  })

  it('should delete user by id', async () => {
    const res = await request(server).delete(`/api/users/${id}`)

    expect(res.statusCode).toBe(204)
  })

  it('should return length users equal 0', async () => {
    const res = await request(server).get('/api/users/')

    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toEqual('application/json')
    expect(res.body.length).toEqual(0)
  })
})
