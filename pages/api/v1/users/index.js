import controller from 'infra/controller'
import { createRouter } from 'next-connect'
import user from 'models/user'
const router = createRouter()

router.post(postHandler)

export default router.handler(controller.errorsHandlers)

async function postHandler(req, res) {
  const userInputValues = req.body
  const newUser = await user.create(userInputValues)
  return res.status(201).json(newUser)
}
