import { post } from 'utils/api.js'
import database from 'infra/database.js'
import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await database.query('drop schema public cascade; create schema public; ')
})
test('Espera as Migrations serem executadas', async () => {
  const response1 = await post('migrations')
  expect(response1.status).toBe(201)
  const response1Body = await response1.json()
  expect(Array.isArray(response1Body)).toBe(true)
  expect(response1Body.length).toBeGreaterThan(0)

  const response2 = await post('migrations', {
    method: 'POST',
  })
  expect(response2.status).toBe(200)
  const response2Body = await response2.json()
  expect(Array.isArray(response2Body)).toBe(true)
  expect(response2Body.length).toBe(0)
})
