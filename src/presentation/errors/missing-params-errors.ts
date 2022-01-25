export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`missing parama: ${paramName}`)
    this.name = 'Missing Param Error'
  }
}
