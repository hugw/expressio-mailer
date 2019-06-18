import config from '@/config'

describe('Expressio Mailer / Configs', () => {
  it('should match a valid config object', () => {
    expect(config).toEqual({
      default: {
        mailer: {
          enabled: true,
          transport: null,
          message: {},
        },
      },
      test: {
      },
      production: {
        ethereal: false,
      },
    })
  })
})
