/**
 * Default configs
 *
 * @copyright Copyright (c) 2019, hugw.io
 * @author Hugo W - contact@hugw.io
 * @license MIT
 */

export default {
  default: {
    mailer: {
      enabled: true,
      // https://nodemailer.com/smtp/
      transport: null,

      // https://nodemailer.com/message/
      message: {},
    },
  },

  // Test environment
  test: {
  },

  // Production environment
  production: {
    ethereal: false,
  },
}
