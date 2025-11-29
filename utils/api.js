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

export { createApiRoute, get }
