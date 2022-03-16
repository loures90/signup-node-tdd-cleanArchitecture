import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { Authentication } from '../../../domain/usecases/authentication'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_valid_token'))
    }
  }
  return new AuthenticationStub()
}

describe('Login Controller', () => {
  test('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_email.com',
        password: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call emailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(validatorSpy).toBeCalledWith('any_email@email.com')
  })

  test('Should return 500 if emailValidator returns error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toBeCalledWith('any_email@email.com', 'any_password'
    )
  })

  test('Should return 401 if invalid authentication is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
})
