import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcypt adapter', () => {
  test('Should call bcypt adapter with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
