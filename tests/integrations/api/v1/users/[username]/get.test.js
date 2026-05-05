import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})
describe('GET /api/v1/users', () => {
  describe('Anonymous user', () => {
    test('With exact case match', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'UsuarioMesmoCase',
          email: 'usuariomesmocase@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioMesmoCase',
        {},
      )
      expect(response2.status).toBe(200)

      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: 'UsuarioMesmoCase',
        email: 'usuariomesmocase@gmail.com',
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      })
    })

    test('With exact missmatch', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'UsuarioDiferenteCase',
          email: 'usuariodiferentecase@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/usuariodiferentecase',
        {},
      )
      expect(response2.status).toBe(200)

      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: 'UsuarioDiferenteCase',
        email: 'usuariodiferentecase@gmail.com',
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      })
    })

    test('With not exist', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'UsuarioNaoExistente',
          email: 'UsuarioNaoExistente@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioNaoExistente2',
        {},
      )
      expect(response2.status).toBe(404)

      const responseBody2 = await response2.json()
      expect(responseBody2).toEqual({
        name: 'NotFoundError',
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
        status_code: 404,
      })
    })
  })
})
