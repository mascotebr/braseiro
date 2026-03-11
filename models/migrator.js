import { join } from 'node:path'
import database from 'infra/database'
import migrationRunner from 'node-pg-migrate'

const defaultMigrationOption = {
  dryRun: true,
  dir: join('infra', 'migrations'),
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
}

async function listPendingMigrations() {
  const dbClient = await database.getNewClient()
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dbClient,
    })

    return pendingMigrations
  } finally {
    await dbClient?.end()
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient()
  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dbClient,
      dryRun: false,
    })

    return migratedMigrations
  } finally {
    await dbClient?.end()
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
}

export default migrator
