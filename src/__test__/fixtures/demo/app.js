import expressio from 'expressio'
import mailer from '@'

const app = expressio()
app.initialize('mailer', mailer)

app.get('/dispatch', async (req, res) => {
  const template = {
    to: 'someone@domain.com',
    subject: 'Subject',
    text: 'Hello There!',
  }

  await req.app.mailer.dispatch(template)
  res.status(204).json()
})

export default app
