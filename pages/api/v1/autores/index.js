import { createApiRoute } from 'utils/api'
import database from 'infra/database'

export default createApiRoute({
  async GET(req, res) {
    const result = await database.query('SELECT * FROM autores LIMIT 1')
    const autores = result.rows
    res.status(200).json(autores)
  },
})
