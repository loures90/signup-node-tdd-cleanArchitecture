import { HttpRequest, Validation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}
const httpRequest: HttpRequest = {
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answers: 'any_answer'
    }]
  }
}
describe('Add Survey', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const surveySpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(surveySpy).toBeCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answers: 'any_answer'
      }]
    })
  })
})
