/* ProjectYard — Tasks / Kanban (arrastar entre colunas + nova tarefa) */

function Tasks({ go }) {
  const [view, setView] = useState('kanban');
  const [tasks, setTasks] = useState(KANBAN.tasks.filter(t => t.pid === 'PY-118'));
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const [nt, setNt] = useState(null); // null | colId (modal Nova tarefa)
  const [editId, setEditId] = useState(null);
  const [fa, setFa] = useState(''); const [fp, setFp] = useState(''); const [fph, setFph] = useState('');
  const prioTag = { 'Alta': 'b-red', 'Média': 'b-amber', 'Baixa': 'b-gray' };
  const passes = (t) => (!fa || t.assignee === PEOPLE[fa]) && (!fp || t.prio === fp) && (!fph || t.phase === fph);
  const anyFilter = fa || fp || fph;

  const move = (colId) => {
    if (!dragId) { setOverCol(null); return; }
    const t = tasks.find(x => x.id === dragId);
    if (t && t.col !== colId) {
      setTasks(ts => ts.map(x => x.id === dragId ? { ...x, col: colId } : x));
      const c = KANBAN.cols.find(x => x.id === colId);
      if (window.PYToast) window.PYToast('Tarefa movida para “' + c.name + '”');
    }
    setDragId(null); setOverCol(null);
  };

  const addTask = (d) => {
    const id = 'tn' + Date.now();
    setTasks(ts => [...ts, { id, col: d.col, title: d.title || 'Nova tarefa', phase: d.phase, prio: d.prio, due: d.due || '—', assignee: d.assignee, checklist: [0, 3], comments: 0, attach: 0, tags: d.tag ? [d.tag] : [], notes: [] }]);
    if (window.PYToast) window.PYToast('Tarefa criada em “' + KANBAN.cols.find(c => c.id === d.col).name + '”');
  };
  const updateTask = (id, patch) => setTasks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  const editTask = tasks.find(t => t.id === editId);

  return (
    <div className="content">
      <PageHead
        title="Tarefas"
        sub="Edifício Marquês — Reabilitação · arrasta os cartões entre colunas"
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => { setFa(''); setFp(''); setFph(''); }}><Icon name="filter" size={16} /> {anyFilter ? 'Limpar filtros' : 'Filtrar'}</button>
          <button className="btn btn-primary" onClick={() => setNt('todo')}><Icon name="plus" size={16} /> Nova tarefa</button>
        </React.Fragment>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="seg">
          <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}><Icon name="kanban" size={15} /> Quadro</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><Icon name="dots" size={15} /> Lista</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
          <FilterChip icon="user" label="Responsável" value={fa} onChange={setFa} options={Object.keys(PEOPLE).map(k => ({ value: k, label: PEOPLE[k].name }))} />
          <FilterChip icon="flag" label="Prioridade" value={fp} onChange={setFp} options={['Alta', 'Média', 'Baixa'].map(p => ({ value: p, label: p }))} />
          <FilterChip icon="layers" label="Fase" value={fph} onChange={setFph} options={[...new Set(KANBAN.tasks.map(t => t.phase))].map(p => ({ value: p, label: p }))} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          {Object.keys(PEOPLE).map((k, i) => (
            <button key={k} onClick={() => setFa(fa === k ? '' : k)} title={PEOPLE[k].name}
              style={{ border: 'none', background: 'transparent', padding: 0, marginLeft: i === 0 ? 0 : -9, borderRadius: 99, cursor: 'pointer', opacity: (fa && fa !== k) ? 0.4 : 1, transition: 'opacity .12s, transform .12s', transform: fa === k ? 'translateY(-2px)' : 'none' }}>
              <div style={{ borderRadius: 99, border: '2px solid ' + (fa === k ? 'var(--accent)' : 'var(--surface)'), boxShadow: fa === k ? '0 0 0 1px var(--accent)' : 'none' }}>
                <Avatar p={PEOPLE[k]} size={30} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
          {KANBAN.cols.map(col => {
            const cards = tasks.filter(t => t.col === col.id && passes(t));
            const on = overCol === col.id;
            return (
              <div key={col.id}
                onDragOver={(e) => { e.preventDefault(); if (overCol !== col.id) setOverCol(col.id); }}
                onDrop={(e) => { e.preventDefault(); move(col.id); }}
                style={{ background: on ? 'var(--accent-soft)' : 'var(--surface-2)', borderRadius: 'var(--r)', padding: 12, border: '1px ' + (on ? 'dashed var(--accent)' : 'solid var(--border)'), transition: 'background .12s, border-color .12s', minHeight: 90 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 6px 12px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: col.accent }}></span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{col.name}</span>
                  <span className="num" style={{ marginLeft: 4, fontWeight: 700, fontSize: 12.5, color: 'var(--text-3)', background: 'var(--surface)', padding: '1px 8px', borderRadius: 99 }}>{cards.length}</span>
                  <button className="icon-btn" style={{ marginLeft: 'auto', width: 28, height: 28, border: 'none', background: 'transparent' }} onClick={() => setNt(col.id)} title="Adicionar tarefa"><Icon name="plus" size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cards.map(t => (
                    <KanbanCard key={t.id} t={t} prioTag={prioTag} dragging={dragId === t.id} onOpen={() => setEditId(t.id)}
                      onDragStart={() => setDragId(t.id)} onDragEnd={() => { setDragId(null); setOverCol(null); }} />
                  ))}
                  {cards.length === 0 && <div style={{ textAlign: 'center', padding: '18px 8px', color: 'var(--text-3)', fontSize: 12.5, fontWeight: 600, border: '1px dashed var(--border-2)', borderRadius: 'var(--r-sm)' }}>Larga aqui</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Tarefa</th><th>Fase</th><th>Estado</th><th>Prioridade</th><th>Responsável</th><th>Prazo</th><th>Checklist</th></tr></thead>
            <tbody>
              {tasks.filter(passes).map(t => {
                const col = KANBAN.cols.find(c => c.id === t.col);
                return (
                  <tr key={t.id} className="row-click" onClick={() => setEditId(t.id)}>
                    <td style={{ maxWidth: 280 }}><div style={{ fontWeight: 700 }}>{t.title}</div></td>
                    <td className="muted" style={{ fontWeight: 600 }}>{t.phase}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: col.accent }}></span>{col.name}</span></td>
                    <td><Badge tag={prioTag[t.prio]}>{t.prio}</Badge></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar p={t.assignee} size={28} /><span style={{ fontWeight: 600, fontSize: 13 }}>{t.assignee.name.split(' ')[0]}</span></div></td>
                    <td className={t.overdue ? '' : 'muted'} style={{ fontWeight: 700, color: t.overdue ? 'var(--danger)' : undefined }}>{fmtDue(t.due)}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{t.checklist[0]}/{t.checklist[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NovaTarefaModal open={!!nt} col={nt} onClose={() => setNt(null)} onCreate={addTask} />
      <TaskEditModal task={editTask} onClose={() => setEditId(null)}
        onSave={(patch) => { updateTask(editId, patch); setEditId(null); if (window.PYToast) window.PYToast('Tarefa atualizada'); }}
        onAddNote={(text) => updateTask(editId, { notes: [...(editTask.notes || []), { who: ME, text, time: 'agora' }] })} />
    </div>
  );
}

function KanbanCard({ t, prioTag, dragging, onDragStart, onDragEnd, onOpen }) {
  const pct = Math.round(t.checklist[0] / t.checklist[1] * 100);
  return (
    <div className="card card-pad rise" draggable
      onClick={onOpen}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.id); onDragStart(); }}
      onDragEnd={onDragEnd}
      style={{ padding: 14, cursor: 'grab', boxShadow: 'var(--sh-sm)', opacity: dragging ? 0.4 : 1, transition: 'opacity .12s' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <Badge tag={prioTag[t.prio]}>{t.prio}</Badge>
        {t.tags.map((tg, i) => <Badge key={i} tag="b-violet" dot={false}>{tg}</Badge>)}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, marginBottom: 12 }}>{t.title}</div>

      {t.checklist[1] > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11.5, fontWeight: 600 }}>
            <span className="muted-3"><Icon name="checkSquare" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />Checklist</span>
            <span className="num muted">{t.checklist[0]}/{t.checklist[1]}</span>
          </div>
          <Progress value={pct} thin />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-3)', fontSize: 12.5, fontWeight: 600 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.overdue ? 'var(--danger)' : 'var(--text-3)' }}>
          <Icon name="clock" size={14} />{fmtDue(t.due)}
        </span>
        {t.comments > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="message" size={14} />{t.comments}</span>}
        {t.attach > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="paperclip" size={14} />{t.attach}</span>}
        {t.notes && t.notes.length > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Notas"><Icon name="fileText" size={14} />{t.notes.length}</span>}
        <span style={{ marginLeft: 'auto' }}><Avatar p={t.assignee} size={28} /></span>
      </div>
    </div>
  );
}

function FilterChip({ icon, label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => o.value === value);
  return (
    <div style={{ position: 'relative' }}>
      <button className={'chip' + (value ? ' active' : '')} onClick={() => setOpen(o => !o)}>
        <Icon name={icon} size={14} /> {sel ? sel.label.split(' ')[0] : label}
        {value
          ? <span onClick={(e) => { e.stopPropagation(); onChange(''); }} style={{ display: 'inline-grid', marginLeft: 1 }}><Icon name="x" size={13} /></span>
          : <Icon name="chevD" size={13} />}
      </button>
      {open && (
        <React.Fragment>
          <div className="flt-backdrop" onClick={() => setOpen(false)}></div>
          <div className="flt-pop">
            <button className={'flt-opt' + (!value ? ' on' : '')} onClick={() => { onChange(''); setOpen(false); }}>Todos</button>
            {options.map(o => <button key={o.value} className={'flt-opt' + (value === o.value ? ' on' : '')} onClick={() => { onChange(o.value); setOpen(false); }}>{o.label}</button>)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function NovaTarefaModal({ open, col, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [prio, setPrio] = useState('Média');
  const [phase, setPhase] = useState('Projeto de Execução');
  const [who, setWho] = useState('ana');
  const [due, setDue] = useState('');
  useEffect(() => { if (open) { setTitle(''); setPrio('Média'); setPhase('Projeto de Execução'); setWho('ana'); setDue(''); } }, [open]);
  const submit = () => { onCreate({ col: col || 'todo', title, prio, phase, due, assignee: PEOPLE[who] }); onClose(); };
  const colName = col ? (KANBAN.cols.find(c => c.id === col) || {}).name : '';
  return (
    <Modal open={open} onClose={onClose} title="Nova tarefa" sub={colName ? 'Na coluna “' + colName + '”' : ''} width={520}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit}><Icon name="plus" size={15} /> Criar tarefa</button>
      </React.Fragment>}>
      <Field label="Título"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Pormenores construtivos — cobertura" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Prioridade" half><SelectInput value={prio} onChange={(e) => setPrio(e.target.value)}>{LK_PRIORIDADES.map(p => <option key={p}>{p}</option>)}</SelectInput></Field>
        <Field label="Prazo" half><TextInput type="date" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Fase" half><SelectInput value={phase} onChange={(e) => setPhase(e.target.value)}>{LK_FASES.map(p => <option key={p}>{p}</option>)}</SelectInput></Field>
        <Field label="Responsável" half><SelectInput value={who} onChange={(e) => setWho(e.target.value)}>{Object.keys(PEOPLE).map(k => <option key={k} value={k}>{PEOPLE[k].name}</option>)}</SelectInput></Field>
      </div>
    </Modal>
  );
}

function TaskEditModal({ task, onClose, onSave, onAddNote }) {
  const [title, setTitle] = useState('');
  const [prio, setPrio] = useState('Média');
  const [phase, setPhase] = useState('');
  const [who, setWho] = useState('ana');
  const [due, setDue] = useState('');
  const [col, setCol] = useState('todo');
  const [note, setNote] = useState('');
  useEffect(() => {
    if (task) {
      setTitle(task.title); setPrio(task.prio); setPhase(task.phase);
      setWho(Object.keys(PEOPLE).find(k => PEOPLE[k] === task.assignee) || 'ana');
      setDue(task.due); setCol(task.col); setNote('');
    }
  }, [task]);
  if (!task) return null;
  const notes = task.notes || [];
  const addNote = () => { if (note.trim()) { onAddNote(note.trim()); setNote(''); } };
  return (
    <Modal open={!!task} onClose={onClose} title="Editar tarefa" sub={KANBAN.cols.find(c => c.id === task.col)?.name} width={560}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => onSave({ title, prio, phase, due, col, assignee: PEOPLE[who] })}><Icon name="check" size={15} /> Guardar</button>
      </React.Fragment>}>
      <Field label="Título"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Estado" half><SelectInput value={col} onChange={(e) => setCol(e.target.value)}>{KANBAN.cols.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</SelectInput></Field>
        <Field label="Prioridade" half><SelectInput value={prio} onChange={(e) => setPrio(e.target.value)}>{['Alta', 'Média', 'Baixa'].map(p => <option key={p}>{p}</option>)}</SelectInput></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Fase" half><SelectInput value={phase} onChange={(e) => setPhase(e.target.value)}>{[...new Set([...LK_FASES, phase])].map(p => <option key={p}>{p}</option>)}</SelectInput></Field>
        <Field label="Responsável" half><SelectInput value={who} onChange={(e) => setWho(e.target.value)}>{Object.keys(PEOPLE).map(k => <option key={k} value={k}>{PEOPLE[k].name}</option>)}</SelectInput></Field>
      </div>
      <Field label="Prazo"><TextInput type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(due) ? due : ''} onChange={(e) => setDue(e.target.value)} /></Field>

      <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0 0', paddingTop: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="fileText" size={16} /> Notas {notes.length > 0 && <span className="badge b-gray" style={{ fontSize: 10.5 }}>{notes.length}</span>}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {notes.length === 0 && <div className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>Ainda sem notas. Adiciona a primeira abaixo.</div>}
          {notes.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <Avatar p={n.who} size={30} />
              <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '9px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 12.5 }}>{n.who.name}</span>
                  <span className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500, marginTop: 2, lineHeight: 1.5 }}>{n.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="fld__box" style={{ alignItems: 'flex-end', padding: '0 12px' }}>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Escreve uma nota…" onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(); }}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none', padding: '11px 0', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--text)' }} />
          <button className="btn btn-soft btn-sm" style={{ marginBottom: 9 }} onClick={addNote} disabled={!note.trim()}><Icon name="plus" size={14} /> Nota</button>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { Tasks });