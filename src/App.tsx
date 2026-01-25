import { use, useState } from 'react';

type Player = {
  id: number;
  firstName: string;
  lastName: string;
}

function App() {

  const [healthMsg, setHealthMsg] = useState<string>('')

  const [search, setSearch] = useState<string>('a')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  async function testBackend() {
    setHealthMsg('')
    const res = await fetch('/api/health/db')
    const text = await res.text()
    setHealthMsg(text) 
  }

  async function searchPlayers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/players?search=${encodeURIComponent(search)}`)
      if (!res.ok) {
        throw new Error(`Error fetching players: ${res.status} ${res.statusText}`)
      }
      const data = (await res.json()) as Player[]
      setPlayers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>NBAZone</h1>
      <p>Welcome to NBAZone, your ultimate destination for all things NBA!</p> 

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={testBackend}>Test backend</button>  
        {healthMsg && <span>Backend says: {healthMsg}</span>} 
      </div>

      <h2>Players</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players (e.g. LeBron)"
        />
        <button onClick={searchPlayers} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={{ marginTop: 12 }}>
        {players.map((p) => (
          <li key={p.id}>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
      
    </div>
  )
}

export default App
