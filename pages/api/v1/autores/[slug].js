import { createApiRoute } from 'utils/api'
import database from 'infra/database'
export default createApiRoute({
  async GET(req, res) {
    const { slug } = req.query
    const result = await database.query({
      text: `SELECT
        a.id,
        a.nome_artistico,
        a.slug,
        a.bio,
        a.email,
        a.ativo,
        a.id_usuario,
        a.data_cadastro,

        json_agg(
          json_build_object(
            'id', i.id,
            'id_autor', i.id_autor,
            'src', i.src,
            'public_id', i.public_id,
            'tipo', i.tipo,
            'data_cadastro', i.data_cadastro
          )
        ) AS imagens

       FROM autores a
       JOIN imagens i ON i.id_autor = a.id 
       WHERE ativo = true AND slug = $1
       GROUP BY a.id;`,
      values: [slug],
    })

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Autor não encontrado' })
    }

    const autor = result.rows[0]
    res.status(200).json(autor)
  },
})
