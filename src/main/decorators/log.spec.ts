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
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    return {
      sut,
      controllerStub
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
})
