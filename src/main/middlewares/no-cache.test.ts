import request from 'supertest'
import app from '../config/app'
import { noCache } from './no-cache'

describe('No-Cache', () => {
  test('Should desable cache', async () => {
    app.get('/no-cache', noCache, (req, res) => {
      res.send()
    })
    await request(app)
      .get('/no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
      .expect('pargma', 'no-cache')
  })
})
