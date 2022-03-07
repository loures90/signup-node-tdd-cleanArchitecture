import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'
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
        const account = makeValidAccountModel()
        return await new Promise(resolve => resolve(account))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeValidAccountModel = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_encrypted_password'
  })

  const makeFakeAccount = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  })

  test('Should call encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = makeFakeAccount()
    const result = sut.add(account)
    await expect(result).rejects.toThrow()
  })

  test('Should call addAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = makeFakeAccount()
    const result = sut.add(account)
    await expect(result).rejects.toThrow()
  })

  test('Should return a valid account when it succed', async () => {
    const { sut } = makeSut()
    const account = makeFakeAccount()
    const result = await sut.add(account)
    expect(result).toEqual(makeValidAccountModel())
  })
})
