import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { makeLoadSurveysFactory } from '../../../use-cases/survey/load-surveys/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeLoadSurveysFactory())
  return makeLogControllerDecoratorFactory(loadSurveysController)
}
