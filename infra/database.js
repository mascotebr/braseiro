import { Client } from 'pg'

async function query(queryObject) {
  let client = null
  try {
    client = await getNewClient()
    await client.connect()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    if (client != null) await client.end()
  }
}

async function getNewClient() {
  let client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  })
  return client
}

function getSSLValues() {
  // return process.env.NODE_ENV == `production` ? true : false
  return true
}

const database = {
  query: query,
  getNewClient: getNewClient,
}

export default database
