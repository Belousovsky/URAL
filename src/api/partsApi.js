const API_URL = '/api-proxy/hs/hsprice/'
const DEFAULT_KEY = '00000000-0000-0000-0000-000000000001'

export async function fetchParts(params) {
  const query = new URLSearchParams({
    key: DEFAULT_KEY,
    ...params,
  })

  const response = await fetch(`${API_URL}?${query}`)
  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status}`)
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
