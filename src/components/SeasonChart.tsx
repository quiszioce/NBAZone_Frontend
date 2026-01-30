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

export default function SeasonChart({ seasons }: Props) {
    const data = seasons
        .slice()
        .sort((a, b) => a.season - b.season)
        .map((s) => ({
            season: String(s.season),
            ppg: Number(s.ppg.toFixed(2)),
        }))

    if (data.length === 0) {
        return <p>No season data available for chart.</p>
    }

    return (
        <div className='chartCard'>
            <div className='chartHeader'>
                <h3 className='chartTitle'>Points Per Game (PPG)</h3>
                <span className='chartSubtitle'>By Season</span>
            </div>

            <div className='chartBody'>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke='#3a3a3a' strokeDasharray='3 3' />
                        <XAxis 
                            dataKey='season' 
                            stroke='#aaa'
                            tick={{ fill: '#aaa', fontSize: 12 }}
                        />
                        <YAxis 
                            stroke='#aaa'
                            tick={{ fill: '#aaa', fontSize: 12 }}
                            domain={['dataMin - 2', 'dataMax + 2']}
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
                                if (Number.isFinite(num)) return [`${num.toFixed(2)} PPG`, 'PPG']
                                return ['-', 'PPG']
                            }}
                        />

                        <Line 
                            type='monotone'
                            dataKey='ppg'
                            strokeWidth={2.5}
                            dot={false}
                            isAnimationActive={false}
                            stroke='#7aa2ff'
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}