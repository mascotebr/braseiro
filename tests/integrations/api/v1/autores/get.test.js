test('Ter exatamente as colunas esperadas', async () => {
  const result = await fetch('http://localhost:3000/api/v1/autores/')
  const autores = await result.json()

  expect(Object.keys(autores[0])).toEqual([
    'id',
    'nome_artistico',
    'slug',
    'bio',
    'email',
    'ativo',
    'id_usuario',
    'data_cadastro',
  ])
})

test('Ter buscado todos os autores ativos', async () => {
  const result = await fetch('http://localhost:3000/api/v1/autores/')
  const autores = await result.json()
  const autoresAtivos = autores.every((autor) => autor.ativo === true)
  expect(autoresAtivos.lenght).toEqual(autores.lenght)
})
