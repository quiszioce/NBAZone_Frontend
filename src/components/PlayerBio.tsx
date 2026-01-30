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

function formatWeight(lbs: number | null | undefined) {
    if (lbs == null) return 'N/A'
    return `${lbs} lbs`
}

function formatDraft(p: Player) {
    if (p.draftYear == null) return 'N/A'
    // round/number might be null in some datasets, so guard them:
    const round = p.draftRound ?? '—'
    const pick = p.draftNumber ?? '—'
    return `Drafted ${p.draftYear} • Round ${round} • Pick ${pick}`
}

export default function PlayerBio({ player }: { player: Player }) {
    return (
        <section className="panel">
            <div className="playerHeader">
                {/* Left side: title */}
                <div>
                    <h1 className="playerName">
                        {player.firstName} {player.lastName}
                    </h1>
                    <div className="playerSub">{player.position || 'N/A'}</div>
                </div>

                {/* Right side: details grid */}
                <div className="kvGrid">
                    <div className="kvItem">
                        <span className="label">Height</span>
                        <span className="value">{formatHeight(player.heightIn)}</span>
                    </div>

                    <div className="kvItem">
                        <span className="label">Weight</span>
                        <span className="value">{formatWeight(player.bodyweightLbs)}</span>
                    </div>

                    <div className="kvItem">
                        <span className="label">Birth date</span>
                        <span className="value">{player.birthDate || 'N/A'}</span>
                    </div>

                    <div className="kvItem">
                        <span className="label">Country</span>
                        <span className="value">{player.country || 'N/A'}</span>
                    </div>

                    <div className="kvItem">
                        <span className="label">College</span>
                        <span className="value">{player.lastAttend || 'N/A'}</span>
                    </div>

                    <div className="kvItem">
                        <span className="label">Draft</span>
                        <span className="value">{formatDraft(player)}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
