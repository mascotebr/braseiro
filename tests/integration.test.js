test('teste', async () => {
  const result = await fetch('http://localhost:3000/api/v1/status/')
  const serverVersion = await result.json()
  expect(serverVersion).toBe('17.6 (0d47993)')
})
