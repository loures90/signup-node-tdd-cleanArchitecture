import { SaveSurveyResultController } from '../../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { makeSaveSurveyResultFactory } from '../../../use-cases/survey-result/save-survey-result/save-survey-result-factory'
import { makeLoadSurveyByIdFactory } from '../../../use-cases/survey/load-survey-by-id/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeLoadSurveyByIdFactory(), makeSaveSurveyResultFactory())
  return makeLogControllerDecoratorFactory(saveSurveyResultController)
}
