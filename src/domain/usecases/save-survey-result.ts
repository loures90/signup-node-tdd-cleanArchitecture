import { SurveyAnswersModel } from '../models/survey'
import { SurveyResultModel } from '../models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyAnswersModel, 'id'>

export interface SaveSurveyResult {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
