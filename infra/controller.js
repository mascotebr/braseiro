import { InternalServerError, MethodNotAllowedError } from 'infra/errors'
function onErrorHandler(error, req, res) {
  const errorObject = new InternalServerError({
    cause: error,
  })
  console.error(errorObject)
  res.status(500).json(errorObject)
}

function onNoMatchHandler(req, res) {
  const errorObject = new MethodNotAllowedError()
  res.status(405).json(errorObject)
}

const controller = {
  errorsHandlers: { onError: onErrorHandler, onNoMatch: onNoMatchHandler },
}

export default controller
