/* ProjectYard — Registo de Horas (Timesheets)
   3 vistas: Grelha semanal · Diário · Por projeto
   Estados: Rascunho (atual, editável) · Aprovada (passada, bloqueada) · Vazia (futura)
   Conceitos da folha do cliente: Tipo · Custo (€) · Horas Prev/Reais · Produtividade (semáforo) */

const TS_VIEWS = [
  { id: 'Grelha semanal', icon: 'grid' },
  { id: 'Diário', icon: 'clock' },
  { id: 'Por projeto', icon: 'briefcase' },
];
const sumArr = (a) => a.reduce((x, y) => x + (Number(y) || 0), 0);

function Timesheets({ go, layout }) {
  const [view, setView] = useState(layout || 'Grelha semanal');
  const [wi, setWi] = useState(1); // índice em TS_WEEKS (1 = semana atual)
  const [timer, setTimer] = useState(false);
  // grelha editável (apenas semana rascunho)
  const [grid, setGrid] = useState(() => TS_ROWS.map(r => [...r.hours]));

  useEffect(() => { if (layout) setView(layout); }, [layout]);

  const week = TS_WEEKS[wi];
  const editable = week.state === 'draft';
  // matriz exibida: rascunho → estado editável; aprovada → dados; vazia → zeros
  const matrix = week.state === 'empty' ? TS_ROWS.map(r => r.hours.map(() => 0)) : (editable ? grid : TS_ROWS.map(r => [...r.hours]));

  const setCell = (ri, ci, val) => {
    setGrid(g => g.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row));
  };

  // KPIs derivados da matriz exibida
  const logged = sumArr(matrix.map(sumArr));
  const billable = sumArr(TS_ROWS.map((r, i) => r.billable ? sumArr(matrix[i]) : 0));
  const cost = sumArr(matrix.map(sumArr)) * ME.rate;
  const util = Math.round(logged / TS_CAPACITY * 100);
  const daysFilled = [0, 1, 2, 3, 4].filter(d => sumArr(matrix.map(r => r[d])) > 0).length;

  return (
    <div className="content">
      <PageHead
        title="Registo de horas"
        sub="Horas por projeto e fase · custo de produção e utilização da equipa"
        actions={<React.Fragment>
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
          <button className="btn btn-gold" onClick={() => setTimer(true)}><Icon name="play" size={15} /> Iniciar cronómetro</button>
        </React.Fragment>}
      />

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Stat icon="clock" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={fmtH(logged) + 'h'} label="Registadas esta semana" foot={`Objetivo ${TS_CAPACITY}h · ${util}% de utilização`} />
        <Stat icon="euro" iconBg="var(--success-soft)" iconColor="var(--success)" value={fmtH(billable) + 'h'} label="Horas faturáveis" trend={logged ? Math.round(billable / logged * 100) + '%' : '—'} foot={`${fmtH(logged - billable)}h não faturáveis`} />
        <Stat icon="card" iconBg="var(--info-soft)" iconColor="var(--info)" value={'€' + fmt(Math.round(cost))} label="Custo de produção" foot={`${fmtH(ME.rate)} €/h · ${ME.name.split(' ')[0]}`} />
        <Stat icon="gauge" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={util + '%'} label="Utilização" foot="Média da equipa 79%" />
      </div>

      {/* Controlos: navegador de semana + vista + estado */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => setWi(Math.max(0, wi - 1))} disabled={wi === 0}><Icon name="chevL" size={17} /></button>
          <div style={{ textAlign: 'center', minWidth: 150 }}>
            <div className="num" style={{ fontWeight: 700, fontSize: 15.5 }}>{week.range}</div>
            <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>Semana {wi === 1 ? 'atual' : wi === 0 ? 'anterior' : 'seguinte'}</div>
          </div>
          <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => setWi(Math.min(TS_WEEKS.length - 1, wi + 1))} disabled={wi === TS_WEEKS.length - 1}><Icon name="chevR" size={17} /></button>
          {wi !== 1 && <button className="chip" style={{ marginLeft: 6 }} onClick={() => setWi(1)}>Esta semana</button>}
        </div>

        <div className="seg" style={{ marginLeft: 'auto' }}>
          {TS_VIEWS.map(v => (
            <button key={v.id} className={view === v.id ? 'active' : ''} onClick={() => setView(v.id)}><Icon name={v.icon} size={15} /> {v.id}</button>
          ))}
        </div>
      </div>

      {/* Banner de estado */}
      <WeekBanner week={week} daysFilled={daysFilled} logged={logged} />

      {/* Corpo */}
      {week.state === 'empty' ? (
        <EmptyWeek week={week} onCopy={() => setWi(1)} />
      ) : view === 'Grelha semanal' ? (
        <WeekGrid week={week} matrix={matrix} editable={editable} setCell={setCell} />
      ) : view === 'Diário' ? (
        <DayView week={week} editable={editable} />
      ) : (
        <ProjectView />
      )}

      <CronometroModal open={timer} onClose={() => setTimer(false)} />
    </div>
  );
}

/* ---------------- Cronómetro ---------------- */
function CronometroModal({ open, onClose }) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(true);
  const [rowId, setRowId] = useState(TS_ROWS[0].id);
  useEffect(() => { if (open) { setSec(0); setRunning(true); setRowId(TS_ROWS[0].id); } }, [open]);
  useEffect(() => {
    if (!open || !running) return;
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [open, running]);
  const row = TS_ROWS.find(r => r.id === rowId);
  const pad = (n) => String(n).padStart(2, '0');
  const stop = () => { const h = Math.max(0.1, Math.round(sec / 360) / 10); onClose(); if (window.PYToast) window.PYToast('Registo guardado · ' + fmtH(h) + 'h em ' + row.project); };
  return (
    <Modal open={open} onClose={onClose} title="Cronómetro" sub="A contar tempo de trabalho" width={440}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Descartar</button>
        <button className="btn btn-primary" onClick={stop}><Icon name="check" size={15} /> Parar e guardar</button>
      </React.Fragment>}>
      <div style={{ textAlign: 'center', padding: '6px 0 18px' }}>
        <div className="num" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', color: running ? 'var(--text)' : 'var(--text-3)' }}>{pad(Math.floor(sec / 3600))}:{pad(Math.floor(sec / 60) % 60)}:{pad(sec % 60)}</div>
        <button className="btn btn-soft btn-sm" style={{ marginTop: 12 }} onClick={() => setRunning(r => !r)}><Icon name={running ? 'pause' : 'play'} size={14} /> {running ? 'Pausar' : 'Retomar'}</button>
      </div>
      <Field label="Projeto / fase"><SelectInput value={rowId} onChange={(e) => setRowId(e.target.value)}>
        {TS_ROWS.map(r => <option key={r.id} value={r.id}>{r.project} · {r.phase}</option>)}
      </SelectInput></Field>
      <Field label="Descrição"><TextInput placeholder="Opcional — o que estás a fazer" /></Field>
    </Modal>
  );
}

/* ---------------- Banner de estado da semana ---------------- */
function WeekBanner({ week, daysFilled, logged }) {
  if (week.state === 'approved') {
    return (
      <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, background: 'var(--success-soft)', borderColor: 'transparent' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--success)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="check" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>Semana aprovada e bloqueada</div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Validada por Ana Moreira a 9 Jun · {fmtH(logged)}h registadas. Para corrigir, peça reabertura.</div>
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="lock" size={14} /> Pedir reabertura</button>
      </div>
    );
  }
  if (week.state === 'draft') {
    const missing = 5 - daysFilled;
    return (
      <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="clock" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ fontWeight: 700, fontSize: 14.5 }}>Rascunho</span><Badge tag="b-amber" dot={false}>Por submeter</Badge></div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{missing > 0 ? `${missing} dia${missing > 1 ? 's' : ''} úteis ainda por validar.` : 'Todos os dias úteis preenchidos.'} Submeta para aprovação do gestor.</div>
        </div>
        <button className="btn btn-soft btn-sm"><Icon name="copy" size={14} /> Copiar semana anterior</button>
        <button className="btn btn-primary btn-sm"><Icon name="check" size={14} /> Submeter semana</button>
      </div>
    );
  }
  return null;
}

/* ---------------- Vista 1: Grelha semanal ---------------- */
const GRID_COLS = 'minmax(230px, 2.2fr) repeat(7, minmax(54px, 1fr)) 92px';

function WeekGrid({ week, matrix, editable, setCell }) {
  const dayTotal = (d) => sumArr(matrix.map(r => r[d]));
  const grand = sumArr(matrix.map(sumArr));

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Cabeçalho */}
      <div className="ts-gridrow" style={{ gridTemplateColumns: GRID_COLS, background: 'var(--surface-2)' }}>
        <div style={{ padding: '14px 18px', fontSize: 11.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Projeto · Fase</div>
        {TS_DAYS.map((d, i) => {
          const we = TS_WEEKEND.includes(i), today = i === week.todayIdx;
          return (
            <div key={i} className={'ts-day' + (we ? ' ts-daycol-weekend' : '') + (today ? ' ts-daycol-today' : '')} style={{ padding: '10px 2px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: today ? 'var(--accent-700)' : 'var(--text-3)' }}>{d}</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 700, color: today ? 'var(--accent-700)' : we ? 'var(--text-3)' : 'var(--text)' }}>{week.dates[i]}</div>
            </div>
          );
        })}
        <div style={{ padding: '14px 12px', fontSize: 11.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-3)', textAlign: 'right' }}>Total</div>
      </div>

      {/* Linhas */}
      {TS_ROWS.map((r, ri) => {
        const rowTotal = sumArr(matrix[ri]);
        return (
          <div key={r.id} className="ts-gridrow" style={{ gridTemplateColumns: GRID_COLS }}>
            <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <span style={{ width: 4, height: 32, borderRadius: 4, background: r.color, flexShrink: 0 }}></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.project}</div>
                <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.code !== '—' && <span className="num">{r.code}</span>}
                  <span>{r.phase}</span>
                  {!r.billable && <span className="badge b-gray" style={{ padding: '1px 7px', fontSize: 10 }} >Não faturável</span>}
                </div>
              </div>
            </div>
            {TS_DAYS.map((d, ci) => {
              const we = TS_WEEKEND.includes(ci), today = ci === week.todayIdx;
              const v = matrix[ri][ci];
              return (
                <div key={ci} className={'ts-day' + (we ? ' ts-daycol-weekend' : '') + (today ? ' ts-daycol-today' : '')}>
                  <input className="ts-cell" inputMode="decimal" disabled={!editable} placeholder={editable ? '·' : ''}
                    value={fmtH(v)}
                    onChange={(e) => { const n = parseFloat(e.target.value.replace(',', '.')); setCell(ri, ci, isNaN(n) ? 0 : n); }} />
                </div>
              );
            })}
            <div style={{ padding: '10px 12px', display: 'grid', placeItems: 'center end' }}>
              <span className="num" style={{ fontWeight: 700, fontSize: 15, color: rowTotal ? 'var(--text)' : 'var(--text-3)' }}>{rowTotal ? fmtH(rowTotal) + 'h' : '—'}</span>
            </div>
          </div>
        );
      })}

      {/* Rodapé: adicionar linha */}
      {editable && (
        <div className="ts-gridrow" style={{ gridTemplateColumns: '1fr', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-soft btn-sm" style={{ margin: 12, width: 'fit-content' }}><Icon name="plus" size={14} /> Adicionar projeto / fase</button>
        </div>
      )}

      {/* Totais diários */}
      <div className="ts-gridrow" style={{ gridTemplateColumns: GRID_COLS, background: 'var(--navy)', color: '#fff' }}>
        <div style={{ padding: '14px 18px', fontWeight: 700, fontSize: 13.5 }}>Total diário</div>
        {TS_DAYS.map((d, i) => {
          const t = dayTotal(i), we = TS_WEEKEND.includes(i);
          const over = t > 8;
          return (
            <div key={i} className="num" style={{ padding: '14px 2px', textAlign: 'center', fontWeight: 700, fontSize: 15, color: we ? 'rgba(255,255,255,.4)' : over ? 'var(--accent)' : '#fff', borderLeft: '1px solid rgba(255,255,255,.1)' }}>{t ? fmtH(t) : '–'}</div>
          );
        })}
        <div className="num" style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 800, fontSize: 16, color: 'var(--accent)' }}>{fmtH(grand)}h</div>
      </div>
    </div>
  );
}

/* ---------------- Vista 2: Diário (agenda de blocos) ---------------- */
const DAY_START = 9, DAY_END = 18, PXH = 62;
const parseT = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

function DayView({ week, editable }) {
  const [sel, setSel] = useState(0); // 0 = Segunda
  const entries = sel === 0 ? TS_DAY : [];
  const total = sumArr(entries.map(e => e.dur));
  const cost = sumArr(entries.map(e => e.dur * ME.rate));
  const hours = [];
  for (let h = DAY_START; h <= DAY_END; h++) hours.push(h);

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 300px', alignItems: 'start', gap: 20 }}>
      <div className="card card-pad">
        {/* seletor de dia */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 18, flexWrap: 'wrap' }}>
          {TS_DAYS.map((d, i) => {
            const we = TS_WEEKEND.includes(i), today = i === week.todayIdx, on = i === sel;
            return (
              <button key={i} onClick={() => setSel(i)} className="chip" style={{
                flexDirection: 'column', gap: 1, padding: '7px 13px', minWidth: 52,
                background: on ? 'var(--navy)' : we ? 'var(--surface-2)' : 'var(--surface)',
                color: on ? '#fff' : we ? 'var(--text-3)' : 'var(--text-2)', borderColor: on ? 'transparent' : 'var(--border)',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>{d}</span>
                <span className="num" style={{ fontSize: 15, fontWeight: 700 }}>{week.dates[i]}</span>
                {today && <span style={{ width: 5, height: 5, borderRadius: 99, background: on ? 'var(--accent)' : 'var(--accent)' }}></span>}
              </button>
            );
          })}
        </div>

        {entries.length === 0 ? (
          <div className="empty" style={{ padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', margin: '0 auto 14px', color: 'var(--text-3)' }}><Icon name="clock" size={30} /></div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-2)' }}>Sem registos neste dia</div>
            <div style={{ marginTop: 4 }}>Arraste um bloco ou inicie o cronómetro para registar horas.</div>
            {editable && <button className="btn btn-soft btn-sm" style={{ marginTop: 16 }}><Icon name="plus" size={14} /> Adicionar registo</button>}
          </div>
        ) : (
          <div style={{ position: 'relative', height: (DAY_END - DAY_START) * PXH + 16, marginTop: 6 }}>
            {/* linhas de hora */}
            {hours.map((h, i) => (
              <React.Fragment key={h}>
                <div className="ts-hourlbl" style={{ top: i * PXH }}>{String(h).padStart(2, '0')}:00</div>
                <div className="ts-hourline" style={{ top: i * PXH + 0, left: 56 }}></div>
              </React.Fragment>
            ))}
            {/* blocos */}
            {entries.map((e, i) => {
              const top = (parseT(e.start) - DAY_START) * PXH;
              const h = e.dur * PXH - 5;
              const tone = e.color;
              const short = h < 52;
              return (
                <div key={i} className="ts-block" style={{ top, height: h, background: tone }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.phase}</span>
                    {e.billable
                      ? <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,.22)', padding: '1px 6px', borderRadius: 99, flexShrink: 0 }}>Faturável</span>
                      : <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,0,0,.18)', padding: '1px 6px', borderRadius: 99, flexShrink: 0 }}>Interno</span>}
                  </div>
                  {!short && <div style={{ fontSize: 11.5, fontWeight: 600, opacity: .9, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.code !== '—' ? e.code + ' · ' : ''}{e.project} · {e.tipo}</div>}
                  <div className="num" style={{ position: 'absolute', top: 8, right: 12, fontSize: 11.5, fontWeight: 700, opacity: .92 }}>{e.start}–{e.end}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* resumo do dia */}
      <div className="grid" style={{ gap: 18 }}>
        <div className="card card-pad">
          <div className="card-h"><div><h3 style={{ fontSize: 16 }}>Resumo do dia</h3><span className="sub">{TS_DAYS[sel]} · {week.dates[sel]} Jun</span></div></div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}><div className="num" style={{ fontWeight: 700, fontSize: 22 }}>{fmtH(total) || '0'}h</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>Registadas</div></div>
            <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}><div className="num" style={{ fontWeight: 700, fontSize: 22 }}>€{fmt(Math.round(cost))}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>Custo</div></div>
          </div>
          {entries.length > 0 && <div className="prog" style={{ marginTop: 14 }}><span style={{ width: Math.min(100, total / 8 * 100) + '%' }}></span></div>}
          {entries.length > 0 && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 7 }}>{fmtH(total)}h de 8h · {Math.round(total / 8 * 100)}% do dia</div>}
        </div>

        <div className="card card-pad">
          <div className="card-h"><div><h3 style={{ fontSize: 16 }}>Por tipo</h3></div></div>
          {entries.length === 0 ? <div className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>Sem registos.</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {Object.entries(entries.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + e.dur; return acc; }, {})).map(([tipo, h]) => (
                <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', flex: 1 }}>{tipo}</span>
                  <div className="prog thin" style={{ width: 90 }}><span style={{ width: (h / total * 100) + '%' }}></span></div>
                  <span className="num" style={{ fontWeight: 700, fontSize: 13.5, minWidth: 34, textAlign: 'right' }}>{fmtH(h)}h</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Vista 3: Por projeto ---------------- */
function ProjectView() {
  const weekTotal = sumArr(TS_PROJ.map(p => p.week));
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start', gap: 20 }}>
      <div className="grid" style={{ gap: 14 }}>
        {TS_PROJ.map(p => {
          const consumo = p.prev ? p.real / p.prev : 0;
          const sem = p.prev ? semaforo(1 - (consumo - 1 > 0 ? consumo - 1 : 0)) : null; // dentro do previsto = verde
          const tone = consumo > 1 ? 'red' : consumo > 0.85 ? 'amber' : 'green';
          const col = SEM_COL[tone];
          return (
            <div key={p.code} className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ width: 4, height: 46, borderRadius: 4, background: p.color, flexShrink: 0 }}></span>
              <div style={{ minWidth: 180, flex: '0 0 220px' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {p.code !== '—' && <span className="num">{p.code}</span>}
                  <span className="num" style={{ color: 'var(--accent-700)', fontWeight: 700 }}>+{fmtH(p.week)}h</span>
                  <span>esta semana</span>
                </div>
              </div>

              {p.prev > 0 ? (
                <React.Fragment>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                      <span className="muted">Horas reais <b className="num" style={{ color: 'var(--text)' }}>{fmtH(p.real)}h</b> / prev. {fmtH(p.prev)}h</span>
                      <span className="num" style={{ fontWeight: 700, color: col }}>{Math.round(consumo * 100)}%</span>
                    </div>
                    <div className="prog"><span style={{ width: Math.min(100, consumo * 100) + '%', background: col }}></span></div>
                  </div>
                  <div style={{ textAlign: 'center', flex: '0 0 86px' }}>
                    <div className="num" style={{ fontWeight: 700, fontSize: 17 }}>{p.prazo}%</div>
                    <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>Prazo</div>
                  </div>
                  <Badge tag={tone === 'green' ? 'b-green' : tone === 'amber' ? 'b-amber' : 'b-red'} dot={false}>{tone === 'green' ? 'Dentro do previsto' : tone === 'amber' ? 'Atenção' : 'Derrapagem'}</Badge>
                </React.Fragment>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                  <span className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>Tempo interno · não imputável a contrato</span>
                  <Badge tag="b-gray" dot={false}>Não faturável</Badge>
                </div>
              )}
            </div>
          );
        })}
        <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, padding: '2px 4px' }}>
          Total da semana: <b className="num" style={{ color: 'var(--text)' }}>{fmtH(weekTotal)}h</b> · Produtividade = Horas previstas ÷ reais (semáforo ≥95% verde · ≥85% amarelo, folha do cliente)
        </div>
      </div>

      {/* Utilização da equipa */}
      <div className="card card-pad">
        <div className="card-h"><div><h3 style={{ fontSize: 16 }}>Utilização da equipa</h3><span className="sub">Esta semana · capacidade {TS_CAPACITY}h</span></div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {TS_TEAM.map((t, i) => {
            const u = t.logged / TS_CAPACITY;
            const tone = t.status === 'over' ? 'red' : t.status === 'low' ? 'amber' : 'green';
            const col = SEM_COL[tone];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <Avatar p={t.p} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.p.name.split(' ')[0]} {t.p.name.split(' ')[1]?.[0]}.</span>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13, color: col }}>{fmtH(t.logged)}h</span>
                  </div>
                  <div className="prog thin" style={{ marginTop: 5 }}><span style={{ width: Math.min(100, u * 100) + '%', background: col }}></span></div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <Legend col="var(--success)" label="Equilibrado" />
          <Legend col="var(--warning)" label="Subutilizado" />
          <Legend col="var(--danger)" label="Sobrecarga" />
        </div>
      </div>
    </div>
  );
}

function Legend({ col, label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)' }}><span style={{ width: 9, height: 9, borderRadius: 3, background: col }}></span>{label}</span>;
}

/* ---------------- Estado vazio (semana futura) ---------------- */
function EmptyWeek({ week, onCopy }) {
  return (
    <div className="card card-pad" style={{ minHeight: 380, display: 'grid', placeItems: 'center' }}>
      <div className="empty" style={{ maxWidth: 440 }}>
        <div style={{ width: 76, height: 76, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}><Icon name="calendar" size={36} /></div>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Semana ainda sem registos</div>
        <div style={{ marginTop: 6, lineHeight: 1.6 }}>{week.range} começa a vazio. Copie a estrutura de projetos da semana anterior ou comece com o cronómetro.</div>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginTop: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={onCopy}><Icon name="copy" size={15} /> Copiar semana anterior</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} /> Registar horas</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Timesheets });
