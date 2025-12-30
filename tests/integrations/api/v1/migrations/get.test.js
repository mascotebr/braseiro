import { get } from 'utils/api.js'
import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
})

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving pending migrations', async () => {
      const response = await get('migrations')
      expect(response.status).toBe(200)
      const responseBody = await response.json()
      expect(Array.isArray(responseBody)).toBe(true)
      expect(responseBody.length).toBeGreaterThan(0)
    })
  })
})
