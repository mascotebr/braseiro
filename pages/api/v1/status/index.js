import database from 'infra/database'
import { createRouter } from 'next-connect'
import { errors } from 'utils/api'
const router = createRouter()
router.get(getHandler)

export default router.handler({
  onNoMatch: errors.onNoMatchHandler,
  onError: errors.onErrorHandler,
})

async function getHandler(req, res) {
  const updateAt = new Date().toISOString()

  const databaseVersionResult = await database.query('SHOW server_version;')
  const databaseVersionValue = databaseVersionResult.rows[0].server_version

  const databaseMaxConnectionsResult = await database.query(
    'SHOW max_connections;',
  )
  const databaseMaxConnections = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  )

  const databaseName = process.env.POSTGRES_DB
  const databaseConnectionsResult = await database.query({
    text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [databaseName],
  })
  const databaseConnections = databaseConnectionsResult.rows[0].count

  const databaseVersionValueNumber = databaseVersionValue.split('(')[0].trim()
  res.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValueNumber,
        max_connections: databaseMaxConnections,
        opened_connections: databaseConnections,
      },
    },
  })
}
