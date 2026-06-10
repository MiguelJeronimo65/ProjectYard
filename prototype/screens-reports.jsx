/* ProjectYard — Relatórios (cruza horas · custo · faturação)
   Tabs: Por projeto · Por colaborador · Rentabilidade
   Espelha as folhas Resumo_Projetos / Resumo_Colaboradores / Dashboard do cliente.
   Produtividade = horas esperadas (prev × prazo%) ÷ horas reais · semáforo ≥95%/≥85% (Config) */

const kEur = (n) => '€' + (n / 1000).toLocaleString('pt-PT', { maximumFractionDigits: n >= 100000 ? 0 : 1 }) + 'k';
const prodOf = (r) => (r.horasPrev * r.prazo / 100) / r.horasReais; // produtividade por projeto
const sum = (a) => a.reduce((x, y) => x + y, 0);

function Reports({ go }) {
  const [tab, setTab] = useState('Por projeto');
  const [period, setPeriod] = useState('Ano');
  const tabs = ['Por projeto', 'Por colaborador', 'Rentabilidade'];

  const totHonor = sum(REPORT_PROJ.map(p => p.honorarios));
  const totFat = sum(REPORT_PROJ.map(p => p.faturado));
  const totReceb = sum(REPORT_PROJ.map(p => p.recebido));
  const totReal = sum(REPORT_PROJ.map(p => p.horasReais));
  const totPrev = sum(REPORT_PROJ.map(p => p.horasPrev));
  const custoPrev = totPrev * TS_BLENDED;
  const custoReal = totReal * TS_BLENDED;
  const margemPrev = totHonor - custoPrev;
  const margemPct = Math.round(margemPrev / totHonor * 100);
  const active = REPORT_PROJ.filter(p => p.status !== 'Concluído');
  const prodAvg = Math.round(sum(active.map(prodOf)) / active.length * 100);

  return (
    <div className="content">
      <PageHead
        title="Relatórios"
        sub="Produtividade, custo de produção e faturação por projeto e colaborador"
        actions={<React.Fragment>
          <div className="seg">
            {['Trimestre', 'Ano', 'Tudo'].map(p => <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>{p}</button>)}
          </div>
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
        </React.Fragment>}
      />

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Stat icon="gauge" iconBg="var(--success-soft)" iconColor="var(--success)" value={prodAvg + '%'} label="Produtividade média" foot="Projetos ativos · horas esperadas / reais" />
        <Stat icon="clock" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={fmt(totReal) + 'h'} label="Horas reais (ano)" trend={Math.round(totReal / totPrev * 100) + '%'} foot={`${fmt(totPrev)}h previstas em carteira`} />
        <Stat icon="euro" iconBg="var(--info-soft)" iconColor="var(--info)" value={kEur(totFat)} label="Faturado (carteira)" foot={`${kEur(totReceb)} recebido · ${Math.round(totReceb / totFat * 100)}%`} />
        <Stat icon="card" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={kEur(custoReal)} label="Custo de produção" foot={`${TS_BLENDED} €/h médio · margem bruta ${margemPct}%`} />
      </div>

      {/* Insight row */}
      <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr', alignItems: 'start', marginBottom: 22 }}>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Produtividade por projeto</h3><span className="sub">Horas esperadas vs reais · semáforo ≥95% verde · ≥85% amarelo</span></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {REPORT_PROJ.map(p => {
              const pr = prodOf(p);
              const tone = semaforo(pr);
              const col = SEM_COL[tone];
              return (
                <div key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ width: 168, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                    <span style={{ width: 4, height: 26, borderRadius: 4, background: p.color, flexShrink: 0 }}></span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div className="muted-3 num" style={{ fontSize: 11, fontWeight: 600 }}>{p.code}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, height: 22, background: 'var(--surface-3)', borderRadius: 7, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: `${100 / 1.3}%`, top: 0, bottom: 0, width: 2, background: 'var(--border-2)' }} title="100% = no plano"></div>
                    <div style={{ width: Math.min(100, pr / 1.3 * 100) + '%', height: '100%', background: col, borderRadius: 7, transition: 'width .6s' }}></div>
                  </div>
                  <span className="num" style={{ fontWeight: 700, fontSize: 14, color: col, minWidth: 46, textAlign: 'right' }}>{Math.round(pr * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saúde da carteira */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Saúde da carteira</h3></div></div>
          <div style={{ textAlign: 'center', padding: '6px 0 16px' }}>
            <div className="num" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--success)', fontFamily: 'var(--font-display)' }}>{margemPct}%</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Margem bruta prevista (s/ custos indiretos)</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PortRow label="Honorários em carteira" value={kEur(totHonor)} />
            <PortRow label="Faturado" value={kEur(totFat)} sub={Math.round(totFat / totHonor * 100) + '%'} />
            <PortRow label="Recebido" value={kEur(totReceb)} sub={Math.round(totReceb / totHonor * 100) + '%'} />
            <PortRow label="Custo de produção prev." value={kEur(custoPrev)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', marginTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>Margem bruta prevista</span>
              <span className="num" style={{ fontWeight: 700, fontSize: 15, color: 'var(--success)' }}>{kEur(margemPrev)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ border: 'none', background: 'transparent', padding: '12px 16px', fontWeight: 700, fontSize: 14, color: tab === t ? 'var(--primary-700)' : 'var(--text-2)', borderBottom: '2px solid ' + (tab === t ? 'var(--accent)' : 'transparent'), marginBottom: -1 }}>{t}</button>
        ))}
      </div>

      {tab === 'Por projeto' && <ProjReport go={go} />}
      {tab === 'Por colaborador' && <ColReport />}
      {tab === 'Rentabilidade' && <RentReport totHonor={totHonor} custoPrev={custoPrev} custoReal={custoReal} />}
    </div>
  );
}

function PortRow({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0' }}>
      <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
        {sub && <span className="muted-3" style={{ fontSize: 11.5, fontWeight: 700 }}>{sub}</span>}
        <span className="num" style={{ fontWeight: 700, fontSize: 14 }}>{value}</span>
      </span>
    </div>
  );
}

/* ---------------- Tab: Por projeto (Resumo_Projetos) ---------------- */
function ProjReport({ go }) {
  const openProj = (code) => { const p = PROJECTS.find(x => x.code === code); if (p) go('project', p); };
  const sort = useSort(REPORT_PROJ, { name: (p) => p.name, horasReais: (p) => p.horasReais, prod: (p) => prodOf(p), honorarios: (p) => p.honorarios, faturado: (p) => p.faturado, recebido: (p) => p.recebido, prazo: (p) => p.prazo, status: (p) => p.status }, null);
  return (
    <div className="card">
      <table className="tbl">
        <thead><tr>
          <Th label="Projeto" k="name" sort={sort} />
          <Th label="Horas reais / prev." k="horasReais" sort={sort} />
          <Th label="Produtividade" k="prod" sort={sort} />
          <Th label="Honorários" k="honorarios" sort={sort} />
          <Th label="Faturado" k="faturado" sort={sort} />
          <Th label="Recebido" k="recebido" sort={sort} />
          <Th label="Prazo" k="prazo" sort={sort} />
          <Th label="Estado" k="status" sort={sort} />
        </tr></thead>
        <tbody>
          {sort.sorted.map(p => {
            const pr = prodOf(p), tone = semaforo(pr), col = SEM_COL[tone];
            const consumo = p.horasReais / p.horasPrev;
            return (
              <tr key={p.code} className="row-click" onClick={() => openProj(p.code)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ width: 4, height: 30, borderRadius: 4, background: p.color, flexShrink: 0 }}></span>
                    <div><div style={{ fontWeight: 700 }}>{p.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}><span className="num">{p.code}</span> · {p.client}</div></div>
                  </div>
                </td>
                <td style={{ minWidth: 150 }}>
                  <div className="num" style={{ fontWeight: 700, fontSize: 13.5 }}>{fmt(p.horasReais)}h <span className="muted-3" style={{ fontWeight: 600 }}>/ {fmt(p.horasPrev)}h</span></div>
                  <div className="prog thin" style={{ marginTop: 5, width: 132 }}><span style={{ width: Math.min(100, consumo * 100) + '%', background: consumo > 1 ? 'var(--danger)' : 'var(--accent)' }}></span></div>
                </td>
                <td><span className="badge" style={{ color: col, background: tone === 'green' ? 'var(--success-soft)' : tone === 'amber' ? 'var(--warning-soft)' : 'var(--danger-soft)' }}><span className="bdot"></span>{Math.round(pr * 100)}%</span></td>
                <td className="num" style={{ fontWeight: 700 }}>{eur(p.honorarios)}</td>
                <td className="num muted" style={{ fontWeight: 700 }}>{eur(p.faturado)}</td>
                <td className="num muted" style={{ fontWeight: 700 }}>{p.recebido ? eur(p.recebido) : '—'}</td>
                <td style={{ minWidth: 92 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{p.prazo}%</span><div className="prog thin" style={{ width: 48 }}><span style={{ width: p.prazo + '%' }}></span></div></div></td>
                <td><Badge tag={p.tag}>{p.status}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Tab: Por colaborador (Resumo_Colaboradores) ---------------- */
function ColReport() {
  return (
    <div className="card">
      <table className="tbl">
        <thead><tr>
          <th>Colaborador</th><th>Projetos / fases</th><th>Horas reais / prev.</th><th>Produtividade</th><th>Faturável</th><th>Custo (€/h)</th><th>Custo total</th>
        </tr></thead>
        <tbody>
          {REPORT_COL.map((c, i) => {
            const pr = c.prev / c.real, tone = semaforo(pr), col = SEM_COL[tone];
            return (
              <tr key={i}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Avatar p={c.p} size={36} /><div><div style={{ fontWeight: 700 }}>{c.p.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{c.p.role}</div></div></div></td>
                <td><span className="num" style={{ fontWeight: 700 }}>{c.projetos}</span> <span className="muted-3" style={{ fontWeight: 600, fontSize: 12.5 }}>proj.</span> · <span className="num" style={{ fontWeight: 700 }}>{c.fases}</span> <span className="muted-3" style={{ fontWeight: 600, fontSize: 12.5 }}>fases</span></td>
                <td className="num" style={{ fontWeight: 700 }}>{fmt(c.real)}h <span className="muted-3" style={{ fontWeight: 600 }}>/ {fmt(c.prev)}h</span></td>
                <td><span className="badge" style={{ color: col, background: tone === 'green' ? 'var(--success-soft)' : tone === 'amber' ? 'var(--warning-soft)' : 'var(--danger-soft)' }}><span className="bdot"></span>{Math.round(pr * 100)}%</span></td>
                <td style={{ minWidth: 110 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{c.billablePct}%</span><div className="prog thin" style={{ width: 56 }}><span style={{ width: c.billablePct + '%', background: 'var(--success)' }}></span></div></div></td>
                <td className="num muted" style={{ fontWeight: 700 }}>{c.p.rate} €</td>
                <td className="num" style={{ fontWeight: 700 }}>{eur(c.real * c.p.rate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Tab: Rentabilidade ---------------- */
function RentReport({ totHonor, custoPrev, custoReal }) {
  const rows = REPORT_PROJ.map(p => {
    const cPrev = p.horasPrev * TS_BLENDED, cReal = p.horasReais * TS_BLENDED;
    const margem = p.honorarios - cPrev, mpct = Math.round(margem / p.honorarios * 100);
    const tone = mpct >= 50 ? 'green' : mpct >= 35 ? 'amber' : 'red';
    return { ...p, cPrev, cReal, margem, mpct, tone };
  });
  const totMargem = totHonor - custoPrev;
  return (
    <div className="card">
      <table className="tbl">
        <thead><tr>
          <th>Projeto</th><th>Honorários</th><th>Custo prev.</th><th>Custo real</th><th>Margem bruta</th><th style={{ minWidth: 160 }}>Margem %</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.code}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><span style={{ width: 4, height: 28, borderRadius: 4, background: r.color, flexShrink: 0 }}></span><div><div style={{ fontWeight: 700 }}>{r.name}</div><div className="muted-3 num" style={{ fontSize: 12, fontWeight: 600 }}>{r.code}</div></div></div></td>
              <td className="num" style={{ fontWeight: 700 }}>{eur(r.honorarios)}</td>
              <td className="num muted" style={{ fontWeight: 600 }}>{eur(r.cPrev)}</td>
              <td className="num muted" style={{ fontWeight: 600 }}>{eur(r.cReal)}</td>
              <td className="num" style={{ fontWeight: 700, color: 'var(--success)' }}>{eur(r.margem)}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="prog" style={{ flex: 1, maxWidth: 96 }}><span style={{ width: r.mpct + '%', background: SEM_COL[r.tone] }}></span></div>
                  <span className="num" style={{ fontWeight: 700, fontSize: 14, color: SEM_COL[r.tone], minWidth: 38, textAlign: 'right' }}>{r.mpct}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'var(--surface-2)' }}>
            <td style={{ fontWeight: 700 }}>Total carteira</td>
            <td className="num" style={{ fontWeight: 800 }}>{eur(totHonor)}</td>
            <td className="num" style={{ fontWeight: 700 }}>{eur(custoPrev)}</td>
            <td className="num" style={{ fontWeight: 700 }}>{eur(custoReal)}</td>
            <td className="num" style={{ fontWeight: 800, color: 'var(--success)' }}>{eur(totMargem)}</td>
            <td className="num" style={{ fontWeight: 800 }}>{Math.round(totMargem / totHonor * 100)}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

Object.assign(window, { Reports });
