import controller from 'infra/controller'
import { createRouter } from 'next-connect'
import user from 'models/user'
const router = createRouter()

router.get(getHandler)
router.patch(patchHandler)

export default router.handler(controller.errorsHandlers)

async function getHandler(req, res) {
  const username = req.query.username
  const userFound = await user.findOneByUsername(username)
  return res.status(200).json(userFound)
}

async function patchHandler(req, res) {
  const username = req.query.username
  const userInputValues = req.body
  const userUpdated = await user.update(username, userInputValues)
  return res.status(200).json(userUpdated)
}
