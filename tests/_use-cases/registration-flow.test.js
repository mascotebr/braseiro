import activation from 'models/activation'
import orchastrador from 'tests/orchastrador.js'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
  await orchastrador.deleteAllEmails()
})

describe('Use Case: Registration Flow (all successful)', () => {
  let createUserResponseBody
  test('Create user account', async () => {
    const createUserResponse = await fetch(
      'http://localhost:3000/api/v1/users',
      {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'RegistrationFlow',
          email: 'registration.flow@braseiro.com.br',
          password: 'Senha123',
        }),
      },
    )

    expect(createUserResponse.status).toBe(201)

    createUserResponseBody = await createUserResponse.json()

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: 'RegistrationFlow',
      email: 'registration.flow@braseiro.com.br',
      password: createUserResponseBody.password,
      features: ['read:activation_token'],
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    })
  })

  test('Receive activation email', async () => {
    const lastEmail = await orchastrador.getLastEmail()

    const activationToken = await activation.findOneByUserId(
      createUserResponseBody.id,
    )
    expect(lastEmail.sender).toBe('<contato@braseiro.com.br>')
    expect(lastEmail.recipients[0]).toBe('<registration.flow@braseiro.com.br>')
    expect(lastEmail.subject).toBe('Ative seu cadastro no Braseiro!')
    expect(lastEmail.text).toContain('RegistrationFlow')
    expect(lastEmail.text).toContain(activationToken.id)
  })

  test('Activation account', async () => {})

  test('Login', async () => {})

  test('Get user information', async () => {})
})
