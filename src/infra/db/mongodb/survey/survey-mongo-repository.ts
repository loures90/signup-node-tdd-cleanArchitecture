import { AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveyByIdRepository } from '../../../../data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (addSurveyData: AddSurveyModel): Promise<void> {
    const surveyData = { ...addSurveyData }
    const surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.insertOne(surveyData)
  }

  async loadSurveys (): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveysCollection.find().toArray()
    const result = []
    surveys.forEach(survey => {
      if (survey._id) {
        result.push({
          id: survey._id.toString(),
          question: survey.question,
          answers: survey.answers,
          data: survey.data
        })
      }
    })
    return result
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const result = await surveysCollection.findOne({ _id: new ObjectId(id) })
    if (!result?._id) {
      return null
    }
    const survey: SurveyModel = {
      id: result._id.toString(),
      question: result.question,
      answers: result.answers,
      date: result.date
    }
    return survey
  }
}
