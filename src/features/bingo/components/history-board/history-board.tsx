interface Props {
  drawn: number[];
  total?: number;
}

export function HistoryBoard({ drawn, total = 90 }: Props) {
  const set = new Set(drawn);

  return (
    <div className="hist-board">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={`hist-board__n${set.has(n) ? ' is-called' : ''}`}
        >
          <span className="tnum">{n}</span>
        </div>
      ))}
    </div>
  );
}
