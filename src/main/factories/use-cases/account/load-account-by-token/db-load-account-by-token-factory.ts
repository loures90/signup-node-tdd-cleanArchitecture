import { DbLoadAccountByToken } from '../../../../../data/usecases/account/load-Account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../../domain/usecases/account/load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwt_secret)
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
