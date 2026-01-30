import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { SeasonSummary } from './SeasonTable'

type Props = {
  seasonsA: SeasonSummary[]
  seasonsB: SeasonSummary[]
  nameA: string
  nameB: string
}

type StatKey = 'ppg' | 'rpg' | 'apg' | 'mpg'

const STAT_CONFIG: Record<StatKey, { title: string; unit: string }> = {
  ppg: { title: 'Points Per Game (PPG)', unit: 'PPG' },
  rpg: { title: 'Rebounds Per Game (RPG)', unit: 'RPG' },
  apg: { title: 'Assists Per Game (APG)', unit: 'APG' },
  mpg: { title: 'Minutes Per Game (MPG)', unit: 'MPG' },
}

type ChartRow = {
  season: string
  a?: number
  b?: number
}

export default function CompareChart({ seasonsA, seasonsB, nameA, nameB }: Props) {
  const [stat, setStat] = useState<StatKey>('ppg')

  const data: ChartRow[] = useMemo(() => {
    const map = new Map<number, ChartRow>()

    function upsert(seasonNum: number) {
      let row = map.get(seasonNum)
      if (!row) {
        row = { season: String(seasonNum) }
        map.set(seasonNum, row)
      }
      return row
    }

    for (const s of seasonsA) {
      const row = upsert(s.season)
      const val = s[stat]
      row.a = Number.isFinite(val) ? Number(val.toFixed(2)) : undefined
    }

    for (const s of seasonsB) {
      const row = upsert(s.season)
      const val = s[stat]
      row.b = Number.isFinite(val) ? Number(val.toFixed(2)) : undefined
    }

    return Array.from(map.entries())
      .sort((x, y) => x[0] - y[0])
      .map(([, row]) => row)
  }, [seasonsA, seasonsB, stat])

  if (data.length === 0) return <p className="muted">No season data available to compare.</p>

  const cfg = STAT_CONFIG[stat]

  return (
    <div className="chartCard">
      <div className="chartHeader" style={{ justifyContent: 'space-between' }}>
        <div className="chartHeaderLeft">
          <h3 className="chartTitle">{cfg.title}</h3>
          <span className="chartSubtitle">By Season</span>
        </div>

        <div className="statToggle" role="tablist" aria-label="Stat selector">
          {(Object.keys(STAT_CONFIG) as StatKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStat(k)}
              className={`statBtn ${stat === k ? 'statBtnActive' : ''}`}
              aria-pressed={stat === k}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="chartBody">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#3a3a3a" strokeDasharray="3 3" />
            <XAxis dataKey="season" stroke="#aaa" tick={{ fill: '#aaa', fontSize: 12 }} />
            <YAxis
              stroke="#aaa"
              tick={{ fill: '#aaa', fontSize: 12 }}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(v) => String(Math.round(v))}
            />

            <Tooltip
                contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #444',
                    borderRadius: 6,
                }}
                labelStyle={{ color: '#aaa' }}
                formatter={(value: unknown, name?: string) => {
                    const num = typeof value === 'number' ? value : Number(value)
                    const label =
                    name === 'a' ? (nameA || 'Player A')
                    : name === 'b' ? (nameB || 'Player B')
                    : (name ?? '')

                    if (!Number.isFinite(num)) return ['-', label]
                    return [`${num.toFixed(2)} ${cfg.unit}`, label]
                }}
            />


            <Legend />

            <Line
              type="monotone"
              dataKey="a"
              name={nameA || 'Player A'}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              stroke="#7aa2ff"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="b"
              name={nameB || 'Player B'}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              stroke="#7affc2"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
