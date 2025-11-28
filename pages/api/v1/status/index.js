import database from 'infra/database'
export default async function handler(req, res) {
  const databaseVersionResult = await database.query('SHOW server_version;')
  const databaseVersionValue = databaseVersionResult.rows[0].server_version
  res.status(200).json(databaseVersionValue)
}
