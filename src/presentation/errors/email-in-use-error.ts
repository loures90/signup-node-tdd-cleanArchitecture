export class EmailInUseError extends Error {
  constructor () {
    super('Email already in use error.')
    this.name = 'EmailInUseError'
  }
}
