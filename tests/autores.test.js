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

test('Ter buscado o detalhe do autor', async () => {
  const result = await fetch('http://localhost:3000/api/v1/autores/teste')
  const autor = await result.json()
  expect(autor.id).toEqual(1)
  var check = true
  for (const key in autor) {
    if (Object.prototype.hasOwnProperty.call(autor, key)) {
      const value = autor[key]
      if (value == null || value == undefined) {
        check = false
      }
    }
  }

  expect(check).toEqual(true)
})
