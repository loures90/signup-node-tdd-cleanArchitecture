import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('Signup DbAddAccount ', () => {
  interface SutTypes{
    encrypterStub: Encrypter
    sut: DbAddAccount
  }
  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
      encrypterStub,
      sut
    }
  }

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    return new EncrypterStub()
  }
  test('Should call encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
