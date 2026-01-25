import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

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

type SeasonSummary = {
    playerId: number
    season: number
    gamesPlayed: number
    mpg: number
    ppg: number
    rpg: number
    apg: number
    spg: number
    bpg: number
    tpg: number
    fgPct: number
    fg3Pct: number
    ftPct: number
}

function formatHeight(inches: number | null | undefined) {
  if (inches == null) return 'N/A'

  const feet = Math.floor(inches / 12)
  const remainder = inches % 12

  return `${feet}′ ${remainder}″`
}


function display(value: string | number | null | undefined) {
    return value === null || value === undefined || value === '' ? 'N/A' : value
}

function PlayerPage() {
    const { id } = useParams()

    const [player, setPlayer] = useState<Player | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const [seasons, setSeasons] = useState<SeasonSummary[]>([])
    const [seasonsLoading, setSeasonsLoading] = useState<boolean>(true)
    const [seasonsError, setSeasonsError] = useState<string>('')

    useEffect(() => {
        async function load() {
            if (!id) {
                setError('No player ID provided')
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')
            setSeasonsLoading(true)
            setSeasonsError('')

            try {
                const res = await fetch(`/api/players/${id}`)
                if (!res.ok) {
                    throw new Error(`Error fetching player: ${res.status} ${res.statusText}`)
                }
                const data = (await res.json()) as Player
                setPlayer(data)

                const seasonsRes = await fetch(`/api/players/${id}/seasons`)
                if (!seasonsRes.ok) {
                    throw new Error(`Error fetching seasons: ${seasonsRes.status} ${seasonsRes.statusText}`)
                }
                const seasonsData = (await seasonsRes.json()) as SeasonSummary[]
                setSeasons(seasonsData)
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error')
                setPlayer(null)
                setSeasonsError(e instanceof Error ? e.message : 'Unknown error')
                setSeasons([])
            } finally {
                setLoading(false)
                setSeasonsLoading(false)
            }      
        }

        load()
    }, [id])

    return (
        <div style={{ padding: 16 }}>
            <Link to="/">← Back to search</Link>

            <h2>Player</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {player && (
                <div>
                    <h3>{player.firstName} {player.lastName}</h3>

                    <p><strong>Position:</strong> {display(player.position)}</p>
                    <p><strong>Height:</strong> {formatHeight(player.heightIn)}</p>
                    <p><strong>Weight:</strong> {display(player.bodyweightLbs)}</p>
                    <p><strong>Birth Date:</strong> {display(player.birthDate)}</p>
                    <p><strong>Country:</strong> {display(player.country)}</p>
                    <p><strong>College:</strong> {display(player.lastAttend)}</p>

                    <h4>Draft Info:</h4>
                    <p>
                        {player.draftYear != null
                            ? `Drafted in ${player.draftYear}, Round ${display(player.draftRound)}, Pick ${display(player.draftNumber)}`
                            : 'N/A'}
                    </p>

                    <h3>Season Stats</h3>

                    {seasonsLoading && <p>Loading seasons...</p>}
                    {seasonsError && <p style={{ color: 'red' }}>Error: {seasonsError}</p>}

                    {!seasonsLoading && !seasonsError && seasons.length === 0 && (<p>No season data available.</p>)}

                    {seasons.length > 0 && (
                        <table cellPadding={6} style={{ marginTop: 8, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th align="left">Season</th>
                                    <th align="right">GP</th>
                                    <th align="right">MPG</th>
                                    <th align="right">PPG</th>
                                    <th align="right">RPG</th>
                                    <th align="right">APG</th>
                                    <th align="right">SPG</th>
                                    <th align="right">BPG</th>
                                    <th align="right">TPG</th>
                                    <th align="right">FG%</th>
                                    <th align="right">3P%</th>
                                    <th align="right">FT%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasons
                                    .slice()
                                    .sort((a, b) => b.season - a.season)
                                    .map((s) => (
                                    <tr key={s.season}>
                                        <td>{s.season}</td>
                                        <td align="right">{s.gamesPlayed}</td>
                                        <td align="right">{s.mpg.toFixed(2)}</td>
                                        <td align="right">{s.ppg.toFixed(2)}</td>
                                        <td align="right">{s.rpg.toFixed(2)}</td>
                                        <td align="right">{s.apg.toFixed(2)}</td>
                                        <td align="right">{s.spg.toFixed(2)}</td>
                                        <td align="right">{s.bpg.toFixed(2)}</td>
                                        <td align="right">{s.tpg.toFixed(2)}</td>
                                        <td align="right">{(s.fgPct * 100).toFixed(1)}</td>
                                        <td align="right">{(s.fg3Pct == null ? 0 : s.fg3Pct * 100).toFixed(1)}</td>
                                        <td align="right">{(s.ftPct * 100).toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}
export default PlayerPage