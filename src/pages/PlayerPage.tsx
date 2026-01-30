import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PlayerBio from '../components/PlayerBio'
import SeasonTable, { type SeasonSummary } from '../components/SeasonTable'
import SeasonChart from '../components/SeasonChart'

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
        <div className="page">
            <div className="container">
            <Link className="backLink" to="/">
                ← Back to search
            </Link>

            {loading && <p className="muted">Loading...</p>}
            {error && <p className="errorText">Error: {error}</p>}

            {player && <PlayerBio player={player} />}

            <h2 className="sectionTitle">Season Stats</h2>

            {seasonsLoading && <p className="muted">Loading seasons...</p>}
            {seasonsError && <p className="errorText">Error: {seasonsError}</p>}

            {!seasonsLoading && !seasonsError && (
                <>
                <SeasonChart seasons={seasons} />
                <SeasonTable seasons={seasons} />
                </>
            )}
            </div>
        </div>
    )

}
export default PlayerPage