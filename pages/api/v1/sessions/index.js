import controller from 'infra/controller'
import * as cookie from 'cookie'
import { createRouter } from 'next-connect'
import authenticator from 'models/authenticator'
import session from 'models/session'
const router = createRouter()

router.post(postHandler)

export default router.handler(controller.errorsHandlers)

async function postHandler(req, res) {
  const userInputValues = req.body

  const authenticatedUser = await authenticator.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  )

  const newSession = await session.create(authenticatedUser.id)

  const setCookie = cookie.serialize('session_id', newSession.token, {
    path: '/',
    secure: process.env.NODE_ENV == 'production',
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    httpOnly: true,
  })

  res.setHeader('Set-Cookie', setCookie)

  return res.status(201).json(newSession)
}
