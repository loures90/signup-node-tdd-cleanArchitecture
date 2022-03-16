export class UnauthorizedError extends Error {
  constructor () {
    super('Unautorized error.')
    this.name = 'UnauthorizedError'
    this.stack = 'Unautorized error.'
  }
}
