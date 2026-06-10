/* ProjectYard — Payments / Billing */

function Payments({ go }) {
  const [tab, setTab] = useState('Faturas');
  const [nf, setNf] = useState(false);
  const [invoices, setInvoices] = useState(INVOICES);
  const [adj, setAdj] = useState({ faturado: 0, recebido: 0, pendente: 0, vencido: 0, emitidas: 0, abertas: 0 });
  const tabs = ['Faturas', 'Plano de pagamentos', 'Custos'];

  const nextNum = () => {
    const max = invoices.reduce((m, i) => { const n = parseInt((i.num.split('/')[1] || '0'), 10); return n > m ? n : m; }, 0);
    return 'FT 2026/' + String(max + 1).padStart(3, '0');
  };
  const payInvoice = (num) => {
    const inv = invoices.find(i => i.num === num);
    if (!inv || inv.status === 'Pago') return;
    setInvoices(list => list.map(i => i.num === num ? { ...i, status: 'Pago', tag: 'b-green' } : i));
    setAdj(a => ({ ...a, recebido: a.recebido + inv.amount, pendente: a.pendente - (inv.status === 'Pendente' ? inv.amount : 0), vencido: a.vencido - (inv.status === 'Vencido' ? inv.amount : 0), abertas: a.abertas - 1 }));
    if (window.PYToast) window.PYToast('Pagamento de ' + eur(inv.amount) + ' registado · ' + num);
  };
  const createInvoice = (data) => {
    const num = nextNum();
    setInvoices(list => [{ num, project: data.project, milestone: data.milestone || '—', amount: data.amount, status: 'Pendente', tag: 'b-amber', issued: '09 Jun 2026', due: data.due }, ...list]);
    setAdj(a => ({ ...a, faturado: a.faturado + data.amount, pendente: a.pendente + data.amount, emitidas: a.emitidas + 1, abertas: a.abertas + 1 }));
    if (window.PYToast) window.PYToast('Fatura ' + num + ' criada · pendente');
  };

  // KPIs = base anual (coerente com Dashboard) + deltas das ações
  const faturado = KPIS.faturadoAno + adj.faturado;
  const recebido = KPIS.recebido + adj.recebido;
  const pendente = KPIS.pendente + adj.pendente;
  const vencido = KPIS.vencido + adj.vencido;
  const emitidas = KPIS.faturasEmitidas + adj.emitidas;
  const abertas = KPIS.faturasAbertas + adj.abertas;
  const pct = (n) => Math.round(n / faturado * 100);
  const pagoPct = pct(recebido), pendentePct = pct(pendente), vencidoPct = pct(vencido);
  const vencidas = invoices.filter(i => i.status === 'Vencido');

  return (
    <div className="content">
      <PageHead
        title="Financeiro"
        sub="Faturação, milestones de pagamento e controlo de custos"
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => window.PYToast && window.PYToast('Exportação iniciada · faturas.csv')}><Icon name="download" size={16} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setNf(true)}><Icon name="plus" size={16} /> Nova fatura</button>
        </React.Fragment>}
      />

      {/* KPI */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Stat icon="euro" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={kk(faturado)} label="Faturado (ano)" trend={KPIS.faturadoTrend} foot={`${emitidas} faturas emitidas`} />
        <Stat icon="check" iconBg="var(--success-soft)" iconColor="var(--success)" value={kk(recebido)} label="Recebido" foot={`${pagoPct}% da faturação`} />
        <Stat icon="clock" iconBg="var(--warning-soft)" iconColor="var(--warning)" value={kk(pendente)} label="Pendente" foot={`${abertas} faturas em aberto`} />
        <Stat icon="alert" iconBg="var(--danger-soft)" iconColor="var(--danger)" value={kk(vencido)} label="Vencido" trend={vencidas.length ? vencidas.length + ' fatura' + (vencidas.length > 1 ? 's' : '') : 'Sem vencidas'} trendDir="down" foot={vencidas.length ? vencidas[0].project : 'Tudo em dia'} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start', marginBottom: 20 }}>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Cash-flow mensal</h3><span className="sub">Recebido por mês · 2026</span></div>
            <div className="card-h more"><Badge tag="b-green" >+18% YoY</Badge></div>
          </div>
          <BarChart data={REVENUE} height={170} />
        </div>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Estado da faturação</h3></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Donut segments={[
              { v: pagoPct, color: 'var(--success)' },
              { v: pendentePct, color: 'var(--warning)' },
              { v: vencidoPct, color: 'var(--danger)' },
            ]} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DonutLeg color="var(--success)" label="Pago" v={pagoPct + '%'} />
              <DonutLeg color="var(--warning)" label="Pendente" v={pendentePct + '%'} />
              <DonutLeg color="var(--danger)" label="Vencido" v={vencidoPct + '%'} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            border: 'none', background: 'transparent', padding: '12px 16px', fontWeight: 700, fontSize: 14,
            color: tab === t ? 'var(--primary-700)' : 'var(--text-2)', borderBottom: '2px solid ' + (tab === t ? 'var(--accent)' : 'transparent'), marginBottom: -1
          }}>{t}</button>
        ))}
      </div>

      {tab === 'Faturas' && <FaturasTab invoices={invoices} onPay={payInvoice} />}

      {tab === 'Plano de pagamentos' && (
        <div className="card card-pad">
          <div className="card-h"><div><h3>Milestones de pagamento</h3><span className="sub">Edifício Marquês — Reabilitação · contrato €248.000</span></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: m.status === 'Faturado' ? 'var(--success-soft)' : m.status === 'Atingido' ? 'var(--info-soft)' : 'var(--surface-3)', color: m.status === 'Faturado' ? 'var(--success)' : m.status === 'Atingido' ? 'var(--info)' : 'var(--text-3)' }}>
                  <Icon name={m.status === 'Faturado' ? 'check' : 'target'} size={21} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</div>
                  <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{m.trigger} · {m.pct}% do contrato</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num" style={{ fontWeight: 700, fontSize: 16 }}>{eur(m.amount)}</div>
                  <Badge tag={m.tag} dot={false}>{m.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 28, marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase' }}>Faturado</div><div className="num" style={{ fontWeight: 700, fontSize: 18, color: 'var(--success)' }}>€37.200</div></div>
            <div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase' }}>Por faturar</div><div className="num" style={{ fontWeight: 700, fontSize: 18 }}>€210.800</div></div>
          </div>
        </div>
      )}

      {tab === 'Custos' && <Costs />}

      <NovaFaturaModal open={nf} onClose={() => setNf(false)} onCreate={createInvoice} />
    </div>
  );
}

/* ---------------- Nova fatura ---------------- */
function NovaFaturaModal({ open, onClose, onCreate }) {
  const [project, setProject] = useState(PROJECTS[0].name);
  const [milestone, setMilestone] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('30 Jun 2026');
  const [cond, setCond] = useState('30 dias');
  useEffect(() => { if (open) { setProject(PROJECTS[0].name); setMilestone(''); setAmount(''); setDue('30 Jun 2026'); setCond('30 dias'); } }, [open]);
  const val = parseInt(amount, 10);
  const valid = val > 0;
  const submit = () => { if (!valid) return; onCreate({ project, milestone, amount: val, due }); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Nova fatura" sub="Emite uma fatura associada a um projeto e milestone." width={540}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!valid}><Icon name="check" size={15} /> Emitir fatura</button>
      </React.Fragment>}>
      <Field label="Projeto"><SelectInput value={project} onChange={(e) => setProject(e.target.value)}>
        {PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
      </SelectInput></Field>
      <Field label="Milestone / descrição"><TextInput value={milestone} onChange={(e) => setMilestone(e.target.value)} placeholder="Ex.: Projeto de Execução 50%" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Valor (€)" half><TextInput type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></Field>
        <Field label="Vencimento" half><TextInput value={due} onChange={(e) => setDue(e.target.value)} placeholder="Ex.: 30 Jun 2026" /></Field>
      </div>
      <Field label="Condições"><SelectInput value={cond} onChange={(e) => setCond(e.target.value)}>
        {['A pronto', '30 dias', '45 dias', '60 dias'].map(c => <option key={c}>{c}</option>)}
      </SelectInput></Field>
    </Modal>
  );
}

/* ---------------- Custos: previsto vs real por fase + subcontratados ---------------- */
function Costs() {
  const totPrev = COSTS.phases.reduce((a, p) => a + p.prev, 0);
  const totReal = COSTS.phases.reduce((a, p) => a + p.real, 0);
  const disp = totPrev - totReal;
  const consumo = Math.round(totReal / totPrev * 100);
  const margem = COSTS.contract - totPrev;
  const margemPct = Math.round(margem / COSTS.contract * 100);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid cols-4">
        <Stat icon="gauge" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={'€' + fmt(totPrev / 1000) + 'k'} label="Orçamento de custos" foot={COSTS.code + ' · contrato €248k'} />
        <Stat icon="euro" iconBg="var(--warning-soft)" iconColor="var(--warning)" value={'€' + fmt(Math.round(totReal / 1000)) + 'k'} label="Gasto / comprometido" trend={consumo + '%'} trendDir="up" foot={`${consumo}% do orçamento de custos`} />
        <Stat icon="check" iconBg="var(--success-soft)" iconColor="var(--success)" value={'€' + fmt(Math.round(disp / 1000)) + 'k'} label="Disponível" foot="Margem de orçamento por usar" />
        <Stat icon="trend" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={margemPct + '%'} label="Margem prevista" foot={`€${fmt(margem / 1000)}k sobre o contrato`} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        {/* Custos por fase */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Custos por fase</h3><span className="sub">Previsto vs. real · {COSTS.project}</span></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {COSTS.phases.map((p, i) => {
              const c = p.prev ? p.real / p.prev : 0;
              const tone = c > 1 ? 'red' : c > 0.85 ? 'amber' : 'green';
              const col = SEM_COL[tone];
              return (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name}</span>
                    <Badge tag={p.tag} dot={false}>{p.tipo}</Badge>
                    <span style={{ marginLeft: 'auto', fontSize: 13 }} className="num">
                      <b style={{ color: p.real ? 'var(--text)' : 'var(--text-3)' }}>{p.real ? eur(p.real) : '—'}</b>
                      <span className="muted-3" style={{ fontWeight: 600 }}> / {eur(p.prev)}</span>
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: 'var(--surface-3)', borderRadius: 99 }}>
                    <div style={{ width: Math.min(100, c * 100) + '%', height: '100%', background: col, borderRadius: 99, transition: 'width .6s' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
            <span className="num" style={{ fontSize: 15 }}><b>{eur(totReal)}</b> <span className="muted-3" style={{ fontWeight: 600 }}>/ {eur(totPrev)} · {consumo}%</span></span>
          </div>
        </div>

        {/* Subcontratados */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Subcontratados</h3><span className="sub">Especialidades externas</span></div><button className="btn btn-soft btn-sm card-h more" onClick={() => window.PYToast && window.PYToast('Adicionar subcontratado')}><Icon name="plus" size={14} /> Adicionar</button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {COSTS.suppliers.map((s, i) => {
              const pct = s.contratado ? Math.round(s.faturado / s.contratado * 100) : 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--text-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="briefcase" size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{s.spec}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="num" style={{ fontWeight: 700, fontSize: 13.5 }}>{eur(s.faturado)}<span className="muted-3" style={{ fontWeight: 600 }}> / {eur(s.contratado)}</span></div>
                    <Badge tag={s.tag} dot={false}>{s.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutLeg({ color, label, v }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 11, height: 11, borderRadius: 4, background: color }}></span>
      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', minWidth: 70 }}>{label}</span>
      <span className="num" style={{ fontWeight: 700, fontSize: 15 }}>{v}</span>
    </div>
  );
}

/* ---------------- Faturas: filtro de estado + ordenação ---------------- */
function FaturasTab({ invoices, onPay }) {
  const [fStatus, setFStatus] = useState('Todos');
  const estados = ['Todos', 'Pago', 'Pendente', 'Vencido'];
  const filtered = fStatus === 'Todos' ? invoices : invoices.filter(i => i.status === fStatus);
  const sort = useSort(filtered, {}, null);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {estados.map(s => <button key={s} className={'chip' + (fStatus === s ? ' active' : '')} onClick={() => setFStatus(s)}>{s}</button>)}
        <span className="muted-3" style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600 }}>{sort.sorted.length} de {invoices.length} faturas</span>
      </div>
      <div className="card">
        {sort.sorted.length === 0 ? (
          <div className="empty" style={{ padding: '44px 20px' }}><Icon name="card" size={30} /><div style={{ marginTop: 10, fontWeight: 700, fontSize: 14.5, color: 'var(--text-2)' }}>Sem faturas</div><div style={{ marginTop: 4 }}>Nenhuma fatura no estado “{fStatus}”.</div></div>
        ) : (
          <table className="tbl">
            <thead><tr>
              <Th label="Fatura" k="num" sort={sort} />
              <Th label="Projeto" k="project" sort={sort} />
              <th>Milestone</th>
              <Th label="Valor" k="amount" sort={sort} />
              <Th label="Emitida" k="issued" sort={sort} />
              <th>Vencimento</th>
              <Th label="Estado" k="status" sort={sort} />
              <th></th>
            </tr></thead>
            <tbody>
              {sort.sorted.map((inv, i) => (
                <tr key={i}>
                  <td><span className="num" style={{ fontWeight: 700 }}>{inv.num}</span></td>
                  <td className="muted" style={{ fontWeight: 600 }}>{inv.project}</td>
                  <td className="muted" style={{ fontWeight: 600 }}>{inv.milestone}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{eur(inv.amount)}</td>
                  <td className="muted" style={{ fontWeight: 600 }}>{inv.issued}</td>
                  <td className={inv.status === 'Vencido' ? '' : 'muted'} style={{ fontWeight: 700, color: inv.status === 'Vencido' ? 'var(--danger)' : undefined }}>{inv.due}</td>
                  <td><Badge tag={inv.tag}>{inv.status}</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {inv.status !== 'Pago' && <button className="btn btn-soft btn-sm" style={{ padding: '6px 11px' }} onClick={(e) => { e.stopPropagation(); onPay(inv.num); }}>Registar pgto.</button>}
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={(e) => { e.stopPropagation(); if (window.PYToast) window.PYToast('A descarregar ' + inv.num + '.pdf'); }}><Icon name="download" size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function DonutLegacyUnused() { return null; }

Object.assign(window, { Payments });
