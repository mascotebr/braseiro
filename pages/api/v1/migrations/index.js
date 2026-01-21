import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database'
import { errors } from 'utils/api'
import { createRouter } from 'next-connect'

const router = createRouter()

router.get(getHandler)
router.post(postHandler)

export default router.handler({
  onNoMatch: errors.onNoMatchHandler,
  onError: errors.onErrorHandler,
})

async function configHandler() {
  const dbClient = await database.getNewClient()
  const defaultMigrationOption = {
    dbClient: dbClient,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  }

  return {
    defaultMigrationOption: defaultMigrationOption,
    dbClient: dbClient,
  }
}
async function getHandler(req, res) {
  const { defaultMigrationOption, dbClient } = await configHandler()
  try {
    const pendingMigrations = await migrationRunner(defaultMigrationOption)
    return res.status(200).json(pendingMigrations)
  } finally {
    if (dbClient) await dbClient.end()
  }
}

async function postHandler(req, res) {
  const { defaultMigrationOption, dbClient } = await configHandler()
  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dryRun: false,
    })

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations)
    }
    return res.status(200).json(migratedMigrations)
  } finally {
    if (dbClient) await dbClient.end()
  }
}
