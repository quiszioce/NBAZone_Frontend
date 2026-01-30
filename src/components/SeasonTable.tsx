export type SeasonSummary = {
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
    fgm: number
    fga: number
    fg3m: number
    fg3a: number
    ftm: number
    fta: number
    fgPct: number
    fg3Pct: number | null
    ftPct: number
}

function careerTotals(seasons: SeasonSummary[]) {
    const gp = seasons.reduce((sum, s) => sum + s.gamesPlayed, 0)

    const sumWeighted = (key: 'mpg' | 'ppg' | 'rpg' | 'apg' | 'spg' | 'bpg' | 'tpg') => 
        seasons.reduce((sum, s) => sum + s[key] * s.gamesPlayed, 0)

    const fgm = seasons.reduce((sum, s) => sum + s.fgm, 0)
    const fga = seasons.reduce((sum, s) => sum + s.fga, 0)
    const fg3m = seasons.reduce((sum, s) => sum + s.fg3m, 0)
    const fg3a = seasons.reduce((sum, s) => sum + s.fg3a, 0)
    const ftm = seasons.reduce((sum, s) => sum + s.ftm, 0)
    const fta = seasons.reduce((sum, s) => sum + s.fta, 0)

    const safeDiv = (num: number, denom: number) => denom === 0 ? null : num / denom

    return {
        gamesPlayed: gp,
        mpg: gp === 0 ? 0 : sumWeighted('mpg') / gp,
        ppg: gp === 0 ? 0 : sumWeighted('ppg') / gp,
        rpg: gp === 0 ? 0 : sumWeighted('rpg') / gp,
        apg: gp === 0 ? 0 : sumWeighted('apg') / gp,
        spg: gp === 0 ? 0 : sumWeighted('spg') / gp,
        bpg: gp === 0 ? 0 : sumWeighted('bpg') / gp,
        tpg: gp === 0 ? 0 : sumWeighted('tpg') / gp,

        fgPct: safeDiv(fgm, fga),
        fg3Pct: safeDiv(fg3m, fg3a),
        ftPct: safeDiv(ftm, fta),
    }
}

export default function SeasonTable({ seasons }: { seasons: SeasonSummary[] }) {
    if (seasons.length === 0) {
        return <p>No season data available.</p>
    }

    const totals = careerTotals(seasons)

  return (
    <div className="tableWrapper">
      <table className="seasonTable">
        <thead>
          <tr>
            <th align="left">Season</th>
            <th className="num">GP</th>
            <th className="num">MPG</th>
            <th className="num">PPG</th>
            <th className="num">RPG</th>
            <th className="num">APG</th>
            <th className="num">SPG</th>
            <th className="num">BPG</th>
            <th className="num">TPG</th>
            <th className="num">FG%</th>
            <th className="num">3P%</th>
            <th className="num">FT%</th>
          </tr>
        </thead>

        <tbody>
          {seasons
            .slice()
            .sort((a, b) => b.season - a.season)
            .map((s) => (
              <tr key={s.season}>
                <td>{s.season}</td>
                <td className="num">{s.gamesPlayed}</td>
                <td className="num">{s.mpg.toFixed(2)}</td>
                <td className="num">{s.ppg.toFixed(2)}</td>
                <td className="num">{s.rpg.toFixed(2)}</td>
                <td className="num">{s.apg.toFixed(2)}</td>
                <td className="num">{s.spg.toFixed(2)}</td>
                <td className="num">{s.bpg.toFixed(2)}</td>
                <td className="num">{s.tpg.toFixed(2)}</td>
                <td className="num pct">{(s.fgPct * 100).toFixed(1)}</td>
                <td className="num pct">{(s.fg3Pct == null ? 0 : s.fg3Pct * 100).toFixed(1)}</td>
                <td className="num pct">{(s.ftPct * 100).toFixed(1)}</td>
              </tr>
            ))}

          <tr className="careerRow">
              <td><strong>Career</strong></td>
              <td align="right">{totals.gamesPlayed}</td>
              <td align="right">{totals.mpg == null ? '-' : totals.mpg.toFixed(2)}</td>
              <td align="right">{totals.ppg == null ? '-' : totals.ppg.toFixed(2)}</td>
              <td align="right">{totals.rpg == null ? '-' : totals.rpg.toFixed(2)}</td>
              <td align="right">{totals.apg == null ? '-' : totals.apg.toFixed(2)}</td>
              <td align="right">{totals.spg == null ? '-' : totals.spg.toFixed(2)}</td>
              <td align="right">{totals.bpg == null ? '-' : totals.bpg.toFixed(2)}</td>
              <td align="right">{totals.tpg == null ? '-' : totals.tpg.toFixed(2)}</td>
              <td align="right">{totals.fgPct == null ? '-' : (totals.fgPct * 100).toFixed(1)}</td>
              <td align="right">{(totals.fg3Pct == null ? '-' : (totals.fg3Pct * 100).toFixed(1))}</td>
              <td align="right">{(totals.ftPct == null ? '-' : (totals.ftPct * 100).toFixed(1))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}