import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PlayerPicker from '../components/PlayerPicker'
import PlayerBio from '../components/PlayerBio'
import type { SeasonSummary } from '../components/SeasonTable'
import CompareChart from '../components/CompareChart'

type Player = {
  id: number
  firstName: string
  lastName: string
  birthDate: string
  lastAttend: string
  country: string
  heightIn: number | null
  heightCm: number | null
  bodyweightLbs: number | null
  position: string
  draftYear: number | null
  draftRound: number | null
  draftNumber: number | null
}

export default function ComparePage() {
  const [aId, setAId] = useState<number | null>(null)
  const [bId, setBId] = useState<number | null>(null)

  const [playerA, setPlayerA] = useState<Player | null>(null)
  const [playerB, setPlayerB] = useState<Player | null>(null)

  const [seasonsA, setSeasonsA] = useState<SeasonSummary[]>([])
  const [seasonsB, setSeasonsB] = useState<SeasonSummary[]>([])

  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)

  const [errorA, setErrorA] = useState('')
  const [errorB, setErrorB] = useState('')

  // helpful labels for UI
  const nameA = useMemo(
    () => (playerA ? `${playerA.firstName} ${playerA.lastName}` : ''),
    [playerA]
  )
  const nameB = useMemo(
    () => (playerB ? `${playerB.firstName} ${playerB.lastName}` : ''),
    [playerB]
  )

  // Fetch A
  useEffect(() => {
    async function loadA() {
      if (aId == null) {
        setPlayerA(null)
        setSeasonsA([])
        setErrorA('')
        setLoadingA(false)
        return
      }

      setLoadingA(true)
      setErrorA('')

      try {
        const res = await fetch(`/api/players/${aId}`)
        if (!res.ok) throw new Error(`Error fetching Player A: ${res.status} ${res.statusText}`)
        const p = (await res.json()) as Player
        setPlayerA(p)

        const sRes = await fetch(`/api/players/${aId}/seasons`)
        if (!sRes.ok) throw new Error(`Error fetching Player A seasons: ${sRes.status} ${sRes.statusText}`)
        const s = (await sRes.json()) as SeasonSummary[]
        setSeasonsA(s)
      } catch (e) {
        setErrorA(e instanceof Error ? e.message : 'Unknown error')
        setPlayerA(null)
        setSeasonsA([])
      } finally {
        setLoadingA(false)
      }
    }

    loadA()
  }, [aId])

  // Fetch B
  useEffect(() => {
    async function loadB() {
      if (bId == null) {
        setPlayerB(null)
        setSeasonsB([])
        setErrorB('')
        setLoadingB(false)
        return
      }

      setLoadingB(true)
      setErrorB('')

      try {
        const res = await fetch(`/api/players/${bId}`)
        if (!res.ok) throw new Error(`Error fetching Player B: ${res.status} ${res.statusText}`)
        const p = (await res.json()) as Player
        setPlayerB(p)

        const sRes = await fetch(`/api/players/${bId}/seasons`)
        if (!sRes.ok) throw new Error(`Error fetching Player B seasons: ${sRes.status} ${sRes.statusText}`)
        const s = (await sRes.json()) as SeasonSummary[]
        setSeasonsB(s)
      } catch (e) {
        setErrorB(e instanceof Error ? e.message : 'Unknown error')
        setPlayerB(null)
        setSeasonsB([])
      } finally {
        setLoadingB(false)
      }
    }

    loadB()
  }, [bId])

  const readyToCompare =
    playerA != null &&
    playerB != null &&
    !loadingA &&
    !loadingB &&
    !errorA &&
    !errorB

  return (
    <div className="page">
      <div className="container">
        <Link className="backLink" to="/">← Back to search</Link>
        <h1 className="pageTitle">Compare Players</h1>

        <div className="compareGrid">
          <div>
            <PlayerPicker
              label="Player A"
              onSelect={(id) => setAId(id)}
              selectedName={nameA}
            />
            {loadingA && <p className="muted">Loading Player A...</p>}
            {errorA && <p className="errorText">{errorA}</p>}
            {playerA && <PlayerBio player={playerA} />}
          </div>

          <div>
            <PlayerPicker
              label="Player B"
              onSelect={(id) => setBId(id)}
              selectedName={nameB}
            />
            {loadingB && <p className="muted">Loading Player B...</p>}
            {errorB && <p className="errorText">{errorB}</p>}
            {playerB && <PlayerBio player={playerB} />}
          </div>
        </div>

        <h2 className="sectionTitle">Comparison</h2>

        {!playerA || !playerB ? (
          <p className="muted">Select two players to compare.</p>
        ) : readyToCompare ? (
          <CompareChart
            seasonsA={seasonsA}
            seasonsB={seasonsB}
            nameA={nameA}
            nameB={nameB}
          />
        ) : (
          <p className="muted">Loading comparison...</p>
        )}
      </div>
    </div>
  )
}
