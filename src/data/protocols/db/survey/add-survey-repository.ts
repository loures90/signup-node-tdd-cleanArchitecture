import { AddSurveyModel } from '../../../usecases/survey/add-survey/db-add-survey-protocols'

export interface AddSurveyRepository {
  add(addSurveyData: AddSurveyModel): Promise<void>
}
