import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { makeAddSurveyFactory } from '../../../use-cases/survey/add-survey/db-add-survey-factory'
import { makeSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeSurveyValidation(), makeAddSurveyFactory())
  return makeLogControllerDecoratorFactory(addSurveyController)
}
