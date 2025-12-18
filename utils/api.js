function createApiRoute(handlers) {
  return async (req, res) => {
    const fn = handlers[req.method]
    if (!fn) {
      res.setHeader('Allow', Object.keys(handlers))
      return res.status(405).end()
    }
    return await fn(req, res)
  }
}

async function get(url) {
  const baseUrl = process.env.BASE_URL_API
  return await fetch(`${baseUrl}${url}`)
}

async function post(url, body) {
  const baseUrl = process.env.BASE_URL_API
  return await fetch(`${baseUrl}${url}`, { method: 'POST', body: body })
}

async function apiFunction(req, res, methods) {
  //Se o metodo não for declarado volta 405
  if (!Object.keys(methods).includes(req.method)) {
    return res.status(405).json({ error: `Method "${req.method}" not allowed` })
  }
  let configParams
  if (Object.keys(methods).includes('CONFIG')) {
    configParams = await methods['CONFIG']()
  }

  try {
    await methods[req.method](configParams)
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (Object.keys(methods).includes('DISMISS')) {
      await methods['DISMISS'](configParams)
    }
  }
}
export { createApiRoute, get, post, apiFunction }
