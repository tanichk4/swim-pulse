interface Props {
  totalDist: number
  totalMin: number
  sessionCount: number
  kcalPerMin: string
}

export default function StatsGrid({ totalDist, totalMin, sessionCount, kcalPerMin }: Props) {
  return (
    <div className="stats">
      <div className="stat-card">
        <div className="val">{totalDist.toLocaleString()}</div>
        <div className="lbl">Meters</div>
      </div>
      <div className="stat-card">
        <div className="val">{totalMin}</div>
        <div className="lbl">Minutes</div>
      </div>
      <div className="stat-card">
        <div className="val">{sessionCount}</div>
        <div className="lbl">Sessions</div>
      </div>
      <div className="stat-card highlight">
        <div className="val">{kcalPerMin}</div>
        <div className="lbl">kcal/min</div>
      </div>
    </div>
  )
}
