import controller from 'infra/controller'
import { createRouter } from 'next-connect'
import user from 'models/user'
import session from 'models/session'
const router = createRouter()

router.get(getHandler)

export default router.handler(controller.errorsHandlers)

async function getHandler(req, res) {
  const sessionId = req.cookies.session_id

  const validSession = await session.findOneByValidToken(sessionId)

  await session.renew(validSession.id)
  await controller.setSessionCookie(validSession.token, res)

  const validUser = await user.findOneById(validSession.user_id)

  return res.status(200).json(validUser)
}
