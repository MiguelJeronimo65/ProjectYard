/* ProjectYard — Conformidade RGPD do Chat (Superadmin / DPO de plataforma)
   Minimização de dados: por omissão só metadados (volume/atividade).
   O acesso a conteúdo privado exige base legal + justificação e fica
   registado em ChatComplianceAccessLog. */

let _ccalSeq = 49; // próximo nº de registo (último seed = 0048)
const nextCcalRef = () => 'CCAL-2026-' + String(_ccalSeq++).padStart(4, '0');
const nowStamp = () => {
  const d = new Date();
  const M = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
};
const convoLabel = (c) => c.type === 'channel' ? '#' + c.name : (c.name + ' · ' + c.count + ' participantes');

/* Conteúdo simulado revelado após acesso justificado (gerado a partir dos metadados) */
function complianceThread(c) {
  const P = c.participants;
  const a = P[0], b = P[1] || P[0];
  const T = c.topic;
  const raw = [
    { from: a, text: 'Bom dia. Atualizei os elementos sobre ' + T + ' e carreguei a versão na base documental.' },
    { from: b, text: 'Recebido. Vejo ainda hoje e dou retorno.' },
    { from: b, text: 'Há um ponto que convém clarificar antes de avançarmos para a fase seguinte.' },
    { from: a, text: 'Sem problema — marco uma chamada rápida para alinharmos os detalhes.' },
    { from: b, text: 'Combinado. Confirmo a disponibilidade ao início da tarde.' },
    { from: a, text: 'Perfeito. Fica fechado este ponto, obrigado pela rapidez.' },
  ];
  let h = 9, m = 12;
  return raw.map((r, i) => {
    m += 7 + i; if (m >= 60) { m -= 60; h++; }
    return { id: 'cm' + i, from: r.from, text: r.text, time: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') };
  });
}

/* Ícone da conversa — canal (#) ou conversa direta (cadeado) */
function ConvoIcon({ c, size = 38 }) {
  if (c.type === 'channel')
    return <div style={{ width: size, height: size, borderRadius: 11, background: c.color + '22', color: c.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: size * 0.46, flexShrink: 0, fontFamily: 'var(--font-display)' }}>#</div>;
  return <div style={{ width: size, height: size, borderRadius: 11, background: 'var(--surface-3)', color: 'var(--text-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="lock" size={size * 0.42} /></div>;
}

function ChatCompliance({ go }) {
  const [tab, setTab] = useState('Metadados');
  const [ws, setWs] = useState('Todos');
  const [query, setQuery] = useState('');
  const [accessFor, setAccessFor] = useState(null);   // conversa a pedir acesso
  const [viewing, setViewing] = useState(null);        // { convo, entry } conteúdo revelado
  const [log, setLog] = useState(COMPLIANCE_LOG);

  const tenants = ['Todos', ...Array.from(new Set(COMPLIANCE_CONVOS.map(c => c.tenant)))];
  const channels = COMPLIANCE_CONVOS.filter(c => c.type === 'channel').length;
  const directs = COMPLIANCE_CONVOS.length - channels;
  const totalMsgs = COMPLIANCE_CONVOS.reduce((a, c) => a + c.msgs30, 0);
  const holds = COMPLIANCE_CONVOS.filter(c => c.hold).length;
  const activeAccess = log.filter(l => l.state === 'Ativo').length;

  const rows = COMPLIANCE_CONVOS.filter(c => {
    if (ws !== 'Todos' && c.tenant !== ws) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!((c.tenant + ' ' + c.name + ' ' + (c.project || '')).toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a, b) => a.activitySort - b.activitySort);

  const grantAccess = (convo, baseId, reason) => {
    const base = RGPD_BASES.find(x => x.id === baseId);
    const entry = {
      id: 'l' + Date.now(), ref: nextCcalRef(), when: nowStamp(), admin: ME, tenant: convo.tenant,
      target: convoLabel(convo), base: base.label, baseRef: base.ref, reason,
      scope: 'Conteúdo · ' + convo.msgs30 + ' mensagens', state: 'Ativo',
    };
    setLog(prev => [entry, ...prev]);
    setAccessFor(null);
    setViewing({ convo, entry });
    if (window.PYToast) window.PYToast('Acesso registado · ' + entry.ref);
  };

  return (
    <div className="content">
      <style>{`
        .cmp-redact { display:inline-flex; gap:3px; align-items:center; }
        .cmp-redact i { display:block; height:8px; border-radius:3px; background:repeating-linear-gradient(90deg,var(--text-3) 0 5px,transparent 5px 8px); opacity:.4; }
        .cmp-lock-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 11px; border-radius:var(--r-pill); background:var(--surface-3); color:var(--text-2); font-size:12px; font-weight:700; white-space:nowrap; }
        .cmp-filter { border:none; background:transparent; padding:7px 13px; border-radius:var(--r-pill); font-weight:700; font-size:13px; color:var(--text-2); cursor:pointer; white-space:nowrap; }
        .cmp-filter.on { background:var(--navy); color:#fff; }
        .cmp-tab { border:none; background:transparent; padding:12px 16px; font-weight:700; font-size:14px; cursor:pointer; margin-bottom:-1px; }
        .cmp-reveal { display:flex; flex-direction:column; gap:10px; }
        .cmp-bubble { max-width:78%; padding:10px 14px; border-radius:14px; font-size:13.5px; line-height:1.5; }
      `}</style>

      <PageHead crumb={['Plataforma', 'Conformidade RGPD']}
        title="Conformidade RGPD — Chat"
        sub="Supervisão transversal das comunicações · princípio da minimização de dados"
        actions={<button className="btn btn-ghost" onClick={() => window.PYToast && window.PYToast('Registo exportado (CSV)')}><Icon name="download" size={16} /> Exportar registo</button>} />

      {/* Princípio de minimização */}
      <div className="card card-pad" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 22, background: 'var(--info-soft)', borderColor: 'color-mix(in srgb, var(--info) 22%, transparent)' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--info)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="shield" size={24} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>Por omissão, só metadados.</div>
          <div className="muted" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, marginTop: 3, maxWidth: 760 }}>
            O conteúdo das mensagens é privado e cifrado em repouso — nem a plataforma o lê por rotina. Só ficam visíveis volume e atividade. O acesso a conteúdo exige <b>base legal</b> e <b>justificação</b>, e é registado de forma imutável no <b>ChatComplianceAccessLog</b>.
          </div>
        </div>
        <span className="cmp-lock-chip" style={{ background: 'var(--surface)', flexShrink: 0 }}><Icon name="lock" size={13} /> Cifrado em repouso</span>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        <Stat icon="message" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={COMPLIANCE_CONVOS.length} label="Conversas monitorizadas" foot={`${channels} canais · ${directs} diretas`} />
        <Stat icon="layers" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={fmt(totalMsgs)} label="Mensagens (30 dias)" foot="Volume agregado · sem conteúdo" />
        <Stat icon="eye" iconBg="var(--info-soft)" iconColor="var(--info)" value={log.length} label="Acessos a conteúdo" foot={`Trimestre · ${activeAccess} ativo${activeAccess === 1 ? '' : 's'}`} />
        <Stat icon="lock" iconBg="var(--warning-soft)" iconColor="var(--warning)" value={holds} label="Retenção suspensa" foot="Preservação de prova / litígio" />
      </div>

      <div className="card card-pad">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
          {['Metadados', 'Registo de acessos'].map(tt => (
            <button key={tt} className="cmp-tab" onClick={() => setTab(tt)}
              style={{ color: tab === tt ? 'var(--primary-700)' : 'var(--text-2)', borderBottom: '2px solid ' + (tab === tt ? 'var(--accent)' : 'transparent') }}>
              {tt}{tt === 'Registo de acessos' && <span className="badge b-navy" style={{ marginLeft: 8, padding: '1px 7px', fontSize: 10.5 }}>{log.length}</span>}
            </button>
          ))}
        </div>

        {tab === 'Metadados' ? (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                {tenants.map(t => <button key={t} className={'cmp-filter' + (ws === t ? ' on' : '')} onClick={() => setWs(t)}>{t}</button>)}
              </div>
              <div className="search" style={{ width: 240, padding: '8px 13px' }}><Icon name="search" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Procurar conversa…" /></div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ minWidth: 920 }}>
                <thead><tr>
                  <th>Workspace</th><th>Conversa</th><th>Participantes</th>
                  <th style={{ textAlign: 'right' }}>Atividade (30 d)</th>
                  <th>Conteúdo</th><th>Última atividade</th><th></th>
                </tr></thead>
                <tbody>
                  {rows.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar p={{ initials: c.tinit, color: c.tcolor }} size={30} sq />
                          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.tenant}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <ConvoIcon c={c} size={38} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>
                              {c.type === 'channel' ? '#' + c.name : 'Conversa direta'}
                              {c.flagged && <span className="badge b-red" style={{ padding: '1px 7px', fontSize: 10 }}><Icon name="flag" size={9} /> Sinalizada</span>}
                            </div>
                            <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                              {c.type === 'channel' ? c.project : 'Privada'}
                              <span style={{ opacity: .5 }}>·</span>
                              {c.hold
                                ? <span style={{ color: 'var(--warning)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="lock" size={10} /> Legal hold</span>
                                : <span>Retém {c.retention.toLowerCase()}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <AvStack people={c.participants} max={3} size={26} />
                          <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 700 }}>{c.count}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="num" style={{ fontWeight: 700, fontSize: 14.5 }}>{fmt(c.msgs30)}</div>
                        <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{c.attachments} anexo{c.attachments === 1 ? '' : 's'}</div>
                      </td>
                      <td>
                        <span className="cmp-lock-chip"><Icon name="lock" size={12} /> Protegido</span>
                      </td>
                      <td><span className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>{c.lastActivity}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-soft btn-sm" onClick={() => setAccessFor(c)}><Icon name="eye" size={14} /> Aceder</button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={7}><div className="empty" style={{ padding: '32px 20px' }}><Icon name="search" size={26} /><div style={{ marginTop: 8, fontWeight: 700, color: 'var(--text-2)' }}>Sem conversas para este filtro.</div></div></td></tr>}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Icon name="shield" size={14} style={{ color: 'var(--info)' }} /> Trilho de auditoria imutável de todos os acessos a conteúdo privado. Conservado 5 anos.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ minWidth: 960 }}>
                <thead><tr>
                  <th>Registo</th><th>Quando</th><th>Acedido por</th><th>Workspace · conversa</th>
                  <th>Base legal</th><th>Âmbito</th><th>Estado</th>
                </tr></thead>
                <tbody>
                  {log.map(l => (
                    <tr key={l.id}>
                      <td><span className="num" style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-2)' }}>{l.ref}</span></td>
                      <td><span style={{ fontWeight: 600, fontSize: 13 }}>{l.when}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <Avatar p={l.admin} size={30} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{l.admin.name}</div>
                            <div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{l.admin.role.includes('DPO') ? 'DPO' : 'Superadmin'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{l.tenant}</div>
                        <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{l.target}</div>
                      </td>
                      <td style={{ maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, fontSize: 12.5 }}>{l.base}</div>
                        <div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{l.baseRef}</div>
                      </td>
                      <td><span className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{l.scope}</span></td>
                      <td><Badge tag={l.state === 'Ativo' ? 'b-amber' : 'b-green'} dot={false}>{l.state}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 18, display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name="shield" size={14} /> Acesso de plataforma · todas as ações nesta área são auditadas e os titulares podem ser notificados nos termos do RGPD.
      </div>

      <AccessRequestModal convo={accessFor} onClose={() => setAccessFor(null)} onGrant={grantAccess} />
      <ContentRevealModal data={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

/* Modal — pedir acesso a conteúdo privado (gate de base legal + justificação) */
function AccessRequestModal({ convo, onClose, onGrant }) {
  const [base, setBase] = useState('');
  const [reason, setReason] = useState('');
  const [ack, setAck] = useState(false);
  useEffect(() => { if (convo) { setBase(''); setReason(''); setAck(false); } }, [convo]);
  if (!convo) return null;
  const ready = base && reason.trim().length >= 12 && ack;
  const baseObj = RGPD_BASES.find(b => b.id === base);

  return (
    <Modal open={!!convo} onClose={onClose} width={540}
      title="Aceder a conteúdo privado"
      sub="Esta ação fica registada no ChatComplianceAccessLog"
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={!ready} onClick={() => onGrant(convo, base, reason.trim())}><Icon name="eye" size={15} /> Confirmar e registar acesso</button>
      </React.Fragment>}>

      {/* aviso */}
      <div style={{ display: 'flex', gap: 12, padding: 13, borderRadius: 'var(--r-sm)', background: 'var(--warning-soft)', marginBottom: 18 }}>
        <Icon name="alert" size={19} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.55, color: 'var(--text-2)' }}>
          Está prestes a aceder a comunicações privadas de outro workspace. O acesso é proporcional, limitado ao necessário e <b>auditável</b>. O uso indevido tem consequências disciplinares e legais.
        </div>
      </div>

      {/* alvo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', marginBottom: 18 }}>
        <ConvoIcon c={convo} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{convo.type === 'channel' ? '#' + convo.name : 'Conversa direta'}</div>
          <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{convo.tenant} · {convo.count} participantes · {fmt(convo.msgs30)} mensagens (30 d)</div>
        </div>
        <AvStack people={convo.participants} max={3} size={26} />
      </div>

      <Field label="Base legal do acesso">
        <SelectInput value={base} onChange={e => setBase(e.target.value)}>
          <option value="" disabled>Selecionar fundamento…</option>
          {RGPD_BASES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
        </SelectInput>
        {baseObj && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="shield" size={12} /> {baseObj.ref}</div>}
      </Field>

      <Field label="Justificação" hint="Mínimo de 12 caracteres · fica anexada ao registo de auditoria">
        <div className="fld__box" style={{ alignItems: 'stretch', padding: '11px 13px' }}>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
            placeholder="Descreva o motivo concreto e o âmbito do acesso (ex.: pedido, processo, período abrangido)…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'vertical', fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', lineHeight: 1.5 }} />
        </div>
      </Field>

      <button onClick={() => setAck(a => !a)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0' }}>
        <span style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid ' + (ack ? 'var(--accent)' : 'var(--border-2)'), background: ack ? 'var(--accent)' : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>{ack && <Icon name="check" size={13} style={{ color: '#fff' }} />}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.5 }}>Confirmo que o acesso é necessário e proporcional ao fundamento indicado e autorizo o seu registo no trilho de auditoria.</span>
      </button>
    </Modal>
  );
}

/* Modal — conteúdo revelado, com cabeçalho de auditoria persistente */
function ContentRevealModal({ data, onClose }) {
  if (!data) return null;
  const { convo, entry } = data;
  const thread = complianceThread(convo);

  return (
    <Modal open={!!data} onClose={onClose} width={580} bare>
      {/* cabeçalho de auditoria */}
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '16px 22px', borderTopLeftRadius: 'var(--r)', borderTopRightRadius: 'var(--r)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.14)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="eye" size={18} style={{ color: 'var(--accent)' }} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>Conteúdo · {convo.type === 'channel' ? '#' + convo.name : 'conversa direta'}</div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: .8 }}>{convo.tenant} · acesso registado</div>
          </div>
          <button className="icon-btn" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff' }} onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 13 }}>
          <span className="cmp-lock-chip" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}><Icon name="shield" size={12} style={{ color: 'var(--accent)' }} /> {entry.ref}</span>
          <span className="cmp-lock-chip" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}>{entry.base}</span>
          <span className="cmp-lock-chip" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}>{entry.when}</span>
        </div>
      </div>

      {/* conteúdo */}
      <div style={{ padding: 22, maxHeight: 380, overflowY: 'auto', background: 'var(--surface-2)' }}>
        <div className="cmp-reveal">
          {thread.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
              <Avatar p={m.from} size={28} />
              <div>
                <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 3, paddingInline: 3 }}>{m.from.name} · {m.time}</div>
                <div className="cmp-bubble" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* rodapé legal */}
      <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderBottomLeftRadius: 'var(--r)', borderBottomRightRadius: 'var(--r)' }}>
        <Icon name="shield" size={15} style={{ color: 'var(--info)', flexShrink: 0 }} />
        <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, flex: 1, lineHeight: 1.5 }}>
          Este acesso ficou registado no ChatComplianceAccessLog e pode ser auditado. Os titulares dos dados podem ser notificados.
        </div>
        <button className="btn btn-primary btn-sm" onClick={onClose}>Concluir</button>
      </div>
    </Modal>
  );
}

Object.assign(window, { ChatCompliance });
