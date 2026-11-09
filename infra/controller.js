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

async function injectAnonymousOrUser(req, res, next) {
  if (req.cookies.session_id) {
    await injectAuthenticatedUser(req)
    return next()
  }

  await injectAnonymousUser(req)
  return next()
}

async function injectAuthenticatedUser(req) {
  const sessionToken = req.cookies.session_id
  const sessionObject = await session.findOneByValidToken(sessionToken)
  const userObject = await user.findOneById(sessionObject.user_id)

  req.context = {
    ...req.context,
    user: userObject,
  }
}

function injectAnonymousUser(req) {
  const anonymousUserObject = {
    features: ['read:activation_token', 'create:session', 'create:user'],
  }

  req.context = {
    ...req.context,
    user: anonymousUserObject,
  }
}

function canRequest(feature) {
  return function (req, res, next) {
    if (req.context.user.features.includes(feature)) {
      return next()
    }

    throw new ForbiddenError({
      message: `Você não pode realizar esta ação.`,
      action: `Verifique se você contém a permissão ${feature}.`,
    })
  }
}
const controller = {
  errorsHandlers: { onError: onErrorHandler, onNoMatch: onNoMatchHandler },
  setSessionCookie,
  clearSessionCookie,
  injectAnonymousOrUser,
  canRequest,
}

export default controller
