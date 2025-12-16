import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database'
export default async function migrations(req, res) {
  const dbClient = await database.getNewClient()

  const defaultMigrationOption = {
    dbClient: dbClient,
    dryRun: false,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  }
  if (req.method == 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationOption)
    await dbClient.end()
    return res.status(200).json(pendingMigrations)
  }

  if (req.method == 'POST') {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dryRun: false,
    })
    await dbClient.end()

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations)
    }
    return res.status(200).json(migratedMigrations)
  }

  return res.status(405).end()
}
