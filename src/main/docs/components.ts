import { apiKeyAuthSchema } from './schemas/'
import { badRequest, unauthorized, serverError, forbidden, notFound } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  serverError,
  forbidden,
  notFound
}
