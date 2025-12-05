import { createApiRoute } from 'utils/api'
import database from 'infra/database'

export default createApiRoute({
  async GET(req, res) {
    const result = await database.query({
      text: 'SELECT * FROM autores WHERE ativo = true;',
    })
    const autores = result.rows
    res.status(200).json(autores)
  },
})
