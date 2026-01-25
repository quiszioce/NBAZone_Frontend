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

    useEffect(() => {
        async function load() {
            if (!id) {
                setError('No player ID provided')
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')

            try {
                const res = await fetch(`/api/players/${id}`)
                if (!res.ok) {
                    throw new Error(`Error fetching player: ${res.status} ${res.statusText}`)
                }
                const data = (await res.json()) as Player
                setPlayer(data)
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error')
                setPlayer(null)
            } finally {
                setLoading(false)
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
                </div>
            )}
        </div>
    )
}
export default PlayerPage