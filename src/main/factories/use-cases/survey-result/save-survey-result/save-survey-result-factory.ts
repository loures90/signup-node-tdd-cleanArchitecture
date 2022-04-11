import { DbSaveSurveyResult } from '../../../../../data/usecases/survey-result/save-survey-results/bd-save-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeSaveSurveyResultFactory = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
