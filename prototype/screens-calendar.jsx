/* ProjectYard — Calendário */

const CAL_CATS = [
  { id: 'reuniao', label: 'Reuniões', color: '#6a5af9' },
  { id: 'prazo', label: 'Prazos', color: '#d65151' },
  { id: 'obra', label: 'Visitas de obra', color: '#e0922a' },
  { id: 'aprovacao', label: 'Aprovações', color: '#2a7fb8' },
  { id: 'pessoal', label: 'Pessoal', color: '#1f9d6b' },
];
const CAL_EVENTS = [
  { date: '2026-06-08', title: 'Design Review — Marquês', cat: 'reuniao', time: '09:00', project: 'Edifício Marquês' },
  { date: '2026-06-09', title: 'Entrega: Estabilidade v2', cat: 'prazo', project: 'Edifício Marquês' },
  { date: '2026-06-11', title: 'Visita de obra — Vértice', cat: 'obra', time: '10:30', project: 'Sede Nova — Vértice' },
  { date: '2026-06-12', title: 'Reunião cliente — Albuquerque', cat: 'reuniao', time: '15:00', project: 'Quinta do Lago — V4' },
  { date: '2026-06-15', title: 'Prazo: Licença Bolhão', cat: 'prazo', project: 'Mercado do Bolhão' },
  { date: '2026-06-16', title: 'Coordenação BIM/MEP', cat: 'reuniao', time: '11:00', project: 'Edifício Marquês' },
  { date: '2026-06-19', title: 'Aprovação Câmara — Bolhão', cat: 'aprovacao', project: 'Mercado do Bolhão' },
  { date: '2026-06-19', title: 'Reunião com cliente Vértice', cat: 'reuniao', time: '16:00', project: 'Sede Nova — Vértice' },
  { date: '2026-06-22', title: 'Visita de obra — Marquês', cat: 'obra', time: '09:30', project: 'Edifício Marquês' },
  { date: '2026-06-24', title: 'Entrega: Mapa de quantidades', cat: 'prazo', project: 'Edifício Marquês' },
  { date: '2026-06-26', title: 'Faturação milestone Vértice', cat: 'aprovacao', project: 'Sede Nova — Vértice' },
  { date: '2026-07-01', title: 'Reunião mensal de equipa', cat: 'reuniao', time: '10:00', project: 'Interno' },
];
const CAL_MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const calFmt = (isoStr) => { const [y, m, d] = isoStr.split('-').map(Number); return d + ' ' + CAL_MESES[m - 1] + ' ' + y; };

function Calendar({ go }) {
  const [active, setActive] = useState(CAL_CATS.map(c => c.id));
  const [view, setView] = useState('Mês');
  const [sel, setSel] = useState(null); // evento aberto
  const [full, setFull] = useState(false);
  const [events, setEvents] = useState(() => CAL_EVENTS.map((e, i) => ({ ...e, id: 'ev' + i })));
  const [dragId, setDragId] = useState(null);   // evento a ser arrastado
  const [dragOver, setDragOver] = useState(null); // iso da célula sob o cursor
  const toggle = (id) => setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const catColor = (id) => CAL_CATS.find(c => c.id === id).color;
  const catLabel = (id) => CAL_CATS.find(c => c.id === id).label;

  const updateEvent = (id, patch) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const next = { ...ev, ...patch };
    if (next.date === ev.date && (next.time || '') === (ev.time || '')) return;
    setEvents(evs => evs.map(e => e.id === id ? next : e));
    const when = calFmt(next.date) + (next.time ? ' · ' + next.time : ' · Todo o dia');
    if (window.PYToast) window.PYToast('“' + ev.title + '” movido para ' + when);
  };

  const year = 2026, month = 5; // June (0-indexed)
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const gridStart = new Date(year, month, 1 - startDay);
  const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(gridStart); d.setDate(gridStart.getDate() + i); return d; });
  const iso = (d) => { const z = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); };
  const todayIso = '2026-06-08';
  const evFor = (d) => events.filter(e => e.date === iso(d) && active.includes(e.cat));

  // listas para Semana / Dia / Lista
  const filtered = events.filter(e => active.includes(e.cat)).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
  const weekDays = Array.from({ length: 7 }, (_, i) => iso(new Date(year, month, 8 + i)));

  return (
    <div className="content" style={{ maxWidth: 1440 }}>
      <PageHead title="Calendário" sub="Reuniões, prazos, visitas de obra e aprovações da equipa" />

      <div className="grid" style={{ gridTemplateColumns: full ? '1fr' : '248px 1fr', alignItems: 'start' }}>
        {/* rail */}
        <div className="grid" style={{ gap: 18, display: full ? 'none' : 'grid' }}>
          <button className="btn btn-gold" style={{ justifyContent: 'center' }} onClick={() => { if (window.PYToast) window.PYToast('Novo evento'); }}><Icon name="plus" size={17} /> Adicionar evento</button>
          <div className="card card-pad">
            <MiniMonth todayIso={todayIso} cells={cells} month={month} iso={iso} hasEv={(d) => evFor(d).length > 0} />
          </div>
          <div className="card card-pad">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Tipos de evento</span>
              <button className="muted-3" style={{ marginLeft: 'auto', border: 'none', background: 'transparent', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => go('settings')} title="Gerir em Definições › Listas"><Icon name="settings" size={13} /> Gerir</button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
              <input type="checkbox" checked={active.length === CAL_CATS.length} onChange={() => setActive(active.length === CAL_CATS.length ? [] : CAL_CATS.map(c => c.id))} style={{ width: 17, height: 17, accentColor: 'var(--navy)' }} /> Ver todos
            </label>
            <div className="divider" style={{ margin: '6px 0 8px' }}></div>
            {CAL_CATS.map(c => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontWeight: 600, fontSize: 13.5, color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={active.includes(c.id)} onChange={() => toggle(c.id)} style={{ width: 17, height: 17, accentColor: c.color }} />
                <span style={{ width: 10, height: 10, borderRadius: 99, background: c.color }}></span>{c.label}
              </label>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="card" style={full ? { position: 'fixed', inset: 0, zIndex: 80, borderRadius: 0, overflow: 'auto', background: 'var(--surface)' } : { overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <button className="icon-btn" style={{ width: 36, height: 36 }} title="Anterior"><Icon name="chevL" size={17} /></button>
            <button className="icon-btn" style={{ width: 36, height: 36 }} title="Seguinte"><Icon name="chevR" size={17} /></button>
            <h2 className="display" style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{view === 'Dia' ? '8 Junho 2026' : view === 'Semana' ? '8 – 14 Junho 2026' : 'Junho 2026'}</h2>
            <div className="seg" style={{ marginLeft: 'auto' }}>
              {['Mês', 'Semana', 'Dia', 'Lista'].map(v => <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v}</button>)}
            </div>
            <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => setFull(f => !f)} title={full ? 'Sair de ecrã inteiro' : 'Ecrã inteiro'}><Icon name={full ? 'x' : 'grid'} size={17} /></button>
          </div>

          {view === 'Mês' ? (
            <React.Fragment>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                  <div key={d} style={{ padding: '12px 0', textAlign: 'center', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '116px' }}>
                {cells.map((d, i) => {
                  const inMonth = d.getMonth() === month;
                  const evs = evFor(d);
                  const isToday = iso(d) === todayIso;
                  const cellIso = iso(d);
                  const isDropTarget = dragOver === cellIso && dragId;
                  return (
                    <div key={i}
                      onDragOver={(e) => { if (dragId) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOver !== cellIso) setDragOver(cellIso); } }}
                      onDrop={(e) => { e.preventDefault(); updateEvent(dragId, { date: cellIso }); setDragId(null); setDragOver(null); }}
                      style={{ borderRight: (i % 7 !== 6) ? '1px solid var(--border)' : 'none', borderBottom: '1px solid var(--border)', padding: 8, background: isDropTarget ? 'var(--accent-soft)' : isToday ? 'var(--accent-soft)' : inMonth ? 'var(--surface)' : 'var(--surface-2)', boxShadow: isDropTarget ? 'inset 0 0 0 2px var(--accent)' : 'none', transition: 'background .12s, box-shadow .12s', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <span className="num" style={{ fontSize: 13, fontWeight: 700, color: !inMonth ? 'var(--text-3)' : isToday ? '#fff' : 'var(--text-2)', width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: 99, background: isToday ? 'var(--accent)' : 'transparent' }}>{d.getDate()}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 5 }}>
                        {evs.slice(0, 3).map((e, j) => (
                          <button key={e.id} draggable
                            onDragStart={(ev) => { ev.dataTransfer.effectAllowed = 'move'; setDragId(e.id); }}
                            onDragEnd={() => { setDragId(null); setDragOver(null); }}
                            onClick={() => setSel(e)} title={e.title + ' — arraste para mover de dia'}
                            style={{ border: 'none', cursor: dragId === e.id ? 'grabbing' : 'grab', textAlign: 'left', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: catColor(e.cat) + '1f', color: catColor(e.cat), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 5, opacity: dragId === e.id ? 0.4 : 1 }}>
                            <span style={{ width: 5, height: 5, borderRadius: 99, background: catColor(e.cat), flexShrink: 0 }}></span>
                            {e.time ? e.time + ' ' : ''}{e.title}
                          </button>
                        ))}
                        {evs.length > 3 && <button onClick={() => setView('Dia')} className="muted-3" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, paddingLeft: 4, textAlign: 'left' }}>+{evs.length - 3} mais</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ) : view === 'Lista' ? (
            <CalAgenda events={filtered} catColor={catColor} catLabel={catLabel} onPick={setSel} scope={view} />
          ) : (
            <CalTimeGrid
              days={view === 'Dia' ? [todayIso] : weekDays}
              events={filtered}
              catColor={catColor} catLabel={catLabel}
              onPick={setSel} onMove={updateEvent}
              dragId={dragId} setDragId={setDragId}
              todayIso={todayIso} full={full}
            />
          )}
        </div>
      </div>

      <CalEventModal ev={sel} onClose={() => setSel(null)} catColor={catColor} catLabel={catLabel} go={go} />
    </div>
  );
}

function CalAgenda({ events, catColor, catLabel, onPick, scope }) {
  if (events.length === 0) {
    return <div className="empty" style={{ padding: '60px 20px' }}><Icon name="calendar" size={32} /><div style={{ marginTop: 10, fontWeight: 700, fontSize: 15, color: 'var(--text-2)' }}>Sem eventos</div><div style={{ marginTop: 4 }}>Nada agendado neste período com os filtros atuais.</div></div>;
  }
  // agrupar por data
  const groups = [];
  events.forEach(e => { const g = groups.find(x => x.date === e.date); if (g) g.items.push(e); else groups.push({ date: e.date, items: [e] }); });
  return (
    <div style={{ padding: '6px 0' }}>
      {groups.map(g => (
        <div key={g.date}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px 6px', position: 'sticky', top: 0, background: 'var(--surface)' }}>
            <span className="num" style={{ fontWeight: 800, fontSize: 15 }}>{g.date.split('-')[2]}</span>
            <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{calFmt(g.date).split(' ').slice(1).join(' ')}{g.date === '2026-06-08' ? ' · Hoje' : ''}</span>
          </div>
          {g.items.map((e, i) => (
            <button key={i} onClick={() => onPick(e)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', border: 'none', borderTop: '1px solid var(--border)', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ width: 4, height: 38, borderRadius: 4, background: catColor(e.cat), flexShrink: 0 }}></span>
              <div style={{ width: 64, flexShrink: 0 }} className="num"><span style={{ fontWeight: 700, fontSize: 13.5 }}>{e.time || '—'}</span></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{catLabel(e.cat)} · {e.project}</div>
              </div>
              <Icon name="chevR" size={16} style={{ color: 'var(--text-3)' }} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

const CAL_WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function CalTimeGrid({ days, events, catColor, catLabel, onPick, onMove, dragId, setDragId, todayIso, full }) {
  const START = 7, END = 21, ROW = 52, GUTTER = 64, COLMIN = 132;
  const SPAN = END - START; // número de linhas/horas
  const HEADH = 56, ALLDAYH = 'auto';
  const [over, setOver] = useState(null); // { dayIso, mins }
  const z = (n) => String(n).padStart(2, '0');
  const minsToTime = (m) => z(Math.floor(m / 60)) + ':' + z(m % 60);
  const timeToMins = (t) => { const [h, mm] = t.split(':').map(Number); return h * 60 + mm; };
  const tmpl = GUTTER + 'px repeat(' + days.length + ', minmax(' + COLMIN + 'px, 1fr))';
  const minW = GUTTER + days.length * COLMIN;

  const calcMins = (e, colEl) => {
    const rect = colEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let mins = START * 60 + Math.round((y / ROW) * 2) * 30; // encaixe a 30 min
    return Math.max(START * 60, Math.min(END * 60 - 30, mins));
  };

  return (
    <div style={{ overflow: 'auto', maxHeight: full ? 'calc(100vh - 132px)' : 564 }}>
      <div style={{ minWidth: minW }}>
        {/* cabeçalho dos dias */}
        <div style={{ display: 'grid', gridTemplateColumns: tmpl, position: 'sticky', top: 0, zIndex: 3, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ height: HEADH, borderRight: '1px solid var(--border)' }}></div>
          {days.map((d, i) => {
            const [y, m, dd] = d.split('-').map(Number);
            const wd = new Date(y, m - 1, dd).getDay();
            const isToday = d === todayIso;
            return (
              <div key={d} style={{ height: HEADH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, borderRight: i < days.length - 1 ? '1px solid var(--border)' : 'none', background: isToday ? 'var(--accent-soft)' : 'transparent' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{CAL_WD[wd]}</span>
                <span className="num" style={{ fontSize: 16, fontWeight: 800, color: isToday ? '#fff' : 'var(--text)', width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 99, background: isToday ? 'var(--accent)' : 'transparent' }}>{dd}</span>
              </div>
            );
          })}
        </div>

        {/* faixa Todo o dia */}
        <div style={{ display: 'grid', gridTemplateColumns: tmpl, position: 'sticky', top: HEADH, zIndex: 2, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', color: 'var(--text-3)', borderRight: '1px solid var(--border)' }}>Todo o dia</div>
          {days.map((d, i) => {
            const allDay = events.filter(e => e.date === d && !e.time);
            const isOver = over && over.dayIso === d && over.mins === -1 && dragId;
            return (
              <div key={d}
                onDragOver={(e) => { if (dragId) { e.preventDefault(); if (!over || over.dayIso !== d || over.mins !== -1) setOver({ dayIso: d, mins: -1 }); } }}
                onDrop={(e) => { e.preventDefault(); onMove(dragId, { date: d, time: undefined }); setDragId(null); setOver(null); }}
                style={{ minHeight: 34, padding: 4, display: 'flex', flexDirection: 'column', gap: 3, borderRight: i < days.length - 1 ? '1px solid var(--border)' : 'none', background: isOver ? 'var(--accent-soft)' : 'transparent', boxShadow: isOver ? 'inset 0 0 0 2px var(--accent)' : 'none' }}>
                {allDay.map(e => (
                  <button key={e.id} draggable
                    onDragStart={(ev) => { ev.dataTransfer.effectAllowed = 'move'; setDragId(e.id); }}
                    onDragEnd={() => { setDragId(null); setOver(null); }}
                    onClick={() => onPick(e)} title={e.title + ' — arraste para mover'}
                    style={{ border: 'none', cursor: dragId === e.id ? 'grabbing' : 'grab', textAlign: 'left', fontSize: 11.5, fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: catColor(e.cat) + '1f', color: catColor(e.cat), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: dragId === e.id ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: catColor(e.cat), flexShrink: 0 }}></span>{e.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* grelha de horas */}
        <div style={{ display: 'grid', gridTemplateColumns: tmpl, position: 'relative' }}>
          {/* eixo de horas */}
          <div style={{ borderRight: '1px solid var(--border)' }}>
            {Array.from({ length: SPAN }, (_, h) => (
              <div key={h} style={{ height: ROW, position: 'relative' }}>
                <span style={{ position: 'absolute', top: -7, right: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }} className="num">{z(START + h)}:00</span>
              </div>
            ))}
          </div>
          {/* colunas dos dias */}
          {days.map((d, ci) => {
            const dayEvs = events.filter(e => e.date === d && e.time).sort((a, b) => a.time.localeCompare(b.time));
            const isOverCol = over && over.dayIso === d && over.mins >= 0 && dragId;
            return (
              <div key={d}
                onDragOver={(e) => { if (dragId) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; const m = calcMins(e, e.currentTarget); if (!over || over.dayIso !== d || over.mins !== m) setOver({ dayIso: d, mins: m }); } }}
                onDrop={(e) => { e.preventDefault(); const m = calcMins(e, e.currentTarget); onMove(dragId, { date: d, time: minsToTime(m) }); setDragId(null); setOver(null); }}
                style={{ position: 'relative', height: SPAN * ROW, borderRight: ci < days.length - 1 ? '1px solid var(--border)' : 'none', backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '100% ' + ROW + 'px', background: d === todayIso ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent' }}>
                {/* linhas de hora */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '100% ' + ROW + 'px', pointerEvents: 'none' }}></div>
                {/* eventos */}
                {dayEvs.map(e => {
                  const top = (timeToMins(e.time) - START * 60) / 60 * ROW;
                  return (
                    <button key={e.id} draggable
                      onDragStart={(ev) => { ev.dataTransfer.effectAllowed = 'move'; setDragId(e.id); }}
                      onDragEnd={() => { setDragId(null); setOver(null); }}
                      onClick={() => onPick(e)} title={e.title + ' — arraste para mover de hora/dia'}
                      style={{ position: 'absolute', top: top + 1, left: 4, right: 4, height: ROW - 3, border: 'none', borderLeft: '3px solid ' + catColor(e.cat), cursor: dragId === e.id ? 'grabbing' : 'grab', textAlign: 'left', padding: '4px 8px', borderRadius: 6, background: catColor(e.cat) + '1f', color: catColor(e.cat), overflow: 'hidden', opacity: dragId === e.id ? 0.4 : 1, zIndex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                      <div className="num" style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.85 }}>{e.time}</div>
                    </button>
                  );
                })}
                {/* linha-guia de largada */}
                {isOverCol && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: (over.mins - START * 60) / 60 * ROW, height: 0, borderTop: '2px solid var(--accent)', zIndex: 4, pointerEvents: 'none' }}>
                    <span className="num" style={{ position: 'absolute', top: -9, left: 4, fontSize: 10, fontWeight: 800, color: '#fff', background: 'var(--accent)', padding: '1px 5px', borderRadius: 4 }}>{minsToTime(over.mins)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CalEventModal({ ev, onClose, catColor, catLabel, go }) {
  if (!ev) return null;
  const col = catColor(ev.cat);
  return (
    <Modal open={!!ev} onClose={onClose} title={ev.title} sub={calFmt(ev.date) + (ev.time ? ' · ' + ev.time : '')} width={460}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={() => { if (window.PYToast) window.PYToast('Evento eliminado'); onClose(); }} style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}><Icon name="x" size={15} /> Eliminar</button>
        <button className="btn btn-primary" onClick={() => { if (window.PYToast) window.PYToast('Evento atualizado'); onClose(); }}><Icon name="check" size={15} /> Guardar</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ width: 12, height: 12, borderRadius: 4, background: col }}></span>
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{catLabel(ev.cat)}</span>
      </div>
      <DetailRow icon="calendar" label="Data" value={calFmt(ev.date)} />
      <DetailRow icon="clock" label="Hora" value={ev.time || 'Todo o dia'} />
      <DetailRow icon="folder" label="Projeto" value={ev.project} />
      <DetailRow icon="users" label="Participantes" value="Ana Moreira, Rui Cardoso +2" />
      <button className="btn btn-soft btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => { onClose(); go('projects'); }}>Abrir projeto <Icon name="arrowRight" size={14} /></button>
    </Modal>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0' }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text-3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={icon} size={16} /></span>
      <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 700, minWidth: 92 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{value}</span>
    </div>
  );
}

function MiniMonth({ cells, month, iso, todayIso, hasEv }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button className="icon-btn" style={{ width: 28, height: 28, border: 'none', background: 'transparent' }}><Icon name="chevL" size={15} /></button>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Junho 2026</span>
        <button className="icon-btn" style={{ width: 28, height: 28, border: 'none', background: 'transparent' }}><Icon name="chevR" size={15} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', padding: '4px 0' }}>{d}</div>)}
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === month;
          const isToday = iso(d) === todayIso;
          return (
            <div key={i} style={{ position: 'relative', fontSize: 11.5, fontWeight: isToday ? 800 : 600, padding: '5px 0', borderRadius: 7, color: !inMonth ? 'var(--text-3)' : isToday ? '#fff' : 'var(--text)', background: isToday ? 'var(--navy)' : 'transparent', cursor: 'pointer' }}>
              {d.getDate()}
              {hasEv(d) && !isToday && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: 99, background: 'var(--accent)' }}></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Calendar });
