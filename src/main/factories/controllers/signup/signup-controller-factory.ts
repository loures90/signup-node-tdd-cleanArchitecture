import { SignUpController } from '../../../../presentation/controllers/signup/signup-controler'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthenticationFactory } from '../../use-cases/db-authentication/db-authentication-factory'
import { makeAddAccountFactory } from '../../use-cases/db-account/db-account-factory'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeAddAccountFactory(), makeSignUpValidation(), makeDbAuthenticationFactory())
  return makeLogControllerDecoratorFactory(signUpController)
}
