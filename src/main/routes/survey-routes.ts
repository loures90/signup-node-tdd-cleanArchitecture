import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adaper'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '../factories/controllers/survey/load-surveys/add-survey-controller-factory'
import { adminAuth } from '../middlewares/admin-auth-middleware'
import { userAuth } from '../middlewares/user-auth-middleware copy'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveyController()))
}
