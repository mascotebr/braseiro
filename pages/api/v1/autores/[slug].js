import { createApiRoute } from 'utils/api'
import database from 'infra/database'
export default createApiRoute({
  async GET(req, res) {
    const { slug } = req.query
    const result = await database.query(
      'SELECT * FROM autores WHERE ativo = true AND slug = $1',
      [slug],
    )
    const autor = result.rows[0]
    res.status(200).json(autor)
  },
})
