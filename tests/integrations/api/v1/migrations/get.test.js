import { get } from 'utils/api.js'
import database from 'infra/database.js'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public; ')
}

test('Espera as Migrations não executadas', async () => {
  const response = await get('migrations')
  expect(response.status).toBe(200)
  const responseBody = await response.json()
  expect(Array.isArray(responseBody)).toBe(true)
  expect(responseBody.length).toBeGreaterThan(0)
})
