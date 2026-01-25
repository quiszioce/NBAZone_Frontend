import { useParams } from 'react-router-dom'

function PlayerPage() {
    const { id } = useParams()

    return (
        <div style={{ padding: 16 }}>
            <h2>Player Details</h2>
            <p>Player ID: {id}</p>
        </div>
    )
}

export default PlayerPage