import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email Validator', () => {
  test('It should return false if email is not valid', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
