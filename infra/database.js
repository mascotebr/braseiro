import { Client } from 'pg'
import { ServiceError } from './errors'

async function query(queryObject) {
  let client
  try {
    client = await getNewClient()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    const sericeError = new ServiceError({
      message: 'Erro no serviço Database ou na Query.',
      cause: error,
    })
    throw sericeError
  } finally {
    await client?.end()
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
  await client.connect()
  return client
}

function getSSLValues() {
  return process.env.NODE_ENV == 'production'
}

const database = {
  query,
  getNewClient,
}

export default database
