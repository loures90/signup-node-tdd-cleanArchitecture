import { SurveyModel } from '../../../../domain/models/survey'

export interface LoadSurveysRepository {
  loadSurveys(): Promise<SurveyModel[]>
}
