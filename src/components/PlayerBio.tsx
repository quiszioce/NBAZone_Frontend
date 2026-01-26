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

export default function PlayerBio({ player }: { player: Player }) {
    return (
        <div>
            <h3>{player.firstName} {player.lastName}</h3>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Height:</strong> {formatHeight(player.heightIn)}</p>
            <p><strong>Weight:</strong> {player.bodyweightLbs}</p>
            <p><strong>Birth Date:</strong> {player.birthDate}</p>
            <p><strong>Country:</strong> {player.country}</p>
            <p><strong>College:</strong> {player.lastAttend}</p>

            <h4>Draft Info:</h4>
            <p>
                {player.draftYear != null
                    ? `Drafted in ${player.draftYear}, Round ${player.draftRound}, Pick ${player.draftNumber}`
                    : 'N/A'}
            </p>
        </div>
    )
}