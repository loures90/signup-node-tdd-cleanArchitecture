import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'
import Mockdate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accountId: 'any_account_id',
    answer: 'any_answer'
  },
  params: {
    surveyId: 'any_survey_id'
  }
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
})
