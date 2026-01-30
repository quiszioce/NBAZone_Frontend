import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PlayerPage from './pages/PlayerPage'
import './App.css'
import ComparePage from './pages/ComparePage'

type Player = {
  id: number
  firstName: string
  lastName: string
}

function App() {

  const [healthMsg, setHealthMsg] = useState<string>('')

  const [search, setSearch] = useState<string>('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [hasSearched, setHasSearched] = useState<boolean>(false)

  async function testBackend() {
    setHealthMsg('')
    const res = await fetch('/api/health/db')
    const text = await res.text()
    setHealthMsg(text) 
  }

  async function searchPlayers() {
    setHasSearched(true)
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
    <Routes>
      <Route 
        path="/"
        element={
          <div className='page'>

            <div className='container'>

              <header className='hero'>
                <h1 className='heroTitle'>NBAZone</h1>
                <p className='heroSubtitle'>Your ultimate destination for all things NBA!</p>
              </header>

              <section className='searchSection'>
                <h2>Search Players</h2>


                <div className='searchBar'>
                  
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setHasSearched(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim() && !loading) {
                        searchPlayers()
                      }
                    }}
                    placeholder="Enter player name"
                  />
                  <button onClick={searchPlayers} disabled={loading || !search.trim()}>
                    {loading ? 'Searching...' : 'Search'}
                  </button>

                  <Link to="/compare">Compare Players</Link>

                </div>

                


                {error && <p className='errorBox'>Error: {error}</p>}

                {!loading && players.length === 0 && hasSearched && (
                  <p className="muted">No players found.</p>
                )}

                {players.length > 0 && (
                  <><div className='resultsMeta'>
                    Showing {players.length} result{players.length !== 1 ? 's' : ''}
                  </div><div className='resultsList'>
                      {players.map((player) => (
                        <Link
                          key={player.id}
                          to={`/players/${player.id}`}
                          className='resultRow'
                        >
                          <span className='resultName'>
                            {player.firstName} {player.lastName}
                          </span>

                        </Link>
                      ))}
                    </div></>
                )}
              </section>

              <footer className='devTools'>
                <button onClick={testBackend}>Test Backend Health</button>
                {healthMsg && <p>Backend Health: {healthMsg}</p>}
              </footer>
              
            </div>
          </div>
        }      
      />
      <Route path="/players/:id" element={<PlayerPage />} />
      <Route path="/compare" element={<ComparePage />} />
    </Routes>
    
  )
}

export default App
