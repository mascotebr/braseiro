import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ValidatorError,
} from 'infra/errors'
function onErrorHandler(error, req, res) {
  if (error instanceof ValidatorError || error instanceof NotFoundError) {
    return res.status(error.statusCode).json(error)
  }

  const errorObject = new InternalServerError({
    cause: error,
    status: error.statusCode,
  })
  console.error(errorObject)
  res.status(errorObject.statusCode).json(errorObject)
}

function onNoMatchHandler(req, res) {
  const errorObject = new MethodNotAllowedError()
  res.status(405).json(errorObject)
}

const controller = {
  errorsHandlers: { onError: onErrorHandler, onNoMatch: onNoMatchHandler },
}

export default controller
