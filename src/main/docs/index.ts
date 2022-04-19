import { loginPath, surveyPath, signupPath, surveyResultPath } from './paths'
import { accountSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, signupParamsSchema, addSurveyParamsSchema, saveSurveyParamsSchema, surveyResultSchema } from './schemas'
import { badRequest, unauthorized, serverError, forbidden, notFound } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signupParams: signupParamsSchema,
    surveys: surveysSchema,
    addSurveyParams: addSurveyParamsSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    surveyResult: surveyResultSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    forbidden,
    notFound
  }
}
