import { Pool } from 'pg'

async function query(queryObject, values) {
  let client
  client = await getNewClient()

  try {
    const result = await client.query(queryObject, values ?? [])
    return result
  } catch (error) {
  } finally {
    await client.release()
  }
}

async function getNewClient() {
  let pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  })
  const client = await pool.connect()
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
