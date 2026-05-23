import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidatorError,
} from 'infra/errors'
import * as cookie from 'cookie'
import session from 'models/session'

function onErrorHandler(error, req, res) {
  if (error instanceof ValidatorError || error instanceof NotFoundError) {
    return res.status(error.statusCode).json(error)
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(res)
    return res.status(error.statusCode).json(error)
  }

  const errorObject = new InternalServerError({
    cause: error,
  })
  console.error(errorObject)
  res.status(errorObject.statusCode).json(errorObject)
}

function onNoMatchHandler(req, res) {
  const errorObject = new MethodNotAllowedError()
  res.status(405).json(errorObject)
}

async function setSessionCookie(token, res) {
  const setCookie = cookie.serialize('session_id', token, {
    path: '/',
    secure: process.env.NODE_ENV == 'production',
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    httpOnly: true,
  })

  res.setHeader('Set-Cookie', setCookie)
}

async function clearSessionCookie(res) {
  const setCookie = cookie.serialize('session_id', 'invalid', {
    path: '/',
    secure: process.env.NODE_ENV == 'production',
    maxAge: -1,
    httpOnly: true,
  })

  res.setHeader('Set-Cookie', setCookie)
}
const controller = {
  errorsHandlers: { onError: onErrorHandler, onNoMatch: onNoMatchHandler },
  setSessionCookie,
  clearSessionCookie,
}

export default controller
