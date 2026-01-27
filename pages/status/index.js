import useSWR from 'swr'
import methods from 'infra/methods'
export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdateAt />
      <DatabaseStatus />
    </>
  )
}

async function getStatus(key) {
  const response = await methods.get(key)
  return await response.json()
}
function UpdateAt() {
  const { isLoading, data } = useSWR('/api/v1/status', getStatus, {
    refreshInterval: 2000,
  })

  let text = 'Carregando...'

  if (!isLoading && data) {
    text = new Date(data.updated_at).toLocaleString('pt-BR')
  }

  return <p>Ultima atualização: {text}</p>
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR('/api/v1/status', getStatus, {
    refreshInterval: 2000,
  })

  if (isLoading && !data) {
    return 'Carregando...'
  }

  let database = data.dependencies.database

  return (
    <>
      <h1>Database Status</h1>

      <div>Versão: {database.version}</div>
      <div>Maximo de conexões: {database.max_connections}</div>
      <div>Conexões abertas: {database.opened_connections}</div>
    </>
  )
}
