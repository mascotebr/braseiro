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
  return await fetch(`${baseUrl}${url}`, { method: 'POST' })
}

export { createApiRoute, get, post }
