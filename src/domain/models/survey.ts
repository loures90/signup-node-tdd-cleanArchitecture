export interface SurveyAnswersModel {
  image: string
  answer: string
}

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}
