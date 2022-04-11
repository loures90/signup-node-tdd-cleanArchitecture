import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/account/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (addAccountData: AddAccountModel): Promise<AccountModel> {
    const accountData = { ...addAccountData }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const id = result.insertedId.toString()
    return { ...addAccountData, id: id }
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    if (!result?._id) {
      return null
    }
    const account = {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password
    }
    return account
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token
        }
      })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      },
      {
        role: 'admin'
      }]
    })
    if (!result?._id) {
      return null
    }
    const account = {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password
    }
    return account
  }
}
