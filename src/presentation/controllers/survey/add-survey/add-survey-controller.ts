import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.validation.validate(httpRequest.body)
    return await new Promise(resolve => resolve(null))
  }
}
