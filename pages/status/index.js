import useSWR from 'swr'
import { get } from 'utils/api'
export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdateAt />
      <DatabaseStatus />
    </>
  )
}

function UpdateAt() {
  const { isLoading, data } = useSWR('/api/v1/status', get, {
    refreshInterval: 2000,
  })

  let text = 'Carregando...'

  if (!isLoading && data) {
    text = new Date(data.updated_at).toLocaleString('pt-BR')
  }

  return <p>Ultima atualização: {text}</p>
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR('/api/v1/status', get, {
    refreshInterval: 2000,
  })

  if (isLoading && !data) {
    return 'Carregando...'
  }

  let database = data.dependencies.database

  return (
    <>
      <b>Database Status</b>
      <ul>
        <li>Versão: {database.version}</li>
        <li>Maximo de conexões: {database.max_connections}</li>
        <li>Conexões abertas: {database.opened_connections}</li>
      </ul>
    </>
  )
}
