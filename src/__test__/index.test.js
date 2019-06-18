import request from 'supertest'

import mailer from '@'
import app from './fixtures/demo/app'

describe('Expressio Mailer', () => {
  const on = jest.fn()

  const config = attrs => ({
    config: {
      mailer: {
        enabled: true,
        transport: {},
        ...attrs,
      },
    },
  })

  afterEach(() => {
    on.mockClear()
  })

  it('should load the initializer and expose an api to the server', () => {
    const server = { events: { on }, ...config() }
    mailer(server)

    expect(Object.keys(server.mailer.dispatch)).toBeTruthy()
    expect(on).toHaveBeenCalledTimes(1)
  })

  it('should not load the initializer if enabled is set to "false"', () => {
    const server = { events: { on }, ...config({ enabled: false }) }
    mailer(server)

    expect(server.mailer).toBeFalsy()
    expect(on).toHaveBeenCalledTimes(0)
  })

  it('given no "transport" config, it should throw an error with proper message', () => {
    const server = { events: { on }, ...config({ transport: undefined }) }
    const fn = () => mailer(server)
    expect(fn).toThrow('Invalid Mailer config: "transport" must be an object')
  })

  it('given an invalid "transport" config, it should throw an error with proper message', () => {
    const server = { events: { on }, ...config({ transport: null }) }
    const fn = () => mailer(server)
    expect(fn).toThrow('Invalid Mailer config: "transport" must be an object')
  })

  it('given an invalid "message" config, it should throw an error with proper message', () => {
    const server = { events: { on }, ...config({ message: null }) }
    const fn = () => mailer(server)
    expect(fn).toThrow('Invalid Mailer config: "message" must be an object')
  })
})

describe('Expressio Mongo / Demo', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(() => {
    app.stop()
  })

  it('(GET /public) should dispatch an email successfully', async () => {
    const response = await request(app).get('/dispatch')
    expect(response.status).toBe(204)
  }, 10000)
})
