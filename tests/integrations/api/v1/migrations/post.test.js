import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
})
describe('GET /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    describe('Running pending migrations', () => {
      test('For first time', async () => {
        const response = await fetch(
          'http://localhost:3000/api/v1/migrations',
          { method: 'POST' },
        )
        expect(response.status).toBe(201)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBeGreaterThan(0)
      })
      test('For second time', async () => {
        const response = await fetch(
          'http://localhost:3000/api/v1/migrations',
          { method: 'POST' },
        )
        expect(response.status).toBe(200)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBe(0)
      })
    })
  })
})
