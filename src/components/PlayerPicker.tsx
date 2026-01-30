import { useState } from 'react'

type PlayerSearchResult = {
  id: number
  firstName: string
  lastName: string
}

type Props = {
  label: string
  onSelect: (id: number) => void
  selectedName?: string
}

export default function PlayerPicker({ label, onSelect, selectedName }: Props) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<PlayerSearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  async function searchPlayers() {
    const q = query.trim()
    if (!q || loading) return

    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const res = await fetch(`/api/players?search=${encodeURIComponent(q)}`)
      if (!res.ok) {
        throw new Error(`Error fetching players: ${res.status} ${res.statusText}`)
      }
      const data = (await res.json()) as PlayerSearchResult[]
      setResults(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(p: PlayerSearchResult) {
    onSelect(p.id)
    setResults([])       // collapse list after choosing
    setHasSearched(false)
    // optional: keep query as selected name for clarity
    setQuery(`${p.firstName} ${p.lastName}`)
  }

  return (
    <section className="panel" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h3 style={{ margin: 0 }}>{label}</h3>
        {selectedName && <span className="muted">Selected: {selectedName}</span>}
      </div>

      <div className="searchBar" style={{ marginTop: 12 }}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHasSearched(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim() && !loading) searchPlayers()
          }}
          placeholder="Search player..."
        />
        <button onClick={searchPlayers} disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="errorBox">Error: {error}</p>}

      {!loading && results.length === 0 && hasSearched && (
        <p className="muted">No players found.</p>
      )}

      {results.length > 0 && (
        <>
          <div className="resultsMeta">
            Showing {results.length} result{results.length !== 1 ? 's' : ''}
          </div>

          <div className="resultsList">
            {results.map((p) => (
              <div
                key={p.id}
                className="resultRow"
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelect(p)
                }}
              >
                <span className="resultName">
                  {p.firstName} {p.lastName}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
