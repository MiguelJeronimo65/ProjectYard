/* ProjectYard — Dashboard (A+C merge: Executive top + Portfolio bottom) */

function Dashboard({ go }) {
  const workload = [
    { p: PEOPLE.ana, n: 8, pct: 80 }, { p: PEOPLE.rui, n: 6, pct: 60 },
    { p: PEOPLE.joana, n: 9, pct: 95 }, { p: PEOPLE.miguel, n: 5, pct: 50 },
  ];
  const focus = PROJECTS.filter(p => p.status === 'Em curso' || p.status === 'Em risco').slice(0, 4);

  // Faturação — granularidade do gráfico (o toggle Mensal/Trimestre/Ano agrega a série)
  const [period, setPeriod] = useState('Mensal');
  const REV_TRI = [{ m: 'T1', v: 135 }, { m: 'T2', v: 183 }, { m: 'T3', v: 138 }];
  const REV_ANO = [{ m: '2024', v: 395 }, { m: '2025', v: 512 }, { m: '2026', v: 456 }];
  const chartData = period === 'Trimestre' ? REV_TRI : period === 'Ano' ? REV_ANO : REVENUE;
  const headlineVal = chartData[chartData.length - 1].v;
  const periodCaption = period === 'Mensal' ? 'faturado em Agosto' : period === 'Trimestre' ? 'faturado no 3.º trimestre' : 'faturado em 2026';

  return (
    <div className="content">
      <PageHead
        title={`Bom dia, ${ME.name.split(' ')[0]} 👋`}
        sub="Aqui está o estado da entrega dos teus projetos hoje."
        actions={<React.Fragment>
          <button className="btn btn-ghost"><Icon name="calendar" size={17} /> Junho 2026</button>
          <button className="btn btn-primary"><Icon name="plus" size={17} /> Novo projeto</button>
        </React.Fragment>}
      />

      {/* ===== Executive band (from A) ===== */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Stat icon="folder" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={KPIS.projetosAtivos} label="Projetos ativos" trend={KPIS.projetosTrend} foot={`${KPIS.aIniciar} a iniciar esta semana`} onClick={() => go('projects')} />
        <Stat icon="euro" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={kk(KPIS.faturadoAno)} label="Faturado (ano)" trend={KPIS.faturadoTrend} foot={`${KPIS.faturasEmitidas} faturas emitidas`} onClick={() => go('reports')} />
        <Stat icon="check" iconBg="var(--success-soft)" iconColor="var(--success)" value={kk(KPIS.recebido)} label="Recebido" foot={`${KPIS.pagoPct}% da faturação`} onClick={() => go('payments')} />
        <Stat icon="clock" iconBg="var(--warning-soft)" iconColor="var(--warning)" value={kk(KPIS.aReceber)} label="A receber" trend="1 vencida" trendDir="down" foot={`${kk(KPIS.vencido)} vencido`} onClick={() => go('payments')} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr', marginBottom: 20, alignItems: 'stretch' }}>
        <div className="card card-pad">
          <div className="card-h">
            <div><h3>Faturação</h3><span className="sub">Recebido vs. faturado · 2026</span></div>
            <div className="card-h more" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="seg">
                {['Mensal', 'Trimestre', 'Ano'].map(p => (
                  <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
              <button className="btn btn-soft btn-sm" onClick={() => go('reports')}>Relatórios <Icon name="arrowRight" size={14} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
            <div>
              <div className="num" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>{'€' + (headlineVal * 1000).toLocaleString('de-DE')}</div>
              <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{periodCaption}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <Legend color="var(--accent)" label="Recebido" />
                <Legend color="var(--accent-soft2)" label="Em aberto" />
              </div>
            </div>
            <div style={{ flex: 1 }}><BarChart data={chartData} height={150} /></div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Estado da faturação</h3></div><button className="btn btn-soft btn-sm card-h more" onClick={() => go('payments')}>Financeiro <Icon name="arrowRight" size={14} /></button></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Donut segments={[{ v: KPIS.pagoPct, color: 'var(--success)' }, { v: KPIS.pendentePct, color: 'var(--warning)' }, { v: KPIS.vencidoPct, color: 'var(--danger)' }]} size={126} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <DonutLeg color="var(--success)" label="Pago" v={KPIS.pagoPct + '%'} />
              <DonutLeg color="var(--warning)" label="Pendente" v={KPIS.pendentePct + '%'} />
              <DonutLeg color="var(--danger)" label="Vencido" v={KPIS.vencidoPct + '%'} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Portfolio band (from C) ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0 16px' }}>
        <h2 className="display" style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.015em', margin: 0 }}>Portfólio em foco</h2>
        <span className="muted-3" style={{ fontSize: 13.5, fontWeight: 600 }}>{KPIS.projetosAtivos} ativos · {KPIS.emRisco} em risco</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-soft btn-sm" onClick={() => go('cronoglobal')}><Icon name="gantt" size={15} /> Cronograma global</button>
          <button className="btn btn-soft btn-sm" onClick={() => go('projects')}>Ver todos os projetos <Icon name="arrowRight" size={15} /></button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2.2fr 1fr', alignItems: 'start' }}>
        {/* hero project cards */}
        <div className="grid cols-2">
          {focus.map(p => {
            const hc = p.health === 'green' ? 'var(--success)' : p.health === 'amber' ? '#b9791a' : 'var(--danger)';
            const hl = p.health === 'green' ? 'Saudável' : p.health === 'amber' ? 'Atenção' : 'Crítico';
            return (
              <div key={p.id} className="card card-pad rise" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 13 }} onClick={() => go('project', p)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="building" size={22} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{p.name}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{p.code} · {p.client}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 12, color: hc }} title={hl}><span className={'health-dot h-' + p.health}></span></span>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}><span className="muted" style={{ fontWeight: 600 }}>{p.phase}</span><span className="num" style={{ fontWeight: 700 }}>{p.progress}%</span></div>
                  <Progress value={p.progress} thin />
                </div>
                <div className="divider" style={{ margin: 0 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 13, color: 'var(--text-3)', fontSize: 12.5, fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Tarefas abertas"><Icon name="checkSquare" size={14} />{p.openTasks}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: p.overdue ? 'var(--danger)' : 'var(--text-3)' }} title="Em atraso"><Icon name="alert" size={14} />{p.overdue}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Entregáveis"><Icon name="layers" size={14} />{p.deliverables}</span>
                  </div>
                  <AvStack people={p.team} max={3} size={27} />
                </div>
              </div>
            );
          })}
        </div>

        {/* right rail: workload + approvals */}
        <div className="grid" style={{ gap: 20 }}>
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
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={() => go('timesheets')}>Registo de horas e utilização <Icon name="arrowRight" size={14} /></button>
          </div>

          <div className="card card-pad">
            <div className="card-h"><div><h3>Aprovações pendentes</h3></div><span className="badge b-red card-h more">{APPROVALS.length}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {APPROVALS.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'center', padding: 11, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                  <Avatar p={a.who} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</div>
                    <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{a.project} · {a.time}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ padding: '7px 11px' }} onClick={(e) => e.stopPropagation()}><Icon name="check" size={14} /></button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => go('approvals')}>Ver todas as aprovações</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}>
      <span style={{ width: 11, height: 11, borderRadius: 4, background: color }}></span>{label}
    </div>
  );
}

function DonutLeg({ color, label, v }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 11, height: 11, borderRadius: 4, background: color }}></span>
      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', minWidth: 66 }}>{label}</span>
      <span className="num" style={{ fontWeight: 700, fontSize: 15 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { Dashboard });
