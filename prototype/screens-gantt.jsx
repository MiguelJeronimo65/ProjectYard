/* ProjectYard — Cronograma (Gantt) */

function Gantt({ go }) {
  const { months, today } = GANTT;
  const [scale, setScale] = useState('Fase');
  const [proj, setProj] = useState('PY-118');
  const P = GANTT_GLOBAL.projects.find(p => p.code === proj);
  const baseRows = proj === 'PY-118' ? GANTT.rows : P.phases.map(ph => ({ type: 'phase', name: ph.name, start: ph.prev[0], end: ph.prev[1], progress: ph.prazo, color: P.color }));
  const COLW = scale === 'Semana' ? 122 : 92;           // px per month column
  const shownRows = scale === 'Fase' ? baseRows.filter(r => r.type !== 'task') : baseRows;
  const LABELW = 300;        // left label column
  const ROWH = 46;
  const gridW = months.length * COLW;
  const pct = (m) => (m / months.length) * 100;

  const phases = baseRows.filter(r => r.type === 'phase').length;
  const nTasks = baseRows.filter(r => r.type === 'task').length;

  return (
    <div className="content">
      <PageHead
        crumb={[P.name, 'Cronograma']}
        title="Cronograma"
        sub={P.name + ' · ' + phases + ' fases · ano 2026'}
        actions={<React.Fragment>
          <div style={{ minWidth: 230 }}><SelectInput value={proj} onChange={(e) => setProj(e.target.value)}>{GANTT_GLOBAL.projects.map(p => <option key={p.code} value={p.code}>{p.code} · {p.name}</option>)}</SelectInput></div>
          <div className="seg">{['Semana', 'Mês', 'Fase'].map(s => <button key={s} className={scale === s ? 'active' : ''} onClick={() => setScale(s)}>{s}</button>)}</div>
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
        </React.Fragment>}
      />

      {/* legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Leg c="#6a5af9" t="Fase" bar />
          <Leg c="var(--accent)" t="Tarefa em curso" bar />
          <Leg c="var(--text-3)" t="Por iniciar" bar />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--navy)', transform: 'rotate(45deg)' }}></span> Marco
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--danger)' }}>
          <span style={{ width: 2, height: 14, background: 'var(--danger)' }}></span> Hoje · 8 Jun
        </div>
        <span className="muted-3 card-h more" style={{ fontSize: 12.5, fontWeight: 600 }}>{phases} fases · {nTasks} tarefas</span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: LABELW + gridW }}>
            {/* header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2 }}>
              <div style={{ width: LABELW, flexShrink: 0, padding: '14px 18px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-3)', borderRight: '1px solid var(--border)' }}>Fase / Tarefa</div>
              <div style={{ position: 'relative', width: gridW, display: 'flex' }}>
                {months.map((m, i) => (
                  <div key={i} style={{ width: COLW, textAlign: 'center', padding: '14px 0', fontSize: 12.5, fontWeight: 700, color: i === 5 ? 'var(--primary)' : 'var(--text-3)', borderRight: '1px solid var(--border)' }}>{m}</div>
                ))}
              </div>
            </div>

            {/* body */}
            <div style={{ position: 'relative' }}>
              {/* vertical month gridlines */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: LABELW, width: gridW, pointerEvents: 'none' }}>
                {months.map((m, i) => (
                  <div key={i} style={{ position: 'absolute', left: i * COLW, top: 0, bottom: 0, width: COLW, borderRight: '1px solid var(--border)', background: i % 2 ? 'var(--surface-2)' : 'transparent', opacity: i % 2 ? 0.5 : 1 }}></div>
                ))}
                {/* today line */}
                <div style={{ position: 'absolute', left: (today / months.length) * gridW, top: 0, bottom: 0, width: 2, background: 'var(--danger)', zIndex: 3 }}>
                  <div style={{ position: 'absolute', top: -1, left: -4, width: 10, height: 10, borderRadius: 99, background: 'var(--danger)' }}></div>
                </div>
              </div>

              {/* rows */}
              {shownRows.map((r, i) => (
                <div key={i} style={{ display: 'flex', height: ROWH, alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                  {/* label */}
                  <div style={{ width: LABELW, flexShrink: 0, padding: '0 18px', borderRight: '1px solid var(--border)', height: '100%', display: 'flex', alignItems: 'center', gap: 9 }}>
                    {r.type === 'phase' && <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color, flexShrink: 0 }}></span>}
                    {r.type === 'milestone' && <span style={{ color: 'var(--navy)', flexShrink: 0, display: 'grid' }}><Icon name="flag" size={15} /></span>}
                    <span style={{ fontWeight: r.type === 'phase' ? 700 : r.type === 'milestone' ? 600 : 600, fontSize: r.type === 'phase' ? 13.5 : 13, color: r.type === 'task' ? 'var(--text-2)' : 'var(--text)', paddingLeft: r.type === 'task' ? 8 : 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: r.type === 'milestone' ? 'italic' : 'normal' }}>{r.name}</span>
                    {r.who && r.type === 'task' && <span style={{ marginLeft: 'auto', flexShrink: 0 }}><Avatar p={r.who} size={24} /></span>}
                  </div>

                  {/* track */}
                  <div style={{ position: 'relative', width: gridW, height: '100%' }}>
                    {r.type === 'milestone' ? (
                      <div title={r.name} style={{ position: 'absolute', left: `calc(${pct(r.at)}% - 9px)`, top: '50%', transform: 'translateY(-50%) rotate(45deg)', width: 18, height: 18, background: 'var(--navy)', borderRadius: 4, border: '2px solid var(--surface)', boxShadow: 'var(--sh-sm)', zIndex: 2 }}></div>
                    ) : (
                      <Bar r={r} pct={pct} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ r, pct }) {
  const left = pct(r.start);
  const width = pct(r.end - r.start);
  const isPhase = r.type === 'phase';
  const base = isPhase ? r.color : (r.progress >= 100 ? '#1f9d6b' : r.progress > 0 ? 'var(--accent)' : 'var(--text-3)');
  const h = isPhase ? 22 : 16;
  return (
    <div style={{
      position: 'absolute', left: left + '%', width: width + '%', top: '50%', transform: 'translateY(-50%)',
      height: h, borderRadius: 7, background: isPhase ? base + '26' : base + '2e',
      border: '1px solid ' + base + (isPhase ? '66' : '55'), overflow: 'hidden', display: 'flex', alignItems: 'center',
    }}>
      <div style={{ height: '100%', width: r.progress + '%', background: base, opacity: isPhase ? 0.9 : 1, borderRadius: 6 }}></div>
      {isPhase && <span style={{ position: 'absolute', right: 8, fontSize: 11, fontWeight: 800, color: base, filter: 'brightness(0.7)' }}>{r.progress}%</span>}
    </div>
  );
}

function Leg({ c, t, bar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}>
      <span style={{ width: 18, height: bar ? 10 : 12, borderRadius: bar ? 4 : 3, background: c }}></span>{t}
    </div>
  );
}

Object.assign(window, { Gantt });
