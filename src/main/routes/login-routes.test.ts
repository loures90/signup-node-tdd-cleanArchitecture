import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import bcrypt from 'bcrypt'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST signup', () => {
    test('Should make signup and return 200 on success ', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST Login', () => {
    test('Should make login and return 200 on success ', async () => {
      const accountsCollection = await MongoHelper.getCollection('accounts')
      const password = await bcrypt.hash('abc', 12)
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@email.com',
          password: 'abc'
        })
        .expect(200)
    })

    test('Should return 401 if account does not exist ', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'other_email@email.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
