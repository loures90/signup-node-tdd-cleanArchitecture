import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultRepository } from '../../../../data/usecases/save-survey-results/db-save-survey-result-protocols'
// import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<any> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultsCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    const id = result.value._id.toString()
    delete result.value._id
    return { ...result.value, id: id }
  }
}
