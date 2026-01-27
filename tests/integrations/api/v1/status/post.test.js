import methods from 'infra/methods'
import orchastrador from 'tests/orchastrador.js'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
})

describe('POST /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving MethodNotAllowedError', async () => {
      const response = await methods.post('http://localhost:3000/api/v1/status')
      console.log(response)
      const data = await response.json()
      expect(data).toEqual({
        name: 'MethodNotAllowedError',
        message: 'Metodo não permitido por esse endpoint.',
        action:
          'Verifique se o metodo HTTP enviado é valido para esse endpoint.',
        status_code: 405,
      })
    })
  })
})
