import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adaper'
import { adaptRoute } from '../adapters/express-route-adaper'
import { makeSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeSurveyController()))
}
