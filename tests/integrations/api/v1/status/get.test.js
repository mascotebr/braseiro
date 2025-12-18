import { get } from 'utils/api'
test('Espera o Status do banco de dados', async () => {
  const response = await get('status')
  expect(response.status).toBe(200)

  const responseBody = await response.json()

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString()
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt)

  expect(responseBody.dependencies.database.version).toEqual('17.7')
  expect(responseBody.dependencies.database.max_connections).toEqual(901)
  expect(responseBody.dependencies.database.opened_connections).toEqual(1)
})
