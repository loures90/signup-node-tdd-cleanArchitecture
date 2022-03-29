import { Validation } from '../../presentation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

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
