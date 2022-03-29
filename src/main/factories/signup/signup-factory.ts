import { SignUpController } from '../../../presentation/controllers/signup/signup-controler'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-error-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '../../../data/usecases/autentication/db-authentication'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwt_secret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validation = makeSignUpValidation()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, validation, dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
