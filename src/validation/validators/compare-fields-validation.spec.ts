import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  interface SutTypes {
    sut: CompareFieldsValidation
  }
  const makeSut = (): SutTypes => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    return {
      sut
    }
  }
  test('Should return Missing Params if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should return null if validation succed', () => {
    const { sut } = makeSut()
    const result = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(result).toEqual(null)
  })
})
