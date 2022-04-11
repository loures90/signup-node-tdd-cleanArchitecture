import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey-result/save-survey-result-repository'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
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
    if (!result.value?._id) {
      return null
    }
    const survey: SurveyResultModel = {
      id: result.value._id.toString(),
      surveyId: result.value.surveyId,
      accountId: result.value.accountId,
      answer: result.value.answer,
      date: result.value.date
    }
    return survey
  }
}
