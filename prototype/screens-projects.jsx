/* ProjectYard — Projects list + detail */

function Projects({ go }) {
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('Todos');
  const [fHealth, setFHealth] = useState('');
  const [fPm, setFPm] = useState('');
  const [fltOpen, setFltOpen] = useState(false);
  const filters = ['Todos', 'Em curso', 'Em risco', 'Proposta', 'Concluído'];
  const total = PROJECTS.length;
  const emCurso = PROJECTS.filter(p => p.status === 'Em curso').length;
  const emRisco = PROJECTS.filter(p => p.status === 'Em risco').length;
  const healthOpts = [{ v: 'green', l: 'Saudável' }, { v: 'amber', l: 'Atenção' }, { v: 'red', l: 'Crítico' }];
  const pmList = [];
  PROJECTS.forEach(p => { const k = Object.keys(PEOPLE).find(x => PEOPLE[x] === p.pm); if (k && !pmList.find(o => o.k === k)) pmList.push({ k, name: p.pm.name }); });
  const list = PROJECTS.filter(p => (filter === 'Todos' || p.status === filter) && (!fHealth || p.health === fHealth) && (!fPm || p.pm === PEOPLE[fPm]));
  const extraN = (fHealth ? 1 : 0) + (fPm ? 1 : 0);

  return (
    <div className="content">
      <PageHead
        title="Projetos"
        sub={`${total} projetos · ${emCurso} em curso · ${emRisco} em risco`}
        actions={<button className="btn btn-primary" onClick={() => window.PYNewProject && window.PYNewProject()}><Icon name="plus" size={17} /> Novo projeto</button>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {filters.map(f => (
            <button key={f} className={'chip' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <button className={'chip' + (extraN ? ' active' : '')} onClick={() => setFltOpen(o => !o)}><Icon name="filter" size={15} /> Filtros{extraN ? ' · ' + extraN : ''}</button>
            {fltOpen && (
              <React.Fragment>
                <div className="flt-backdrop" onClick={() => setFltOpen(false)}></div>
                <div className="flt-pop" style={{ left: 'auto', right: 0, minWidth: 208 }}>
                  <div className="ws-menu__lbl">Saúde</div>
                  <button className={'flt-opt' + (!fHealth ? ' on' : '')} onClick={() => setFHealth('')}>Todas</button>
                  {healthOpts.map(o => <button key={o.v} className={'flt-opt' + (fHealth === o.v ? ' on' : '')} onClick={() => setFHealth(o.v)}><span className={'health-dot h-' + o.v} style={{ marginRight: 8, verticalAlign: 'middle' }}></span>{o.l}</button>)}
                  <div className="divider" style={{ margin: '6px 0' }}></div>
                  <div className="ws-menu__lbl">Gestor</div>
                  <button className={'flt-opt' + (!fPm ? ' on' : '')} onClick={() => setFPm('')}>Todos</button>
                  {pmList.map(o => <button key={o.k} className={'flt-opt' + (fPm === o.k ? ' on' : '')} onClick={() => setFPm(o.k)}>{o.name}</button>)}
                  {extraN > 0 && <React.Fragment><div className="divider" style={{ margin: '6px 0' }}></div><button className="flt-opt" style={{ color: 'var(--danger)' }} onClick={() => { setFHealth(''); setFPm(''); setFltOpen(false); }}>Limpar filtros</button></React.Fragment>}
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="seg">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Icon name="grid" size={15} /></button>
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><Icon name="dots" size={15} /></button>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card"><div className="empty" style={{ padding: '56px 20px' }}><Icon name="building" size={32} /><div style={{ marginTop: 10, fontWeight: 700, fontSize: 15, color: 'var(--text-2)' }}>Sem projetos</div><div style={{ marginTop: 4 }}>Nenhum projeto corresponde aos filtros atuais.</div><button className="btn btn-soft btn-sm" style={{ marginTop: 14 }} onClick={() => { setFilter('Todos'); setFHealth(''); setFPm(''); }}>Limpar filtros</button></div></div>
      ) : view === 'grid' ? (
        <div className="grid cols-3">
          {list.map(p => <ProjectCard key={p.id} p={p} go={go} />)}
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Projeto</th><th>Cliente</th><th>Estado</th><th>Progresso</th><th>Contrato</th><th>Prazo</th><th>Equipa</th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} className="row-click" onClick={() => go('project', p)}>
                  <td><div style={{ fontWeight: 700 }}>{p.name}</div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.code}</div></td>
                  <td className="muted">{p.client}</td>
                  <td><Badge tag={p.tag}>{p.status}</Badge></td>
                  <td style={{ width: 140 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Progress value={p.progress} thin /><span className="num" style={{ fontSize: 12.5, fontWeight: 700 }}>{p.progress}%</span></div></td>
                  <td className="num" style={{ fontWeight: 700 }}>{eur(p.contract)}</td>
                  <td className="muted" style={{ fontWeight: 600 }}>{p.end}</td>
                  <td><AvStack people={p.team} max={3} size={28} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ p, go }) {
  const [menu, setMenu] = useState(false);
  const healthLabel = p.health === 'green' ? 'Saudável' : p.health === 'amber' ? 'Atenção' : 'Crítico';
  const healthColor = p.health === 'green' ? 'var(--success)' : p.health === 'amber' ? '#b9791a' : 'var(--danger)';
  const act = (e, fn) => { e.stopPropagation(); setMenu(false); fn(); };
  return (
    <div className="card card-pad rise" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16 }} onClick={() => go('project', p)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name="building" size={23} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Badge tag={p.tag} dot={false}>{p.status}</Badge>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginTop: 8, lineHeight: 1.3 }}>{p.name}</div>
          <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.code} · {p.client}</div>
        </div>
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn" style={{ width: 34, height: 34, border: 'none' }} onClick={() => setMenu(o => !o)} title="Mais ações"><Icon name="more" size={18} /></button>
          {menu && (
            <React.Fragment>
              <div className="flt-backdrop" onClick={(e) => { e.stopPropagation(); setMenu(false); }}></div>
              <div className="flt-pop" style={{ left: 'auto', right: 0, top: 40, minWidth: 176 }}>
                <button className="flt-opt" onClick={(e) => act(e, () => go('project', p))}>Abrir projeto</button>
                <button className="flt-opt" onClick={(e) => act(e, () => window.PYToast && window.PYToast('Editar · ' + p.code))}>Editar</button>
                <button className="flt-opt" onClick={(e) => act(e, () => window.PYToast && window.PYToast('Projeto duplicado'))}>Duplicar</button>
                <div className="divider" style={{ margin: '6px 0' }}></div>
                <button className="flt-opt" style={{ color: 'var(--danger)' }} onClick={(e) => act(e, () => window.PYToast && window.PYToast('Projeto arquivado · ' + p.code))}>Arquivar</button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
          <span className="muted" style={{ fontWeight: 600 }}>Progresso · {p.phase}</span>
          <span className="num" style={{ fontWeight: 700 }}>{p.progress}%</span>
        </div>
        <Progress value={p.progress} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <MiniStat icon="checkSquare" v={p.openTasks} l="tarefas" warn={p.overdue > 0 ? p.overdue + ' atraso' : null} />
        <MiniStat icon="layers" v={p.deliverables} l="entregáveis" />
        <MiniStat icon="shield" v={p.approvals} l="aprovações" />
      </div>

      <div className="divider" style={{ margin: '2px 0' }}></div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12.5, color: healthColor }}>
            <span className={'health-dot h-' + p.health}></span>{healthLabel}
          </span>
          <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>· {p.end}</span>
        </div>
        <AvStack people={p.team} max={3} size={28} />
      </div>
    </div>
  );
}

function MiniStat({ icon, v, l, warn }) {
  return (
    <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '9px 11px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-3)' }}><Icon name={icon} size={14} /><span className="num" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{v}</span></div>
      <div className="muted-3" style={{ fontSize: 11, fontWeight: 600, marginTop: 1 }}>{warn ? <span style={{ color: 'var(--danger)' }}>{warn}</span> : l}</div>
    </div>
  );
}

/* ---------------- Project detail ---------------- */
function ProjectDetail({ p, go }) {
  const [tab, setTab] = useState('Visão geral');
  const [addTask, setAddTask] = useState(false);
  const [members, setMembers] = useState(false);
  const tabs = ['Visão geral', 'Fases', 'Tarefas', 'Entregáveis', 'Financeiro', 'Equipa'];
  if (!p) p = PROJECTS[0];

  const phases = projectPhases(p);
  const concluded = phases.filter(ph => ph.pct === 100).length;
  const myTasks = KANBAN.tasks.filter(t => t.pid === p.code);
  const myDelivs = DELIVERABLES.filter(d => d.code === p.code);
  const myInvoices = INVOICES.filter(i => i.code === p.code);
  const myMilestones = MILESTONES.filter(m => m.code === p.code);
  const myRisks = RISKS.filter(r => r.code === p.code);
  const riskSev = (r) => { const s = r.prob * r.impact; return s >= 15 ? { sev: 'Alto', tag: 'b-red' } : s >= 8 ? { sev: 'Médio', tag: 'b-amber' } : { sev: 'Baixo', tag: 'b-gray' }; };

  return (
    <div className="content">
      <PageHead
        crumb={['Projetos', p.code]}
        title={p.name}
        sub={`${p.client} · ${p.type}`}
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => go('projects')}><Icon name="chevL" size={16} /> Voltar</button>
          <button className="btn btn-ghost" onClick={() => setMembers(true)}><Icon name="users" size={16} /> Membros</button>
          <button className="btn btn-primary" onClick={() => setAddTask(true)}><Icon name="plus" size={16} /> Adicionar tarefa</button>
        </React.Fragment>}
      />

      {/* Summary band */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Ring value={p.progress} size={84} stroke={9} />
          <div>
            <div className="muted-3" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fase atual</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 3 }}>{p.phase}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12.5, marginTop: 6, color: p.health === 'green' ? 'var(--success)' : p.health === 'amber' ? '#b9791a' : 'var(--danger)' }}>
              <span className={'health-dot h-' + p.health}></span>{p.health === 'green' ? 'Saudável' : p.health === 'amber' ? 'Atenção' : 'Crítico'}
            </span>
          </div>
        </div>
        <SummaryCell icon="euro" label="Contrato" value={eur(p.contract)} foot={`Orçamento ${eur(p.budget)}`} />
        <SummaryCell icon="gauge" label="Custo incorrido" value={eur(p.spent)} foot={`${Math.round(p.spent / p.budget * 100)}% do orçamento`} barPct={Math.round(p.spent / p.budget * 100)} />
        <SummaryCell icon="calendar" label="Prazo" value={p.end} foot={`Início ${p.start}`} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 22, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            border: 'none', background: 'transparent', padding: '12px 16px', fontWeight: 700, fontSize: 14,
            color: tab === t ? 'var(--primary-700)' : 'var(--text-2)', borderBottom: '2px solid ' + (tab === t ? 'var(--primary)' : 'transparent'),
            marginBottom: -1, whiteSpace: 'nowrap'
          }}>{t}</button>
        ))}
      </div>

      {tab === 'Visão geral' ? (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
          <div className="grid" style={{ gap: 20 }}>
            <div className="card card-pad">
              <div className="card-h"><div><h3>Fases do projeto</h3><span className="sub">{phases.length} fases · {concluded} concluída{concluded === 1 ? '' : 's'}</span></div></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {phases.map((ph, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', flexShrink: 0, background: ph.pct === 100 ? 'var(--success-soft)' : ph.pct > 0 ? 'var(--primary-soft)' : 'var(--surface-3)', color: ph.pct === 100 ? 'var(--success)' : ph.pct > 0 ? 'var(--primary)' : 'var(--text-3)' }}>
                      {ph.pct === 100 ? <Icon name="check" size={16} /> : <span className="num" style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{ph.name}</span>
                        <Badge tag={ph.tag} dot={false}>{ph.status}</Badge>
                      </div>
                      <Progress value={ph.pct} thin />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-pad">
              <div className="card-h"><div><h3>Próximos entregáveis</h3></div>{myDelivs.length > 0 && <button className="btn btn-soft btn-sm card-h more" onClick={() => setTab('Entregáveis')}>Ver todos</button>}</div>
              {myDelivs.length > 0 ? (
                <table className="tbl">
                  <tbody>
                    {myDelivs.slice(0, 4).map(d => (
                      <tr key={d.id}>
                        <td style={{ paddingLeft: 0 }}><div style={{ fontWeight: 700 }}>{d.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{d.phase} · {d.version}</div></td>
                        <td><Badge tag={d.statusTag}>{d.status}</Badge></td>
                        <td className="muted" style={{ fontWeight: 600, paddingRight: 0, textAlign: 'right' }}>{d.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div className="empty" style={{ padding: '24px 0' }}><Icon name="layers" size={26} /><div style={{ marginTop: 8, fontWeight: 600 }}>Sem entregáveis registados</div></div>}
            </div>
          </div>

          <div className="grid" style={{ gap: 20 }}>
            <div className="card card-pad">
              <div className="card-h"><div><h3>Gestor & equipa</h3></div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                <Avatar p={p.pm} size={44} />
                <div><div style={{ fontWeight: 700 }}>{p.pm.name}</div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.pm.role}</div></div>
                <span className="badge b-violet" style={{ marginLeft: 'auto' }}>Gestor</span>
              </div>
              <div className="divider"></div>
              {p.team.filter(m => m !== p.pm).map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <Avatar p={m} size={36} />
                  <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{m.role}</div></div>
                </div>
              ))}
            </div>

            <div className="card card-pad">
              <div className="card-h"><div><h3>Riscos abertos</h3></div>{myRisks.filter(r => r.status === 'Aberto').length > 0 && <span className="badge b-red card-h more">{myRisks.filter(r => r.status === 'Aberto').length}</span>}</div>
              {myRisks.filter(r => r.status === 'Aberto').length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {myRisks.filter(r => r.status === 'Aberto').slice(0, 3).map(r => { const sv = riskSev(r); return <RiskRow key={r.id} sev={sv.sev} tag={sv.tag} title={r.title} />; })}
                </div>
              ) : <div className="empty"><Icon name="shield" size={28} /><div style={{ marginTop: 8, fontWeight: 600 }}>Sem riscos abertos</div></div>}
            </div>
          </div>
        </div>
      ) : tab === 'Fases' ? (
        <div className="card card-pad">
          <div className="card-h"><div><h3>Fases do projeto</h3><span className="sub">{phases.length} fases · {concluded} concluída{concluded === 1 ? '' : 's'}</span></div><button className="btn btn-soft btn-sm card-h more" onClick={() => go('gantt')}>Abrir cronograma <Icon name="arrowRight" size={14} /></button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {phases.map((ph, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0, background: ph.pct === 100 ? 'var(--success-soft)' : ph.pct > 0 ? 'var(--primary-soft)' : 'var(--surface-3)', color: ph.pct === 100 ? 'var(--success)' : ph.pct > 0 ? 'var(--primary)' : 'var(--text-3)' }}>
                  {ph.pct === 100 ? <Icon name="check" size={17} /> : <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{ph.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="num muted-3" style={{ fontSize: 12.5, fontWeight: 700 }}>{ph.pct}%</span><Badge tag={ph.tag} dot={false}>{ph.status}</Badge></div>
                  </div>
                  <Progress value={ph.pct} thin />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'Tarefas' ? (
        (() => {
          const prioTag = { 'Alta': 'b-red', 'Média': 'b-amber', 'Baixa': 'b-gray' };
          return (
            <div className="card card-pad">
              <div className="card-h"><div><h3>Tarefas</h3><span className="sub">{myTasks.length} tarefas</span></div><div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}><button className="btn btn-soft btn-sm" onClick={() => setAddTask(true)}><Icon name="plus" size={14} /> Adicionar</button>{p.code === 'PY-118' && <button className="btn btn-soft btn-sm" onClick={() => go('tasks')}>Abrir Kanban <Icon name="arrowRight" size={14} /></button>}</div></div>
              {myTasks.length > 0 ? (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, alignItems: 'start' }}>
                  {KANBAN.cols.map(c => {
                    const col = myTasks.filter(t => t.col === c.id);
                    return (
                      <div key={c.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: c.accent }}></span><span style={{ fontWeight: 700, fontSize: 12.5 }}>{c.name}</span><span className="num muted-3" style={{ fontSize: 12, fontWeight: 700 }}>{col.length}</span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {col.map(t => (
                            <div key={t.id} className="card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.35 }}>{t.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Badge tag={prioTag[t.prio]} dot={false}>{t.prio}</Badge>
                                <span className="num muted-3" style={{ fontSize: 11.5, fontWeight: 700, color: t.overdue ? 'var(--danger)' : 'var(--text-3)' }}>{t.due}</span>
                                <div style={{ marginLeft: 'auto' }}><Avatar p={t.assignee} size={22} /></div>
                              </div>
                            </div>
                          ))}
                          {col.length === 0 && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, padding: '6px 2px' }}>—</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="empty" style={{ padding: '48px 0' }}><Icon name="checkSquare" size={30} /><div style={{ marginTop: 10, fontWeight: 700, color: 'var(--text-2)' }}>Sem tarefas</div><div style={{ marginTop: 4 }}>{p.status === 'Concluído' ? 'Projeto concluído — sem tarefas em aberto.' : 'Adicione a primeira tarefa deste projeto.'}</div>{p.status !== 'Concluído' && <button className="btn btn-soft btn-sm" style={{ marginTop: 14 }} onClick={() => setAddTask(true)}><Icon name="plus" size={14} /> Adicionar tarefa</button>}</div>}
            </div>
          );
        })()
      ) : tab === 'Entregáveis' ? (
        <div className="card">
          <div className="card-pad card-h" style={{ paddingBottom: 0 }}><div><h3>Entregáveis</h3><span className="sub">{myDelivs.length} entregáveis</span></div></div>
          {myDelivs.length > 0 ? (
            <table className="tbl">
              <thead><tr><th>Entregável</th><th>Fase</th><th>Versão</th><th>Estado</th><th>Responsável</th><th>Prazo</th></tr></thead>
              <tbody>
                {myDelivs.map(d => (
                  <tr key={d.id}>
                    <td><div style={{ fontWeight: 700 }}>{d.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{d.type}{d.required ? ' · obrigatório' : ''}</div></td>
                    <td className="muted">{d.phase}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{d.version}</td>
                    <td><Badge tag={d.statusTag}>{d.status}</Badge></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar p={d.owner} size={26} /><span style={{ fontWeight: 600, fontSize: 13 }}>{d.owner.name}</span></div></td>
                    <td className="muted" style={{ fontWeight: 600 }}>{d.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty" style={{ padding: '48px 0' }}><Icon name="layers" size={30} /><div style={{ marginTop: 10, fontWeight: 700, color: 'var(--text-2)' }}>Sem entregáveis</div></div>}
        </div>
      ) : tab === 'Financeiro' ? (
        (() => {
          const faturado = myInvoices.reduce((s, i) => s + i.amount, 0);
          const recebido = myInvoices.filter(i => i.status === 'Pago').reduce((s, i) => s + i.amount, 0);
          const margem = p.contract - p.spent;
          const margemPct = p.contract ? Math.round(margem / p.contract * 100) : 0;
          return (
            <div className="grid" style={{ gap: 20 }}>
              <div className="grid cols-4">
                <SummaryCell icon="euro" label="Contrato" value={eur(p.contract)} foot={`Orçamento ${eur(p.budget)}`} />
                <SummaryCell icon="gauge" label="Custo incorrido" value={eur(p.spent)} foot={`${p.budget ? Math.round(p.spent / p.budget * 100) : 0}% do orçamento`} barPct={p.budget ? Math.round(p.spent / p.budget * 100) : 0} />
                <SummaryCell icon="trend" label="Margem prevista" value={eur(margem)} foot={`${margemPct}% do contrato`} />
                <SummaryCell icon="euro" label="Faturado" value={eur(faturado)} foot={`Recebido ${eur(recebido)}`} />
              </div>
              <div className="card">
                <div className="card-pad card-h" style={{ paddingBottom: 0 }}><div><h3>Faturas</h3><span className="sub">{myInvoices.length} faturas</span></div><button className="btn btn-soft btn-sm card-h more" onClick={() => go('payments')}>Abrir financeiro <Icon name="arrowRight" size={14} /></button></div>
                {myInvoices.length > 0 ? (
                  <table className="tbl">
                    <thead><tr><th>Nº</th><th>Milestone</th><th>Valor</th><th>Estado</th><th>Emitida</th><th>Vencimento</th></tr></thead>
                    <tbody>
                      {myInvoices.map(i => (
                        <tr key={i.num}>
                          <td className="num" style={{ fontWeight: 700 }}>{i.num}</td>
                          <td className="muted">{i.milestone}</td>
                          <td className="num" style={{ fontWeight: 700 }}>{eur(i.amount)}</td>
                          <td><Badge tag={i.tag}>{i.status}</Badge></td>
                          <td className="muted" style={{ fontWeight: 600 }}>{i.issued}</td>
                          <td className="muted" style={{ fontWeight: 600 }}>{i.due}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="empty" style={{ padding: '40px 0' }}><Icon name="euro" size={28} /><div style={{ marginTop: 8, fontWeight: 600 }}>Sem faturas emitidas</div></div>}
              </div>
              {myMilestones.length > 0 && (
                <div className="card card-pad">
                  <div className="card-h"><div><h3>Milestones de faturação</h3></div></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {myMilestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 11, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{m.trigger} · {m.pct}% do contrato</div></div>
                        <span className="num" style={{ fontWeight: 700, fontSize: 13.5 }}>{eur(m.amount)}</span>
                        <Badge tag={m.tag} dot={false}>{m.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="card card-pad">
          <div className="card-h"><div><h3>Equipa do projeto</h3><span className="sub">{p.team.length} membros</span></div><button className="btn btn-soft btn-sm card-h more" onClick={() => setMembers(true)}><Icon name="users" size={14} /> Gerir membros</button></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {p.team.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 0', borderBottom: i < p.team.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <Avatar p={m} size={42} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{m.name}</div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{m.role}</div></div>
                {m === p.pm && <span className="badge b-violet">Gestor</span>}
                {m.rate && <span className="num muted-3" style={{ fontSize: 12.5, fontWeight: 700, minWidth: 70, textAlign: 'right' }}>{eur(m.rate)}/h</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectAddTaskModal open={addTask} onClose={() => setAddTask(false)} project={p} phases={phases} go={go} />
      <ProjectMembersModal open={members} onClose={() => setMembers(false)} project={p} />
    </div>
  );
}

function ProjectAddTaskModal({ open, onClose, project, phases, go }) {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('');
  const [prio, setPrio] = useState('Média');
  const [who, setWho] = useState('');
  const [due, setDue] = useState('');
  useEffect(() => { if (open) { setTitle(''); setPhase((phases && phases[2] && phases[2].name) || 'Licenciamento'); setPrio('Média'); setWho(project.pm.name); setDue(''); } }, [open, project, phases]);
  const submit = () => { onClose(); if (window.PYToast) window.PYToast('Tarefa adicionada · ' + project.code + (title ? ' — ' + title : '')); };
  return (
    <Modal open={open} onClose={onClose} title="Adicionar tarefa" sub={project.name} width={520}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-soft" onClick={() => { onClose(); go('tasks'); }}>Abrir Kanban <Icon name="arrowRight" size={14} /></button>
        <button className="btn btn-primary" onClick={submit}><Icon name="plus" size={15} /> Adicionar</button>
      </React.Fragment>}>
      <Field label="Título da tarefa"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Compatibilização de especialidades" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Fase" half><SelectInput value={phase} onChange={(e) => setPhase(e.target.value)}>
          {(phases || []).map(ph => <option key={ph.name}>{ph.name}</option>)}
        </SelectInput></Field>
        <Field label="Prioridade" half><SelectInput value={prio} onChange={(e) => setPrio(e.target.value)}>
          {['Alta', 'Média', 'Baixa'].map(o => <option key={o}>{o}</option>)}
        </SelectInput></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Responsável" half><SelectInput value={who} onChange={(e) => setWho(e.target.value)}>
          {project.team.map(m => <option key={m.initials}>{m.name}</option>)}
        </SelectInput></Field>
        <Field label="Prazo" half><TextInput value={due} onChange={(e) => setDue(e.target.value)} placeholder="Ex.: 24 Jun" /></Field>
      </div>
    </Modal>
  );
}

function ProjectMembersModal({ open, onClose, project }) {
  const [invite, setInvite] = useState('');
  useEffect(() => { if (open) setInvite(''); }, [open]);
  if (!open) return null;
  const naoMembros = Object.values(PEOPLE).filter(p => !project.team.includes(p));
  return (
    <Modal open={open} onClose={onClose} title="Membros do projeto" sub={project.name + ' · ' + project.team.length + ' membros'} width={500}
      footer={<button className="btn btn-primary" onClick={onClose}><Icon name="check" size={15} /> Concluir</button>}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {project.team.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < project.team.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <Avatar p={m} size={38} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{m.role}</div></div>
            {m === project.pm ? <span className="badge b-violet">Gestor</span> : <button className="icon-btn" style={{ width: 32, height: 32, border: 'none', color: 'var(--text-3)' }} title="Remover" onClick={() => window.PYToast && window.PYToast(m.name + ' removido do projeto')}><Icon name="x" size={15} /></button>}
          </div>
        ))}
      </div>
      <div className="divider" style={{ margin: '14px 0' }}></div>
      <Field label="Convidar membro">
        <div style={{ display: 'flex', gap: 10 }}>
          <SelectInput value={invite} onChange={(e) => setInvite(e.target.value)}>
            <option value="" disabled>Selecionar pessoa…</option>
            {naoMembros.map(p => <option key={p.initials}>{p.name}</option>)}
          </SelectInput>
          <button className="btn btn-primary" disabled={!invite} onClick={() => { if (window.PYToast) window.PYToast(invite + ' adicionado ao projeto'); onClose(); }}><Icon name="plus" size={15} /> Adicionar</button>
        </div>
      </Field>
    </Modal>
  );
}

function SummaryCell({ icon, label, value, foot, barPct }) {
  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', marginBottom: 12 }}>
        <Icon name={icon} size={17} /><span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div className="num" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
      {barPct != null && <div style={{ margin: '10px 0 6px' }}><Progress value={barPct} thin color={barPct > 90 ? 'var(--danger)' : 'var(--grad)'} /></div>}
      <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: barPct != null ? 0 : 6 }}>{foot}</div>
    </div>
  );
}

function RiskRow({ sev, tag, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 11, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
      <div style={{ color: tag === 'b-red' ? 'var(--danger)' : 'var(--warning)' }}><Icon name="alert" size={18} /></div>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{title}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>Severidade {sev}</div></div>
      <Badge tag={tag} dot={false}>{sev}</Badge>
    </div>
  );
}

Object.assign(window, { Projects, ProjectDetail });
