import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database'
import controller from 'infra/controller'
import { createRouter } from 'next-connect'

const router = createRouter()

router.get(getHandler)
router.post(postHandler)

export default router.handler(controller.errorsHandlers)

const defaultMigrationOption = {
  dryRun: true,
  dir: join('infra', 'migrations'),
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
}

async function getHandler(req, res) {
  const dbClient = await database.getNewClient()
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dbClient,
    })
    return res.status(200).json(pendingMigrations)
  } finally {
    if (dbClient) await dbClient.end()
  }
}

async function postHandler(req, res) {
  const dbClient = await database.getNewClient()
  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dbClient,
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
