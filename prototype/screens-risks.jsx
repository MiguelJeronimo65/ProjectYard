/* ProjectYard — Riscos (registo + matriz prob/impacto) */

function Risks({ go }) {
  const [hover, setHover] = useState(null);
  const [risks, setRisks] = useState(RISKS);
  const [novo, setNovo] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fltOpen, setFltOpen] = useState(false);
  const [fStatus, setFStatus] = useState('');
  const [fCat, setFCat] = useState('');
  const [fSev, setFSev] = useState(false);   // filtro rápido “críticos” (severidade ≥ 15)
  const sev = (p, i) => p * i;
  const sevInfo = (s) => s >= 15 ? ['Crítico', 'var(--danger)'] : s >= 8 ? ['Elevado', 'var(--warning)'] : s >= 4 ? ['Moderado', '#caa31a'] : ['Baixo', 'var(--success)'];
  const statusTag = (status, s) => status === 'Mitigado' ? 'b-green' : status === 'Monitorizado' ? 'b-blue' : status === 'Fechado' ? 'b-gray' : (s >= 15 ? 'b-red' : 'b-amber');
  const detailRisk = detail ? risks.find(r => r.id === detail) : null;

  const addRisk = (data) => {
    const id = 'r' + Date.now();
    const code = (PROJECTS.find(p => p.name === data.project) || {}).code || 'PY-118';
    setRisks(rs => [{ id, code, statusTag: statusTag(data.status, data.prob * data.impact), ...data }, ...rs]);
    if (window.PYToast) window.PYToast('Risco registado · ' + data.title);
  };
  const setStatus = (id, status) => {
    setRisks(rs => rs.map(r => r.id === id ? { ...r, status, statusTag: statusTag(status, sev(r.prob, r.impact)) } : r));
    if (window.PYToast) window.PYToast('Estado atualizado · ' + status);
  };

  const criticos = risks.filter(r => sev(r.prob, r.impact) >= 15).length;
  const abertos = risks.filter(r => r.status === 'Aberto').length;
  const monitorizados = risks.filter(r => r.status === 'Monitorizado').length;
  const mitigados = risks.filter(r => r.status === 'Mitigado').length;
  const extraN = (fStatus ? 1 : 0) + (fCat ? 1 : 0) + (fSev ? 1 : 0);
  const cats = [...new Set(risks.map(r => r.cat))];
  const tableList = risks.filter(r => (!fSev || sev(r.prob, r.impact) >= 15) && (!fStatus || r.status === fStatus) && (!fCat || r.cat === fCat));

  // matrix cell colour by severity
  const cellColor = (p, i) => {
    const s = sev(p, i);
    if (s >= 15) return '#d6515122';
    if (s >= 8) return '#e0922a22';
    if (s >= 4) return '#caa31a1c';
    return '#1f9d6b1a';
  };
  const cellBorder = (p, i) => {
    const s = sev(p, i);
    if (s >= 15) return '#d6515140';
    if (s >= 8) return '#e0922a40';
    if (s >= 4) return '#caa31a35';
    return '#1f9d6b30';
  };

  return (
    <div className="content">
      <PageHead
        title="Riscos & bloqueios"
        sub="Registo de riscos com probabilidade, impacto e plano de mitigação"
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => window.PYToast && window.PYToast('Exportação iniciada · riscos.csv')}><Icon name="download" size={16} /> Exportar registo</button>
          <button className="btn btn-primary" onClick={() => setNovo(true)}><Icon name="plus" size={16} /> Registar risco</button>
        </React.Fragment>}
      />

      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        <MiniSummary icon="alert" tone="danger" n={String(criticos)} l="Riscos críticos" active={fSev} onClick={() => setFSev(v => !v)} />
        <MiniSummary icon="flag" tone="warning" n={String(abertos)} l="Riscos abertos" active={fStatus === 'Aberto'} onClick={() => setFStatus(s => s === 'Aberto' ? '' : 'Aberto')} />
        <MiniSummary icon="eye" tone="info" n={String(monitorizados)} l="Monitorizados" active={fStatus === 'Monitorizado'} onClick={() => setFStatus(s => s === 'Monitorizado' ? '' : 'Monitorizado')} />
        <MiniSummary icon="check" tone="success" n={String(mitigados)} l="Mitigados" active={fStatus === 'Mitigado'} onClick={() => setFStatus(s => s === 'Mitigado' ? '' : 'Mitigado')} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.3fr', alignItems: 'start', marginBottom: 22 }}>
        {/* matrix */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Matriz de risco</h3><span className="sub">Probabilidade × Impacto</span></div></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Probabilidade →</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {[5, 4, 3, 2, 1].map(p => (
                  [1, 2, 3, 4, 5].map(im => {
                    const here = risks.filter(r => r.prob === p && r.impact === im);
                    return (
                      <div key={p + '-' + im} style={{
                        aspectRatio: '1', borderRadius: 9, background: cellColor(p, im), border: '1px solid ' + cellBorder(p, im),
                        display: 'grid', placeItems: 'center', position: 'relative',
                      }}>
                        {here.map(r => (
                          <div key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                            onClick={() => setDetail(r.id)} title={r.title}
                            style={{ width: 30, height: 30, borderRadius: 99, background: sevInfo(sev(p, im))[1], color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: hover === r.id ? '0 0 0 4px ' + sevInfo(sev(p, im))[1] + '33' : 'var(--sh-sm)', transform: hover === r.id ? 'scale(1.12)' : 'none', transition: 'all .15s', border: '2px solid #fff' }}>
                            {r.code.split('-')[1].slice(1)}
                          </div>
                        ))}
                      </div>
                    );
                  })
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 7 }}>
                {[1, 2, 3, 4, 5].map(n => <div key={n} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)' }}>{n}</div>)}
              </div>
              <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 5 }}>Impacto →</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
            {[['Baixo', 'var(--success)'], ['Moderado', '#caa31a'], ['Elevado', 'var(--warning)'], ['Crítico', 'var(--danger)']].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>
                <span style={{ width: 11, height: 11, borderRadius: 4, background: l[1] }}></span>{l[0]}
              </div>
            ))}
          </div>
        </div>

        {/* top risks */}
        <div className="card card-pad">
          <div className="card-h"><div><h3>Riscos prioritários</h3><span className="sub">Ordenados por severidade</span></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[...risks].sort((a, b) => sev(b.prob, b.impact) - sev(a.prob, a.impact)).slice(0, 4).map(r => {
              const [lbl, col] = sevInfo(sev(r.prob, r.impact));
              return (
                <div key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                  onClick={() => setDetail(r.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, cursor: 'pointer', border: '1px solid ' + (hover === r.id ? col : 'var(--border)'), borderRadius: 'var(--r-sm)', transition: 'border-color .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: col + '1f', color: col, display: 'grid', placeItems: 'center', flexShrink: 0, fontWeight: 800, fontSize: 14 }}>{sev(r.prob, r.impact)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.title}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{r.project} · {r.cat}</div>
                  </div>
                  <Badge tag={r.statusTag} dot={false}>{lbl}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* register table */}
      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 6 }}><div className="card-h"><div><h3>Registo de riscos</h3><span className="sub">{tableList.length} de {risks.length} riscos · todos os projetos</span></div>
          <div style={{ position: 'relative' }} className="card-h more">
            <button className={'btn btn-ghost btn-sm' + (extraN ? ' ' : '')} style={extraN ? { borderColor: 'var(--accent)', color: 'var(--accent-700)' } : {}} onClick={() => setFltOpen(o => !o)}><Icon name="filter" size={14} /> Filtrar{extraN ? ' · ' + extraN : ''}</button>
            {fltOpen && (
              <React.Fragment>
                <div className="flt-backdrop" onClick={() => setFltOpen(false)}></div>
                <div className="flt-pop" style={{ left: 'auto', right: 0, minWidth: 210 }}>
                  <div className="ws-menu__lbl">Estado</div>
                  <button className={'flt-opt' + (!fStatus ? ' on' : '')} onClick={() => setFStatus('')}>Todos</button>
                  {['Aberto', 'Monitorizado', 'Mitigado', 'Fechado'].map(s => <button key={s} className={'flt-opt' + (fStatus === s ? ' on' : '')} onClick={() => setFStatus(s)}>{s}</button>)}
                  <div className="divider" style={{ margin: '6px 0' }}></div>
                  <div className="ws-menu__lbl">Categoria</div>
                  <button className={'flt-opt' + (!fCat ? ' on' : '')} onClick={() => setFCat('')}>Todas</button>
                  {cats.map(c => <button key={c} className={'flt-opt' + (fCat === c ? ' on' : '')} onClick={() => setFCat(c)}>{c}</button>)}
                  {extraN > 0 && <React.Fragment><div className="divider" style={{ margin: '6px 0' }}></div><button className="flt-opt" style={{ color: 'var(--danger)' }} onClick={() => { setFStatus(''); setFCat(''); setFSev(false); setFltOpen(false); }}>Limpar filtros</button></React.Fragment>}
                </div>
              </React.Fragment>
            )}
          </div>
        </div></div>
        <table className="tbl">
          <thead><tr><th>Risco</th><th>Projeto</th><th>Categoria</th><th>Prob.</th><th>Impacto</th><th>Severidade</th><th>Responsável</th><th>Estado</th></tr></thead>
          <tbody>
            {tableList.map(r => {
              const s = sev(r.prob, r.impact); const [lbl, col] = sevInfo(s);
              return (
                <tr key={r.id} className="row-click" onClick={() => setDetail(r.id)} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 700 }}>{r.title}</div>
                    <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{r.mitig}</div>
                  </td>
                  <td className="muted" style={{ fontWeight: 600 }}>{r.project}</td>
                  <td><Badge tag="b-gray" dot={false}>{r.cat}</Badge></td>
                  <td className="num" style={{ fontWeight: 700 }}>{r.prob}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{r.impact}</td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: col }}><span style={{ width: 26, height: 26, borderRadius: 7, background: col + '1f', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>{s}</span>{lbl}</span></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar p={r.owner} size={28} /><span style={{ fontWeight: 600, fontSize: 13 }}>{r.owner.name.split(' ')[0]}</span></div></td>
                  <td><Badge tag={r.statusTag}>{r.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tableList.length === 0 && <div className="empty" style={{ padding: '40px 0' }}><Icon name="alert" size={30} /><div style={{ marginTop: 10, fontWeight: 700, color: 'var(--text-2)' }}>Sem riscos com estes filtros</div></div>}
      </div>

      <NovoRiscoModal open={novo} onClose={() => setNovo(false)} onCreate={addRisk} sev={sev} sevInfo={sevInfo} />
      <RiscoDetailModal risk={detailRisk} onClose={() => setDetail(null)} go={go} sev={sev} sevInfo={sevInfo} onStatus={setStatus} />
    </div>
  );
}

const RISK_CATS = ['Licenciamento', 'Técnico', 'Financeiro', 'Recursos', 'Âmbito', 'Prazo', 'Segurança'];
const RISK_STATES = ['Aberto', 'Monitorizado', 'Mitigado', 'Fechado'];
function NovoRiscoModal({ open, onClose, onCreate, sev, sevInfo }) {
  const [f, setF] = useState({ title: '', project: PROJECTS[0].name, cat: 'Técnico', prob: 3, impact: 3, owner: 'ana', status: 'Aberto', mitig: '' });
  useEffect(() => { if (open) setF({ title: '', project: PROJECTS[0].name, cat: 'Técnico', prob: 3, impact: 3, owner: 'ana', status: 'Aberto', mitig: '' }); }, [open]);
  const set = (k, num) => (e) => setF(s => ({ ...s, [k]: num ? parseInt(e.target.value, 10) : e.target.value }));
  const s = sev(f.prob, f.impact); const [lbl, col] = sevInfo(s);
  const submit = () => { if (!f.title.trim()) return; onCreate({ ...f, owner: PEOPLE[f.owner] }); onClose(); };
  const peopleKeys = Object.keys(PEOPLE);
  return (
    <Modal open={open} onClose={onClose} title="Registar risco" sub="Adiciona um risco ao registo do projeto." width={580}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!f.title.trim()}><Icon name="plus" size={15} /> Registar</button>
      </React.Fragment>}>
      <Field label="Título do risco"><TextInput value={f.title} onChange={set('title')} placeholder="Ex.: Atraso na entrega de especialidades" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Projeto" half><SelectInput value={f.project} onChange={set('project')}>{PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}</SelectInput></Field>
        <Field label="Categoria" half><SelectInput value={f.cat} onChange={set('cat')}>{RISK_CATS.map(c => <option key={c}>{c}</option>)}</SelectInput></Field>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
        <Field label="Probabilidade (1–5)" half><SelectInput value={f.prob} onChange={set('prob', true)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</SelectInput></Field>
        <Field label="Impacto (1–5)" half><SelectInput value={f.impact} onChange={set('impact', true)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</SelectInput></Field>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--r-sm)', background: col + '14', border: '1px solid ' + col + '33', marginBottom: 16 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: col, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>{s}</span>
        <span style={{ fontWeight: 700, fontSize: 13.5, color: col }}>Severidade {lbl}</span>
        <span className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginLeft: 'auto' }}>prob × impacto</span>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Responsável" half><SelectInput value={f.owner} onChange={set('owner')}>{peopleKeys.map(k => <option key={k} value={k}>{PEOPLE[k].name}</option>)}</SelectInput></Field>
        <Field label="Estado inicial" half><SelectInput value={f.status} onChange={set('status')}>{RISK_STATES.map(st => <option key={st}>{st}</option>)}</SelectInput></Field>
      </div>
      <Field label="Plano de mitigação"><TextInput value={f.mitig} onChange={set('mitig')} placeholder="Como vai ser mitigado?" /></Field>
    </Modal>
  );
}

function RiscoDetailModal({ risk, onClose, go, sev, sevInfo, onStatus }) {
  if (!risk) return null;
  const s = sev(risk.prob, risk.impact); const [lbl, col] = sevInfo(s);
  const proj = PROJECTS.find(p => p.code === risk.code);
  return (
    <Modal open={!!risk} onClose={onClose} title={risk.title} sub={risk.project + ' · ' + risk.code + ' · ' + risk.cat} width={580}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
        {proj && <button className="btn btn-soft" onClick={() => { onClose(); go('project', proj); }}>Abrir projeto <Icon name="arrowRight" size={14} /></button>}
      </React.Fragment>}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}><div className="num" style={{ fontSize: 24, fontWeight: 800 }}>{risk.prob}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Probabilidade</div></div>
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}><div className="num" style={{ fontSize: 24, fontWeight: 800 }}>{risk.impact}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Impacto</div></div>
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', borderRadius: 'var(--r-sm)', background: col + '14', border: '1px solid ' + col + '33' }}><div className="num" style={{ fontSize: 24, fontWeight: 800, color: col }}>{s}</div><div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: col }}>{lbl}</div></div>
      </div>

      <div className="muted" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 8 }}>Plano de mitigação</div>
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: 14, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)', marginBottom: 18 }}>{risk.mitig}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Avatar p={risk.owner} size={34} />
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{risk.owner.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{risk.owner.role} · responsável pelo risco</div></div>
      </div>

      <div className="muted" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 10 }}>Estado</div>
      <div className="seg" style={{ width: '100%' }}>
        {RISK_STATES.map(st => <button key={st} className={risk.status === st ? 'active' : ''} style={{ flex: 1 }} onClick={() => onStatus(risk.id, st)}>{st}</button>)}
      </div>
    </Modal>
  );
}

Object.assign(window, { Risks });
