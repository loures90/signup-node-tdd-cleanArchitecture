import { InvalidParamError, ServerError } from '../../errors'
import { LoginController } from './login'
import { Authentication } from '../../../domain/usecases/authentication'
import { badRequest, ok, unauthorized } from '../../helpers/http-helper'
import { HttpRequest, Validation } from './login-protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})
interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
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
  test('Should call authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toBeCalledWith('any_email@email.com', 'any_password')
  })

  test('Should return 401 if invalid authentication is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return an accessToken if valid email and password are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok('any_valid_token'))
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('any_param'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('any_param')))
  })

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    let httpResponse
    try {
      httpResponse = await sut.handle(httpRequest)
    } catch (error) {
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError(error))
    }
  })
})
