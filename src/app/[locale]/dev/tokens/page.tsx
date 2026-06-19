import { PaletteSwitcher } from '@/common/ui/palette-switcher/palette-switcher';

/** Dev-only token + palette playground. Deleted before merge. */
export default function TokensPlayground() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="brand-mark text-lg">
          <span className="brand-dot">90</span>
          <span>Bingo 90</span>
        </div>
        <PaletteSwitcher />
      </header>

      <section className="stack gap-3">
        <div className="eyebrow">Ball</div>
        <div className="ball-stage">
          <div className="ball-wrap">
            <div className="ball">
              <div className="ball__inner">
                <span className="ball__num tnum">23</span>
              </div>
            </div>
          </div>
          <div className="ball-meta">Bola 5 de 90</div>
        </div>
      </section>

      <section className="stack gap-3">
        <div className="eyebrow">Card cells</div>
        <div className="bingocard">
          <div className="bingocard__grid">
            {Array.from({ length: 9 }).map((_, c) => {
              const n = (c + 1) * 10 - 3;
              const marked = c % 2 === 0;
              return (
                <div
                  key={c}
                  className={`cell cell--num${marked ? ' cell--marked' : ''}`}
                >
                  <span className="cell__n tnum">{n}</span>
                  {marked && (
                    <span className="cell__daub">
                      <span className="daub-ring" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="stack gap-3">
        <div className="eyebrow">Banners</div>
        <div className="banner banner--wait">Esperando a que el anfitrión empiece.</div>
        <div className="banner banner--info">Ganaste la línea.</div>
        <div className="banner banner--error">La sala se cerró.</div>
      </section>

      <section className="stack gap-3">
        <div className="eyebrow">Type system</div>
        <p className="font-display text-4xl font-bold tracking-tight">Display — Space Grotesk</p>
        <p className="font-ui text-base">UI — Geist. Esto es un párrafo de prueba.</p>
        <p className="font-num text-base tracking-widest">NUM — Martian Mono · 24 · 7 · 13</p>
      </section>
    </main>
  );
}
