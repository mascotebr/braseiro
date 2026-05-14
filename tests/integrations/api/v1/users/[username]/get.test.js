import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})
describe('GET /api/v1/users/[username]', () => {
  describe('Anonymous user', () => {
    test('With exact case match', async () => {
      await orchastrador.createUser({
        username: 'UsuarioMesmoCase',
      })

      const response = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioMesmoCase',
        {},
      )
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'UsuarioMesmoCase',
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })
    })

    test('With exact missmatch', async () => {
      await orchastrador.createUser({
        username: 'UsuarioDiferenteCase',
      })

      const response = await fetch(
        'http://localhost:3000/api/v1/users/usuariodiferentecase',
        {},
      )
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'UsuarioDiferenteCase',
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })
    })

    test('With not exist', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioNaoExistente2',
      )
      expect(response.status).toBe(404)

      const responseBody = await response.json()
      expect(responseBody).toEqual({
        name: 'NotFoundError',
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
        status_code: 404,
      })
    })
  })
})
