import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('Signup DbAddAccount ', () => {
  interface SutTypes {
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
    sut: DbAddAccount
  }
  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
      encrypterStub,
      addAccountRepositoryStub,
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

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (AddAccountData: AddAccountModel): Promise<AccountModel> {
        const account = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'valid_encrypted_password'
        }
        return await new Promise(resolve => resolve(account))
      }
    }
    return new AddAccountRepositoryStub()
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

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const result = sut.add(account)
    await expect(result).rejects.toThrow()
  })

  test('Should call addAccountRepository with correct password', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
