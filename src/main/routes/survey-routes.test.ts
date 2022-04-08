import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { ObjectId } from 'mongodb'

let accountsCollection
let surveysCollection
describe('Surveys Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST Add-Survey', () => {
    test('Should return 403 on add-survey without access-token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(403)
    })

    test('Should 204 on add-survey success with valid-token', async () => {
      const result = await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        role: 'admin'
      })
      const id = result.insertedId.toString()
      const accessToken = sign({ id }, env.jwt_secret)
      await accountsCollection.updateOne({ _id: new ObjectId(id) },
        {
          $set: {
            accessToken
          }
        })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(204)
    })
  })

  describe('Get Load-Survey', () => {
    test('Should return 403 on load-survey without access-token', async () => {
      await request(app)
        .get('/api/surveys')
        .send()
        .expect(403)
    })

    test('Should return 200 on success', async () => {
      const result = await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      const id = result.insertedId.toString()
      const accessToken = sign({ id }, env.jwt_secret)
      await accountsCollection.updateOne({ _id: new ObjectId(id) },
        {
          $set: {
            accessToken
          }
        })

      await surveysCollection.insertMany([{
        id: 'any_id',
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      },
      {
        id: 'other_id',
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(200)
    })
  })
})
