import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { ObjectId } from 'mongodb'

let accountsCollection
let surveysCollection
let surveyResultsCollection

const makeFakeAccessToken = async (): Promise<string> => {
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
  return accessToken
}

describe('Surveys Results Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultsCollection = await MongoHelper.getCollection('surveys')
    await surveyResultsCollection.deleteMany({})

    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('PUT Save-Survey-Result', () => {
    test('Should return 403 on save-survey-result without access-token', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save-survey-result success', async () => {
      const accessToken = await makeFakeAccessToken()
      const survey = await surveysCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'answer_1'
        }],
        date: new Date()
      })
      const id = survey.insertedId.toString() as string

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'answer_1'
        })
        .expect(200)
    })
  })
})
