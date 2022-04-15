import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adaper'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { userAuth } from '../middlewares/user-auth-middleware'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', userAuth, adaptRoute(makeSaveSurveyResultController()))
}
