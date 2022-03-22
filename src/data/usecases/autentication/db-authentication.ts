import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer, LoadAccountByEmailRepository, TokenGenerator } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) {
      return null
    }
    await this.hashComparer.compare(password, account.password)
    await this.tokenGenerator.generate(account.id)
    return null
  }
}
