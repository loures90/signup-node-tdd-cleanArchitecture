import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('access_token'))
  },
  async verify (): Promise<string> {
    return await new Promise(resolve => resolve('any_value'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({
        id: 'any_id'
      }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('access_token')
    })

    test('Should throws if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('compare()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(compareSpy).toHaveBeenCalledWith('any_token', 'secret')
    })
    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const accessToken = await sut.decrypt('any_token')
      expect(accessToken).toBe('any_value')
    })
    test('Should throws if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
