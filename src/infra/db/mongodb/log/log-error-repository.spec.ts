import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-error-repository'

describe('Account Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('erros')
    await errorCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should create an error log on success in Mongodb', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
