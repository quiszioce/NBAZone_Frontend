import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { SeasonSummary } from './SeasonTable'

type Props = {
  seasons: SeasonSummary[]
}

type StatKey = 'ppg' | 'rpg' | 'apg' | 'mpg'

const STAT_CONFIG: Record<
  StatKey,
  { title: string; shortLabel: string; tooltipLabel: string }
> = {
  ppg: { title: 'Points Per Game (PPG)', shortLabel: 'PPG', tooltipLabel: 'PPG' },
  rpg: { title: 'Rebounds Per Game (RPG)', shortLabel: 'RPG', tooltipLabel: 'RPG' },
  apg: { title: 'Assists Per Game (APG)', shortLabel: 'APG', tooltipLabel: 'APG' },
  mpg: { title: 'Minutes Per Game (MPG)', shortLabel: 'MPG', tooltipLabel: 'MPG' },
}

export default function SeasonChart({ seasons }: Props) {
  const [stat, setStat] = useState<StatKey>('ppg')

  const data = useMemo(() => {
    return seasons
      .slice()
      .sort((a, b) => a.season - b.season)
      .map((s) => {
        const raw = s[stat]
        const num = typeof raw === 'number' ? raw : Number(raw)
        return {
          season: String(s.season),
          value: Number.isFinite(num) ? Number(num.toFixed(2)) : 0,
        }
      })
  }, [seasons, stat])

  if (data.length === 0) return <p>No season data available for chart.</p>

  const cfg = STAT_CONFIG[stat]

  return (
    <div className="chartCard">
      <div className="chartHeader">
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
              {STAT_CONFIG[k].shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="chartBody">
        <ResponsiveContainer width="100%" height={260}>
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
              formatter={(value: unknown) => {
                const num = typeof value === 'number' ? value : Number(value)
                if (Number.isFinite(num)) return [`${num.toFixed(2)} ${cfg.tooltipLabel}`, cfg.tooltipLabel]
                return ['-', cfg.tooltipLabel]
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              stroke="#7aa2ff"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
