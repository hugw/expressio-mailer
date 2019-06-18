/**
 * Expressio Mailer
 *
 *
 * @copyright Copyright (c) 2019, hugw.io
 * @author Hugo W - contact@hugw.io
 * @license MIT
 */

import Joi from 'joi'
import ndtk from 'ndtk'
import { sanitize, assert } from 'expressio'
import merge from 'lodash/merge'
import nodemailer from 'nodemailer'
import chalk from 'chalk'
import util from 'util'

/**
 * log
 *
 * Format mailer messages
 * and send to logger
 */
const log = (info) => {
  const opts = { colors: true, compact: false, breakLength: Infinity }

  // Update inspect colors
  util.inspect.styles.string = 'white'

  const header = 'Email sent'
  const response = chalk.gray(`Response → ${util.inspect(info.response, opts)}`)
  const debug = chalk.gray(`Debug URL → ${util.inspect(info.debug, opts)}`)

  return {
    ...info,
    message: `${header} \n ${response} \n ${debug}`,
  }
}

/**
 * Object schemas
 * to validate configuration
 */
const schema = Joi.object({
  enabled: Joi.boolean().required(),
  transport: Joi.object().required(),
  message: Joi.object(),
})

/**
 * Initializer
 */
export default (server) => {
  // Load and sanitize config variables
  const defaults = ndtk.config(ndtk.req('./config'))
  const uncheckedConfig = merge(defaults, server.config)
  const config = sanitize(uncheckedConfig.mailer, schema, 'Invalid Mailer config')

  if (!config.enabled) return

  // Expose local configs
  // to the server object
  server.config = {
    ...server.config,
    mailer: config,
  }

  const transporter = nodemailer.createTransport(config.transport, config.message)

  /**
   * Dispatch email
   */
  transporter.dispatch = async (msg) => {
    try {
      const info = await transporter.sendMail(msg)

      const response = {
        ...info,
        content: msg.text || msg.html || '',
      }

      const debug = nodemailer.getTestMessageUrl(info) || null

      server.logger.info(log({ response, debug }))

      return info
    } catch (err) {
      err.message = `Mailer error: ${err.message}`
      throw err
    }
  }

  // Expose Mailer to the server object
  server.mailer = transporter

  // Verify connection
  server.events.on('beforeStart', async () => {
    try {
      await transporter.verify()
      server.logger.info('Mailer: Connected')
    } catch (err) {
      assert(false, err)
    }
  })
}
