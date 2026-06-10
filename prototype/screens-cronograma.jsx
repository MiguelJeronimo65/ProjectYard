/* ProjectYard — Cronograma Global (portfólio · previsto vs real)
   Fases de todos os projetos numa linha de tempo multi-ano (anos lado a lado).
   Cada fase mostra a barra PREVISTA e a REAL. Projetos podem atravessar anos.
   Coluna de projetos fixa (sticky) + navegação por ano. */

const isLate = (ph, today) => {
  if (!ph.real) return false;
  const tol = 0.15;
  return ph.estado === 'Concluída' ? (ph.real[1] - ph.prev[1] > tol) : (today - ph.prev[1] > tol);
};

function CronogramaGlobal({ go }) {
  const { months, years, today, projects } = GANTT_GLOBAL;
  const [scope, setScope] = useState('Mês');
  const scrollRef = useRef(null);
  const SCOPE_MW = { 'Semana': 92, 'Mês': 80, 'Trimestre': 50 };
  const monthW = SCOPE_MW[scope];
  const LABELW = 286, ROWH = 52, GROUPH = 46;
  const totalMonths = years.length * 12;
  const gridW = totalMonths * monthW;
  const pct = (m) => (m / totalMonths) * 100;
  const curYear = Math.floor(today / 12);

  // cabeçalho: faixa de anos + linha de meses/trimestres
  const yearCells = years.map((y, yi) => ({ y, accent: yi === curYear }));
  let headerCells, gridSegs;
  if (scope === 'Trimestre') {
    headerCells = [];
    years.forEach((y, yi) => { for (let q = 0; q < 4; q++) { const idx = yi * 4 + q; headerCells.push({ label: 'T' + (q + 1), w: 3 * monthW, accent: Math.floor(today / 3) === idx }); } });
    gridSegs = headerCells.map((c, i) => ({ x: i * 3 * monthW, w: 3 * monthW, shade: i % 2 === 1 }));
  } else {
    headerCells = Array.from({ length: totalMonths }, (_, i) => ({ label: months[i % 12], w: monthW, accent: Math.floor(today) === i }));
    gridSegs = Array.from({ length: totalMonths }, (_, i) => ({ x: i * monthW, w: monthW, shade: i % 2 === 1 }));
  }
  const yearLines = years.map((y, yi) => yi).slice(1).map(yi => yi * 12 * monthW);

  const WPY = 52;
  const weekW = scope === 'Semana' ? (12 * monthW) / WPY : monthW / 4;
  const totalWeeks = scope === 'Semana' ? years.length * WPY : 0;
  const weekLines = scope === 'Semana' ? Array.from({ length: totalWeeks - 1 }, (_, k) => k + 1).filter(k => k % WPY !== 0) : [];
  const weekNums = scope === 'Semana' ? Array.from({ length: totalWeeks }, (_, k) => (k % WPY) + 1) : [];

  // navegação
  const scrollToMonth = (m, lead = 0.22) => {
    const el = scrollRef.current; if (!el) return;
    const vis = el.clientWidth - LABELW;
    el.scrollTo({ left: Math.max(0, (m / totalMonths) * gridW - vis * lead), behavior: 'smooth' });
  };
  const nudgeYear = (dir) => { const el = scrollRef.current; if (el) el.scrollBy({ left: dir * 12 * monthW, behavior: 'smooth' }); };
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    el.scrollLeft = Math.max(0, (today / totalMonths) * gridW - (el.clientWidth - LABELW) * 0.28);
  }, [scope]);

  const allPhases = projects.flatMap(p => p.phases);
  const nCrit = allPhases.filter(p => p.critica).length;
  const nLate = allPhases.filter(p => isLate(p, today)).length;
  const nDone = allPhases.filter(p => p.estado === 'Concluída').length;
  const nCurso = allPhases.filter(p => p.estado === 'Em curso').length;
  const nInit = allPhases.filter(p => p.estado === 'Por iniciar').length;
  const [filter, setFilter] = useState('');
  const pred = {
    crit: f => f.critica,
    late: f => isLate(f, today),
    done: f => f.estado === 'Concluída',
    curso: f => f.estado === 'Em curso',
    init: f => f.estado === 'Por iniciar',
  };
  const filterChips = [
    { k: 'crit', icon: 'flag', label: 'críticas', n: nCrit, color: 'var(--danger)', soft: 'var(--danger-soft)' },
    { k: 'late', icon: 'alert', label: 'em atraso', n: nLate, color: 'var(--warning)', soft: 'var(--warning-soft)' },
    { k: 'done', icon: 'check', label: 'concluídas', n: nDone, color: 'var(--success)', soft: 'var(--success-soft)' },
    { k: 'curso', icon: 'play', label: 'em curso', n: nCurso, color: 'var(--info)', soft: 'var(--info-soft)' },
    { k: 'init', icon: 'clock', label: 'por iniciar', n: nInit, color: 'var(--text-2)', soft: 'var(--surface-3)' },
  ];

  // lista plana: cabeçalho de projeto + fases · multi-ano = atravessa anos
  const rows = [];
  projects.forEach(p => {
    const prevS = Math.min(...p.phases.map(f => f.prev[0]));
    const prevE = Math.max(...p.phases.map(f => f.prev[1]));
    const reals = p.phases.filter(f => f.real);
    const realS = reals.length ? Math.min(...reals.map(f => f.real[0])) : null;
    const realE = reals.length ? Math.max(...reals.map(f => f.estado === 'Em curso' ? today : f.real[1])) : null;
    const spansYears = Math.floor(prevS / 12) !== Math.floor((prevE - 0.001) / 12);
    rows.push({ type: 'group', p, env: { prevS, prevE, realS, realE }, spansYears });
    p.phases.forEach(f => rows.push({ type: 'phase', f, color: p.color }));
  });

  const stickyLabel = (z, bg) => ({ position: 'sticky', left: 0, zIndex: z, background: bg, flexShrink: 0, borderRight: '1px solid var(--border)' });

  return (
    <div className="content">
      <PageHead
        title="Cronograma global"
        sub={'Portfólio ' + years[0] + '–' + years[years.length - 1] + ' · previsto vs real · projetos que atravessam anos'}
        actions={<React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button className="icon-btn" style={{ width: 36, height: 36 }} title="Recuar um ano" onClick={() => nudgeYear(-1)}><Icon name="chevL" size={18} /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => scrollToMonth(today)}>Hoje</button>
            <button className="icon-btn" style={{ width: 36, height: 36 }} title="Avançar um ano" onClick={() => nudgeYear(1)}><Icon name="chevR" size={18} /></button>
          </div>
          <div className="seg">{['Semana', 'Mês', 'Trimestre'].map(s => <button key={s} className={scope === s ? 'active' : ''} onClick={() => setScope(s)}>{s}</button>)}</div>
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
        </React.Fragment>}
      />

      {/* resumo + legenda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span className="chip" style={{ cursor: 'default' }}><Icon name="layers" size={14} /> {projects.length} projetos · {allPhases.length} fases</span>
        {filterChips.map(c => {
          const on = filter === c.k;
          return (
            <button key={c.k} className="chip" onClick={() => setFilter(f => f === c.k ? '' : c.k)}
              style={{ cursor: 'pointer', color: on ? '#fff' : c.color, background: on ? c.color : 'transparent', borderColor: on ? c.color : c.soft }}>
              <Icon name={c.icon} size={14} /> {c.n} {c.label}{on && <Icon name="x" size={12} />}
            </button>
          );
        })}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <LegBar label="Previsto" kind="prev" />
          <LegBar label="Real" kind="real" />
          <LegBar label="Atraso" kind="late" />
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--danger)' }}><span style={{ width: 2, height: 14, background: 'var(--danger)' }}></span> Hoje · 8 Jun 2026</span>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div ref={scrollRef} style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: LABELW + gridW }}>
            {/* cabeçalho */}
            <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {/* faixa de anos */}
              <div style={{ display: 'flex' }}>
                <div style={{ ...stickyLabel(7, 'var(--surface)'), width: LABELW, padding: '9px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>Ano</div>
                <div style={{ width: gridW, display: 'flex' }}>
                  {yearCells.map((c, i) => (
                    <div key={i} style={{ width: 12 * monthW, textAlign: 'center', padding: '9px 0', fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-display)', color: c.accent ? 'var(--primary)' : 'var(--text-2)', borderRight: '1px solid var(--border-2)', background: c.accent ? 'var(--primary-soft)' : 'transparent' }}>{c.y}</div>
                  ))}
                </div>
              </div>
              {/* meses / trimestres */}
              <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
                <div style={{ ...stickyLabel(7, 'var(--surface)'), width: LABELW, padding: '11px 18px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>Projeto / Fase</div>
                <div style={{ width: gridW, display: 'flex' }}>
                  {headerCells.map((c, i) => (
                    <div key={i} style={{ width: c.w, textAlign: 'center', padding: scope === 'Semana' ? '9px 0 4px' : '11px 0', fontSize: 12, fontWeight: 700, color: c.accent ? 'var(--primary)' : 'var(--text-3)', borderRight: '1px solid var(--border)' }}>{c.label}</div>
                  ))}
                </div>
              </div>
              {/* semanas */}
              {scope === 'Semana' && (
                <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
                  <div style={{ ...stickyLabel(7, 'var(--surface)'), width: LABELW, padding: '4px 18px', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Semana</div>
                  <div style={{ width: gridW, display: 'flex' }}>
                    {weekNums.map((w, i) => (
                      <div key={i} className="num" style={{ width: weekW, textAlign: 'center', padding: '4px 0', fontSize: 9, fontWeight: 700, color: 'var(--text-3)', borderRight: '1px solid var(--border)', background: Math.floor(i / WPY) % 2 ? 'var(--surface-2)' : 'transparent' }}>{w}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* corpo */}
            <div style={{ position: 'relative' }}>
              {/* gridlines + anos + hoje */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: LABELW, width: gridW, pointerEvents: 'none', zIndex: 0 }}>
                {gridSegs.map((s, i) => (
                  <div key={i} style={{ position: 'absolute', left: s.x, top: 0, bottom: 0, width: s.w, borderRight: '1px solid var(--border)', background: s.shade ? 'var(--surface-2)' : 'transparent', opacity: s.shade ? 0.5 : 1 }}></div>
                ))}
                {weekLines.map(k => (
                  <div key={'w' + k} style={{ position: 'absolute', left: k * weekW, top: 0, bottom: 0, width: 1, background: 'var(--border)', opacity: 0.4 }}></div>
                ))}
                {yearLines.map((x, i) => (
                  <div key={'y' + i} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 2, background: 'var(--border-2)' }}></div>
                ))}
                <div style={{ position: 'absolute', left: (today / totalMonths) * gridW, top: 0, bottom: 0, width: 2, background: 'var(--danger)', zIndex: 4 }}>
                  <div style={{ position: 'absolute', top: -1, left: -4, width: 10, height: 10, borderRadius: 99, background: 'var(--danger)' }}></div>
                </div>
              </div>

              {/* linhas */}
              {rows.map((row, i) => row.type === 'group' ? (
                <GroupRow key={i} row={row} pct={pct} LABELW={LABELW} gridW={gridW} GROUPH={GROUPH} today={today} go={go}
                  stickyLabel={stickyLabel} dim={!!filter && !row.p.phases.some(f => pred[filter](f))} />
              ) : (
                <PhaseRow key={i} row={row} pct={pct} LABELW={LABELW} gridW={gridW} ROWH={ROWH} today={today}
                  stickyLabel={stickyLabel} dim={!!filter && !pred[filter](row.f)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* cabeçalho de projeto com envelope previsto/real */
function GroupRow({ row, pct, LABELW, gridW, GROUPH, today, go, dim, stickyLabel }) {
  const { p, env, spansYears } = row;
  const openProj = () => { const pr = PROJECTS.find(x => x.code === p.code); if (pr) go('project', pr); };
  return (
    <div style={{ display: 'flex', height: GROUPH, alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'relative', opacity: dim ? 0.26 : 1, transition: 'opacity .2s' }}>
      <div onClick={openProj} className="row-click" style={{ ...stickyLabel(2, 'var(--surface-2)'), width: LABELW, padding: '0 18px', height: '100%', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <span className={'health-dot h-' + (p.health === 'green' ? 'green' : p.health === 'amber' ? 'amber' : 'red')}></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 7 }}>{p.name}{spansYears && <span title="Atravessa mais do que um ano" className="badge b-gray" style={{ padding: '0 6px', fontSize: 9.5 }}>multi-ano</span>}</div>
          <div className="muted-3 num" style={{ fontSize: 11, fontWeight: 600 }}>{p.code} · {p.prazo}% no prazo</div>
        </div>
        <Avatar p={p.pm} size={26} />
      </div>
      <div style={{ position: 'relative', width: gridW, height: '100%' }}>
        <div style={{ position: 'absolute', left: pct(env.prevS) + '%', width: pct(env.prevE - env.prevS) + '%', top: 14, height: 7, borderRadius: 5, background: p.color + '22', border: '1px solid ' + p.color + '55' }}></div>
        {env.realS != null && <div style={{ position: 'absolute', left: pct(env.realS) + '%', width: pct(env.realE - env.realS) + '%', top: 24, height: 8, borderRadius: 5, background: p.color }}></div>}
      </div>
    </div>
  );
}

/* linha de fase com barra prevista + real */
function PhaseRow({ row, pct, LABELW, gridW, ROWH, today, dim, stickyLabel }) {
  const { f, color } = row;
  const late = isLate(f, today);
  const realColor = late ? 'var(--danger)' : f.estado === 'Concluída' ? 'var(--success)' : color;
  const realEnd = f.real ? (f.estado === 'Em curso' ? today : f.real[1]) : null;

  return (
    <div style={{ display: 'flex', height: ROWH, alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'relative', opacity: dim ? 0.26 : 1, transition: 'opacity .2s' }}>
      <div style={{ ...stickyLabel(2, 'var(--surface)'), width: LABELW, padding: '0 18px 0 30px', height: '100%', display: 'flex', alignItems: 'center', gap: 9 }}>
        {f.critica && <span title="Fase crítica" style={{ color: 'var(--danger)', flexShrink: 0, display: 'grid' }}><Icon name="flag" size={14} /></span>}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="muted-3">{f.estado}{f.prazo > 0 ? ' · ' + f.prazo + '%' : ''}</span>
            {late && <span className="badge b-red" style={{ padding: '1px 7px', fontSize: 10 }}>Atraso</span>}
          </div>
        </div>
        <Avatar p={f.who} size={24} />
      </div>

      <div style={{ position: 'relative', width: gridW, height: '100%' }}>
        <div title={'Previsto'} style={{ position: 'absolute', left: pct(f.prev[0]) + '%', width: pct(f.prev[1] - f.prev[0]) + '%', top: 13, height: 9, borderRadius: 5, background: color + '1f', border: '1px solid ' + color + '55' }}></div>
        {f.real ? (
          <div title={'Real'} style={{ position: 'absolute', left: pct(f.real[0]) + '%', width: pct(realEnd - f.real[0]) + '%', top: 25, height: 11, borderRadius: 5, background: realColor, boxShadow: 'var(--sh-sm)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {f.estado === 'Em curso' && <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', padding: '0 6px' }}>{f.prazo}%</span>}
          </div>
        ) : (
          <div style={{ position: 'absolute', left: pct(f.prev[0]) + '%', top: 27, fontSize: 11, fontWeight: 600, color: 'var(--text-3)', paddingLeft: 3 }}>Por iniciar</div>
        )}
      </div>
    </div>
  );
}

function LegBar({ label, kind }) {
  const style = kind === 'prev'
    ? { background: 'var(--text-3)22', border: '1px solid var(--text-3)' }
    : kind === 'late'
      ? { background: 'var(--danger)' }
      : { background: 'var(--navy)' };
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}>
      <span style={{ width: 20, height: kind === 'prev' ? 9 : 10, borderRadius: 4, ...style }}></span>{label}
    </span>
  );
}

Object.assign(window, { CronogramaGlobal });
