import { ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.loadSurveys.load()
    return ok(result)
  }
}
