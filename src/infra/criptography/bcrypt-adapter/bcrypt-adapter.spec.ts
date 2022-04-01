import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<String> {
    return await new Promise(resolve => resolve('hash'))
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }

}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcypt adapter', () => {
  describe('hash()', () => {
    test('Should call hash adapter with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throws if bcrypt hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
        () => {
          throw new Error()
        }
      )
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'hashed_value')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
    })

    test('Should return true when compare succed', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'hashed_value')
      expect(isValid).toBe(true)
    })

    test('Should returns false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const isValid = await sut.compare('any_value', 'hashed_value')
      expect(isValid).toBe(false)
    })

    test('Should returns false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const isValid = await sut.compare('any_value', 'hashed_value')
      expect(isValid).toBe(false)
    })

    test('Should throws if bcrypt compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
        () => {
          throw new Error()
        }
      )
      const promise = sut.compare('any_value', 'hashed_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
