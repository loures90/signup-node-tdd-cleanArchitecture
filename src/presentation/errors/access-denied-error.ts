export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied for user.')
    this.name = 'AccessDeniedError'
  }
}
