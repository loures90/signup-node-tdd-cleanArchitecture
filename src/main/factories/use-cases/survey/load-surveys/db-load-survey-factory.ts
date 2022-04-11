import { DbLoadSurveys } from '../../../../../data/usecases/survey/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeLoadSurveysFactory = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
