import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldCompareName: string
  ) {}

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldCompareName]) {
      return new InvalidParamError(this.fieldCompareName)
    }
    return null
  }
}
