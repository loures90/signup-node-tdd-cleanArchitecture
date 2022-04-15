import { adaptMiddleware } from '../adapters/express-middleware-adaper'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const userAuth = adaptMiddleware(makeAuthMiddleware())
