import { createApiRoute } from 'utils/api'
import database from 'infra/database'

export default createApiRoute({
  async PUT(req, res) {
    const { id } = req.query
    const { nome_artistico, slug, bio, email } = req.body
    const result = await database.query({
      text: `UPDATE autores SET
        nome_artistico = $1,
        slug = $2,
        bio = $3,
        email = $4
      WHERE id = $5
      RETURNING *;
      `,
      values: [nome_artistico, slug, bio, email, id],
    })
    const autorEdited = result.rows[0]
    res.status(201).json(autorEdited)
  },
})
