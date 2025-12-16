import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database'
import { apiFunction } from 'utils/api'

export default async function (req, res) {
  apiFunction(req, res, {
    async CONFIG() {
      const dbClient = await database.getNewClient()
      const defaultMigrationOption = {
        dbClient: dbClient,
        dryRun: false,
        dir: join('infra', 'migrations'),
        direction: 'up',
        verbose: true,
        migrationsTable: 'pgmigrations',
      }

      return {
        defaultMigrationOption: defaultMigrationOption,
        dbClient: dbClient,
      }
    },

    async DISMISS({ dbClient }) {
      await dbClient.end()
    },

    async GET({ defaultMigrationOption }) {
      const pendingMigrations = await migrationRunner(defaultMigrationOption)
      return res.status(200).json(pendingMigrations)
    },

    async POST({ defaultMigrationOption }) {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOption,
        dryRun: false,
      })

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations)
      }
      return res.status(200).json(migratedMigrations)
    },
  })
}
