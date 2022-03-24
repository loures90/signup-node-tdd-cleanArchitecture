import { SignUpController } from '../../../presentation/controllers/signup/signup-controler'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-error-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validation = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
