import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountsCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeFalsy()
    })
  })

  describe('loadByEmail()', () => {
    test('Should update accessToken updateAccessToken  success', async () => {
      const sut = makeSut()
      const result = await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      const id = result.insertedId.toString()
      await sut.updateAccessToken(id, 'access_token')
      const account = await accountsCollection.findOne({ _id: result.insertedId })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('access_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an user by accessToken when loadToken is on success', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
    })

    test('Should return an user by accessToken when loadToken is on success with role', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
    })

    test('Should return null loadToken does not find user', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeFalsy()
    })
  })
})
