export default {
  default: {
    mailer: {
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'frankie.crona@ethereal.email',
          pass: 'sjB7y7RwrTzvSzEmRp',
        },
      },
      message: {
        from: '"Expressio Mailer" <expressio@domain.com>',
      },
    },
  },
}
