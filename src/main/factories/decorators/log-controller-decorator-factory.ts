import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-error-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-decorator'

export const makeLogControllerDecoratorFactory = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
