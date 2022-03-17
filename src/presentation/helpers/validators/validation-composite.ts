import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error | null {
    for (const validation of this.validations) {
      const err = validation.validate(input)
      if (err) {
        return err
      }
    }
    return null
  }
}
