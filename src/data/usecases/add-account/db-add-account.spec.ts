import { AccountModel, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

describe('Signup DbAddAccount ', () => {
  interface SutTypes {
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    sut: DbAddAccount
  }
  const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
      hasherStub,
      addAccountRepositoryStub,
      sut
    }
  }

  const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    return new HasherStub()
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
    password: 'valid_hashed_password'
  })

  const makeFakeAccount = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
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
