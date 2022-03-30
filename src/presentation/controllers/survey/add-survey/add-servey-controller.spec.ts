import { InvalidParamError, ServerError } from '../../../errors'
import { badRequest, noContent } from '../../../helpers/http/http-helper'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from './add-survey-protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {}
  }
  return new AddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answers: 'any_answer'
    }]
  }
})

describe('Add Survey', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const surveySpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(surveySpy).toBeCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answers: 'any_answer'
      }]
    })
  })

  test('Should return 400 if validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('any_param'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('any_param')))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const surveySpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(surveySpy).toBeCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answers: 'any_answer'
      }]
    })
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => {
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

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
