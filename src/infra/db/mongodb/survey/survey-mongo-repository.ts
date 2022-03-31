import { AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (addSurveyData: AddSurveyModel): Promise<void> {
    const surveyData = { ...addSurveyData }
    const surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.insertOne(surveyData)
  }
}
