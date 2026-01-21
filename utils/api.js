import { InternalServerError, MethodNotAllowedError } from 'infra/errors'

async function get(url) {
  return await fetch(url)
}

async function post(url, body) {
  return await fetch(url, { method: 'POST', body: body })
}

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

export const errors = { onErrorHandler, onNoMatchHandler }

export { get, post }
