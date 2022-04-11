import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'
import Mockdate from 'mockdate'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    answer: 'any_answer'
  },
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: 'any_account_id'
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('Add Survey', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const surveySpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(surveySpy).toBeCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyByid returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 when LoadSurveyByid throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    await expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should 403 when answer is not valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        accountId: 'any_account_id',
        answer: 'wrong_answer'
      },
      params: {
        surveyId: 'any_survey_id'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
})
