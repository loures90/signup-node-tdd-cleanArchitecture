import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveysCollection: Collection
let surveyResultsCollection: Collection
let accountsCollection: Collection

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  const makeSurveyId = async (): Promise<string> => {
    const res = await surveysCollection.insertOne({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    })
    return res.insertedId.toString()
  }

  const makeAccountId = async (): Promise<string> => {
    const result = await accountsCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    return result.insertedId.toString()
  }

  describe('SaveSurveyResult()=>', () => {
    test('Should save a survey result on success', async () => {
      const sut = makeSut()
      const survey = await sut.save({
        surveyId: await makeSurveyId(),
        accountId: await makeAccountId(),
        answer: 'any_answer',
        date: new Date()
      })
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey.accountId).toBeTruthy()
      expect(survey.answer).toBe('any_answer')
      expect(survey.date).toBeTruthy()
    })
  })
})
