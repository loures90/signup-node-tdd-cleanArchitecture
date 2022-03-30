import { HttpRequest, Validation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'

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
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const sut = new AddSurveyController(validationStub)
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
