import { DbAuthentication } from '../../../../data/usecases/autentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeDbAuthenticationFactory = (): DbAuthentication => {
  const jwtAdapter = new JwtAdapter(env.jwt_secret)
  const bcryptAdapter = new BcryptAdapter(env.salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
