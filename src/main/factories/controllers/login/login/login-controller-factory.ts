import { LoginController } from '../../../../../presentation/controllers/login/login/login-controler'
import { Controller } from '../../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthenticationFactory } from '../../../use-cases/account/authentication/db-authentication-factory'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthenticationFactory(), makeLoginValidation())
  return makeLogControllerDecoratorFactory(loginController)
}
