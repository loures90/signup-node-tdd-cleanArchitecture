import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adaper'
import { makeSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeSurveyController()))
}
