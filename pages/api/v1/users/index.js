import controller from 'infra/controller'
import { createRouter } from 'next-connect'
import user from 'models/user'
import activation from 'models/activation'
const router = createRouter()

router.post(postHandler)

export default router.handler(controller.errorsHandlers)

async function postHandler(req, res) {
  const userInputValues = req.body
  const newUser = await user.create(userInputValues)

  await activation.create()
  await activation.sendEmailToUser(newUser)

  return res.status(201).json(newUser)
}
