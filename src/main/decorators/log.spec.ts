import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController decorator', () => {
  const makeFakeHttpResponse = (): HttpResponse => ({
    statusCode: 200,
    body: {
      email: 'valid_email@email.com',
      name: 'valid_name',
      password: 'password'
    }
  })

  const makeFakeHttpRequest = (): HttpRequest => ({
    body: {
      email: 'valid_email@email.com',
      name: 'valid_name',
      password: 'password',
      passwodConfirmation: 'password'
    }
  })

  interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut,
      controllerStub,
      logErrorRepositoryStub
    }
  }

  const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = makeFakeHttpResponse()
        return await new Promise(resolve => resolve(httpResponse))
      }
    }
    return new ControllerStub()
  }

  const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogControllerErrorStub implements LogErrorRepository {
      async logError (stack: string): Promise<void> {
        return await new Promise(resolve => resolve())
      }
    }
    return new LogControllerErrorStub()
  }

  test('Shoul call call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Shoul return the same result of controller handle', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeHttpResponse())
  })

  test('Shoul call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
