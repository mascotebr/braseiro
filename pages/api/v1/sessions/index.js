import controller from 'infra/controller'
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

  await controller.setSessionCookie(newSession.token, res)

  return res.status(201).json(newSession)
}
