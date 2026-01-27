async function get(url) {
  return await fetch(url)
}

async function post(url, body) {
  return await fetch(url, { method: 'POST', body: body })
}

const methods = { get, post }

export default methods
