import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Requerid Fields', () => {
  test('Should return Missing Params if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const result = sut.validate({})
    expect(result).toEqual(new MissingParamError('field'))
  })
})
