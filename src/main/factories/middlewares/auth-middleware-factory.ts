import { AuthMiddleware } from '../../../presentation/middleware/auth-middleware'
import { Middleware } from '../../../presentation/protocols'
import { makeLoadAccountByToken } from '../use-cases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role)
}
