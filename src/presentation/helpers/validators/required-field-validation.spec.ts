import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Requerid Fields', () => {
  interface SutTypes {
    sut: RequiredFieldValidation
  }
  const makeSut = (): SutTypes => {
    const sut = new RequiredFieldValidation('field')
    return {
      sut
    }
  }
  test('Should return Missing Params if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return null if validation succed', () => {
    const { sut } = makeSut()
    const result = sut.validate({ field: 'any_value' })
    expect(result).toEqual(null)
  })
})
