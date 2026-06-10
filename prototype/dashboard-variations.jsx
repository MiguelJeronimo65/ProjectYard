/* ProjectYard — 3 Dashboard layout variations for the design canvas */

/* ---- Shared mini app-shell frame (icon rail + topbar) ---- */
function DashFrame({ active = 'grid', title, sub, actions, children }) {
  const icons = ['grid', 'folder', 'checkSquare', 'layers', 'card', 'shield'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '74px 1fr', height: '100%', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* rail */}
      <div style={{ background: '#1b2530', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 8 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, overflow: 'hidden', background: '#fff', marginBottom: 14, boxShadow: '0 4px 12px rgba(0,0,0,.25)' }}>
          <img src="assets/projectyard-icon.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {icons.map((ic, i) => (
          <div key={i} style={{
            width: 46, height: 46, borderRadius: 12, display: 'grid', placeItems: 'center',
            color: ic === active ? 'var(--navy-700)' : '#8a96a3',
            background: ic === active ? 'var(--grad-gold)' : 'transparent',
          }}><Icon name={ic} size={21} /></div>
        ))}
        <div style={{ marginTop: 'auto', width: 38, height: 38, borderRadius: 99, background: '#6a5af9', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>AM</div>
      </div>
      {/* main */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 64, borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', padding: '0 26px', gap: 16 }}>
          <div className="search" style={{ width: 280 }}><Icon name="search" size={17} /><input placeholder="Procurar…" readOnly /></div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, alignItems: 'center' }}>
            <button className="icon-btn"><Icon name="bell" size={18} /><span className="dot"></span></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 6 }}>
              <Avatar p={ME} size={34} />
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{ME.name}</div><div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{ME.role}</div></div>
            </div>
          </div>
        </div>
        <div style={{ padding: '24px 26px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 22 }}>
            <div>
              <h1 className="display" style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
              <p className="muted" style={{ margin: '3px 0 0', fontSize: 13.5 }}>{sub}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>{actions}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VARIATION A — Executive / KPI-first (analytics-heavy)
   ============================================================ */
function DashA() {
  return (
    <DashFrame
      title="Bom dia, Ana 👋"
      sub="Visão executiva · desempenho de entrega e financeiro"
      actions={<React.Fragment>
        <button className="btn btn-ghost btn-sm"><Icon name="calendar" size={15} /> Jun 2026</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} /> Novo projeto</button>
      </React.Fragment>}
    >
      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <Stat icon="folder" iconBg="var(--primary-soft)" iconColor="var(--primary)" value="24" label="Projetos ativos" trend="+3" foot="2 a iniciar" />
        <Stat icon="euro" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value="€840k" label="Faturado (ano)" trend="+18%" foot="42 faturas" />
        <Stat icon="check" iconBg="var(--success-soft)" iconColor="var(--success)" value="€697k" label="Recebido" foot="83% cobrado" />
        <Stat icon="clock" iconBg="var(--warning-soft)" iconColor="var(--warning)" value="€143k" label="A receber" trend="1 vencida" trendDir="down" foot="€12,9k vencido" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr', marginBottom: 18, alignItems: 'stretch' }}>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Faturação mensal</h3><span className="sub">Recebido vs. faturado · 2026</span></div>
            <div className="card-h more seg"><button>Trim.</button><button className="active">Ano</button></div></div>
          <div style={{ display: 'flex', gap: 26, alignItems: 'flex-end' }}>
            <div><div className="num" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>€512.300</div>
              <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>últimos 8 meses</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                <Lg color="var(--accent)" t="Recebido" /><Lg color="var(--accent-soft2)" t="Em aberto" /></div></div>
            <div style={{ flex: 1 }}><BarChart data={REVENUE} height={140} /></div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Estado da faturação</h3></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Donut segments={[{ v: 83, color: 'var(--success)' }, { v: 12, color: 'var(--warning)' }, { v: 5, color: 'var(--danger)' }]} size={118} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Lg2 color="var(--success)" t="Pago" v="83%" /><Lg2 color="var(--warning)" t="Pendente" v="12%" /><Lg2 color="var(--danger)" t="Vencido" v="5%" /></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 4 }}><div className="card-h"><div><h3>Projetos em foco</h3><span className="sub">Saúde e progresso</span></div><button className="btn btn-soft btn-sm card-h more">Ver todos</button></div></div>
        <table className="tbl">
          <thead><tr><th>Projeto</th><th>Fase</th><th>Saúde</th><th style={{ width: 150 }}>Progresso</th><th>Contrato</th><th>Equipa</th></tr></thead>
          <tbody>
            {PROJECTS.filter(p => p.status === 'Em curso' || p.status === 'Em risco').slice(0, 4).map(p => (
              <tr key={p.id}>
                <td><div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{p.code}</div></td>
                <td><Badge tag={p.tag} dot={false}>{p.phase}</Badge></td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12.5, color: p.health === 'green' ? 'var(--success)' : p.health === 'amber' ? '#b9791a' : 'var(--danger)' }}><span className={'health-dot h-' + p.health}></span>{p.health === 'green' ? 'Saudável' : p.health === 'amber' ? 'Atenção' : 'Crítico'}</span></td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Progress value={p.progress} thin /><span className="num" style={{ fontSize: 12.5, fontWeight: 700, width: 30 }}>{p.progress}%</span></div></td>
                <td className="num" style={{ fontWeight: 700, fontSize: 13.5 }}>{eur(p.contract)}</td>
                <td><AvStack people={p.team} max={3} size={26} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashFrame>
  );
}

/* ============================================================
   VARIATION B — Operational "Today" (action-first)
   ============================================================ */
function DashB() {
  const overdue = KANBAN.tasks.filter(t => t.overdue);
  const agenda = [
    { t: 'Cálculo estrutural — piso 2 e 3', who: PEOPLE.joana, due: 'Hoje', tag: 'b-red', proj: 'Edifício Marquês' },
    { t: 'Modelo BIM — coordenação MEP', who: PEOPLE.miguel, due: 'Amanhã', tag: 'b-amber', proj: 'Edifício Marquês' },
    { t: 'Mapa de acabamentos interiores', who: PEOPLE.rui, due: '14 Jun', tag: 'b-gray', proj: 'Sede Vértice' },
    { t: 'Pedido de elementos à Câmara', who: PEOPLE.ana, due: '24 Jun', tag: 'b-gray', proj: 'Quinta do Lago' },
  ];
  return (
    <DashFrame
      active="checkSquare"
      title="O teu dia, Ana"
      sub="Sexta, 8 de junho · 3 aprovações · 2 tarefas em atraso"
      actions={<React.Fragment>
        <button className="btn btn-ghost btn-sm"><Icon name="inbox" size={15} /> Caixa</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} /> Nova tarefa</button>
      </React.Fragment>}
    >
      {/* attention strip */}
      <div className="grid cols-3" style={{ marginBottom: 18 }}>
        <Attn icon="shield" tone="danger" n="3" l="Aprovações a aguardar" cta="Rever agora" />
        <Attn icon="alert" tone="warning" n="2" l="Tarefas em atraso" cta="Ver atrasos" />
        <Attn icon="calendar" tone="info" n="6" l="Entregas esta semana" cta="Abrir agenda" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
        <div className="grid" style={{ gap: 18 }}>
          {/* approvals to action */}
          <div className="card card-pad">
            <div className="card-h"><div><h3>Precisa da tua decisão</h3></div><span className="badge b-red card-h more">{APPROVALS.length}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {APPROVALS.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                  <Avatar p={a.who} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.title}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{a.project} · {a.type} · {a.time}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" style={{ padding: '7px 12px' }}><Icon name="check" size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '7px 12px' }}><Icon name="x" size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* agenda */}
          <div className="card card-pad">
            <div className="card-h"><div><h3>Agenda de entregas</h3><span className="sub">Próximos prazos atribuídos a ti e à equipa</span></div></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {agenda.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 0', borderBottom: i < agenda.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 4, height: 38, borderRadius: 4, background: a.tag === 'b-red' ? 'var(--danger)' : a.tag === 'b-amber' ? 'var(--warning)' : 'var(--border-2)' }}></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.t}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{a.proj}</div></div>
                  <Avatar p={a.who} size={28} />
                  <Badge tag={a.tag} dot={false}>{a.due}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* activity rail */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Atividade ao vivo</h3></div><span className="badge b-green card-h more"><span className="bdot"></span>Agora</span></div>
          <div className="tl">
            {ACTIVITY.map((a, i) => (
              <div className="tl-item" key={i}>
                <div className={'tl-dot' + (a.on ? ' on' : '')}>{a.on ? <Icon name={a.icon} size={11} /> : null}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}><b>{a.who.name.split(' ')[0]}</b> {a.action} <b style={{ color: 'var(--primary-700)' }}>{a.target}</b>{a.meta && <span className="muted"> {a.meta}</span>}</div>
                <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashFrame>
  );
}

/* ============================================================
   VARIATION C — Portfolio / projects-as-hero
   ============================================================ */
function DashC() {
  const workload = [
    { p: PEOPLE.ana, n: 8, pct: 80 }, { p: PEOPLE.rui, n: 6, pct: 60 },
    { p: PEOPLE.joana, n: 9, pct: 95 }, { p: PEOPLE.miguel, n: 5, pct: 50 },
  ];
  return (
    <DashFrame
      active="folder"
      title="Portfólio de projetos"
      sub="18 ativos · 4 em risco · carga da equipa equilibrada"
      actions={<React.Fragment>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={15} /> Filtrar</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} /> Novo projeto</button>
      </React.Fragment>}
    >
      {/* thin stats strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {[['folder', '24', 'Projetos'], ['checkSquare', '38', 'Tarefas abertas'], ['layers', '9', 'Entregáveis'], ['shield', '3', 'Aprovações'], ['alert', '6', 'Riscos'], ['euro', '€143k', 'A receber']].map((s, i) => (
          <div key={i} className="card" style={{ flex: 1, minWidth: 140, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ color: 'var(--text-3)' }}><Icon name={s[0]} size={19} /></div>
            <div><div className="num" style={{ fontWeight: 700, fontSize: 19, lineHeight: 1 }}>{s[1]}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{s[2]}</div></div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2.2fr 1fr', alignItems: 'start' }}>
        {/* hero project cards */}
        <div className="grid cols-2">
          {PROJECTS.filter(p => p.status === 'Em curso' || p.status === 'Em risco').slice(0, 4).map(p => {
            const hc = p.health === 'green' ? 'var(--success)' : p.health === 'amber' ? '#b9791a' : 'var(--danger)';
            return (
              <div key={p.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="building" size={21} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{p.name}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{p.code} · {p.client}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 12, color: hc }}><span className={'health-dot h-' + p.health}></span></span>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}><span className="muted" style={{ fontWeight: 600 }}>{p.phase}</span><span className="num" style={{ fontWeight: 700 }}>{p.progress}%</span></div>
                  <Progress value={p.progress} thin />
                </div>
                <div className="divider" style={{ margin: 0 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, color: 'var(--text-3)', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="checkSquare" size={13} />{p.openTasks}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: p.overdue ? 'var(--danger)' : 'var(--text-3)' }}><Icon name="alert" size={13} />{p.overdue}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="layers" size={13} />{p.deliverables}</span>
                  </div>
                  <AvStack people={p.team} max={3} size={26} />
                </div>
              </div>
            );
          })}
        </div>

        {/* team workload */}
        <div className="grid" style={{ gap: 18 }}>
          <div className="card card-pad">
            <div className="card-h"><div><h3>Carga da equipa</h3><span className="sub">Tarefas ativas por pessoa</span></div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {workload.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar p={w.p} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}><span style={{ fontWeight: 700, fontSize: 13 }}>{w.p.name.split(' ')[0]}</span><span className="num muted" style={{ fontWeight: 700, fontSize: 12 }}>{w.n} tarefas</span></div>
                    <Progress value={w.pct} thin color={w.pct > 90 ? 'var(--danger)' : 'var(--grad-gold)'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <div className="card-h"><div><h3>Aprovações</h3></div><span className="badge b-red card-h more">3</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {APPROVALS.slice(0, 3).map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar p={a.who} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div><div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{a.time}</div></div>
                  <button className="btn btn-soft btn-sm" style={{ padding: '5px 10px' }}><Icon name="check" size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}

function Lg({ color, t }) { return <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: color }}></span>{t}</div>; }
function Lg2({ color, t, v }) { return <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: color }}></span><span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-2)', minWidth: 64 }}>{t}</span><span className="num" style={{ fontWeight: 700, fontSize: 14 }}>{v}</span></div>; }
function Attn({ icon, tone, n, l, cta }) {
  const map = { danger: ['var(--danger)', 'var(--danger-soft)'], warning: ['var(--warning)', 'var(--warning-soft)'], info: ['var(--info)', 'var(--info-soft)'] };
  const [c, bg] = map[tone];
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 50, height: 50, borderRadius: 13, background: bg, color: c, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={icon} size={24} /></div>
      <div style={{ flex: 1 }}>
        <div className="num" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{n}</div>
        <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{l}</div>
      </div>
      <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>{cta}</button>
    </div>
  );
}

Object.assign(window, { DashA, DashB, DashC });
