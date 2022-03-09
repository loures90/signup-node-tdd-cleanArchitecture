import request from 'supertest'
import app from '../config/app'

describe('Signup', () => {
  test('Should make signup and return 200 on success ', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(200)
  })
})
