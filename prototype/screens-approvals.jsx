/* ProjectYard — Aprovações */

function Approvals({ go }) {
  const [sel, setSel] = useState(APPROVAL_QUEUE[0].id);
  const [filter, setFilter] = useState('Todos');
  const [decisions, setDecisions] = useState({});
  const [histOpen, setHistOpen] = useState(false);
  const [returnFor, setReturnFor] = useState(null);
  const types = ['Todos', 'Entregável', 'Pagamento', 'Change Request'];
  const list = filter === 'Todos' ? APPROVAL_QUEUE : APPROVAL_QUEUE.filter(a => a.type === filter);
  const current = APPROVAL_QUEUE.find(a => a.id === sel) || list[0];
  const pendCount = (t) => APPROVAL_QUEUE.filter(a => (t === 'Todos' || a.type === t) && !decisions[a.id]).length;

  const advance = (afterId) => {
    const next = APPROVAL_QUEUE.find(a => a.id !== afterId && !decisions[a.id]);
    if (next) setSel(next.id);
  };
  const decide = (id, status, reason) => {
    setDecisions(d => ({ ...d, [id]: { status, reason: reason || '', when: 'agora', item: APPROVAL_QUEUE.find(a => a.id === id) } }));
    const item = APPROVAL_QUEUE.find(a => a.id === id);
    if (window.PYToast) window.PYToast(status === 'aprovado' ? '“' + item.title + '” aprovado' : '“' + item.title + '” devolvido para alterações');
    setTimeout(() => advance(id), 350);
  };
  const submitReturn = (reason) => { if (returnFor) { decide(returnFor, 'devolvido', reason); setReturnFor(null); } };

  // KPIs = base + decisões desta sessão
  const dec = Object.values(decisions);
  const nApr = dec.filter(d => d.status === 'aprovado').length;
  const nDev = dec.filter(d => d.status === 'devolvido').length;
  const aguardar = Math.max(0, 4 - (nApr + nDev));
  const aprovadas = 12 + nApr;
  const devolvidas = 1 + nDev;

  return (
    <div className="content">
      <PageHead
        title="Aprovações"
        sub="Decisões pendentes sobre entregáveis, pagamentos e change requests"
        actions={<button className="btn btn-ghost" onClick={() => setHistOpen(true)}><Icon name="clock" size={16} /> Histórico{dec.length ? ' · ' + dec.length : ''}</button>}
      />

      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        <MiniSummary icon="shield" tone="warning" n={String(aguardar)} l="A aguardar decisão" />
        <MiniSummary icon="check" tone="success" n={String(aprovadas)} l="Aprovadas (semana)" />
        <MiniSummary icon="x" tone="danger" n={String(devolvidas)} l="Devolvidas" />
        <MiniSummary icon="clock" tone="info" n="6h" l="Tempo médio resposta" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {types.map(t => { const n = pendCount(t); return <button key={t} className={'chip' + (filter === t ? ' active' : '')} onClick={() => setFilter(t)}>{t}{n ? ' · ' + n : ''}</button>; })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.25fr', alignItems: 'start' }}>
        {/* queue list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {list.map(a => { const d = decisions[a.id]; return (
            <button key={a.id} onClick={() => setSel(a.id)} className="card card-pad"
              style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 13, alignItems: 'flex-start',
                borderColor: sel === a.id ? 'var(--accent)' : 'var(--border)',
                boxShadow: sel === a.id ? '0 0 0 3px var(--accent-soft)' : 'var(--sh-sm)', padding: 16, opacity: d ? 0.72 : 1 }}>
              <Avatar p={a.who} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <Badge tag={a.tag} dot={false}>{a.type}</Badge>
                  {a.prio === 'Alta' && !d && <span className="badge b-red" style={{ padding: '2px 7px', fontSize: 10.5 }}>Urgente</span>}
                  {d && d.status === 'aprovado' && <span className="badge b-green" style={{ padding: '2px 7px', fontSize: 10.5 }}>Aprovado</span>}
                  {d && d.status === 'devolvido' && <span className="badge b-amber" style={{ padding: '2px 7px', fontSize: 10.5 }}>Devolvido</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{a.title}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 3 }}>{a.project} · {a.code} · {a.time}</div>
              </div>
              {a.amount && <div className="num" style={{ fontWeight: 700, fontSize: 14 }}>{eur(a.amount)}</div>}
            </button>
          ); })}
        </div>

        {/* detail */}
        {current && (
          <div className="card card-pad" style={{ position: 'sticky', top: 92 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={current.type === 'Pagamento' ? 'euro' : current.type === 'Change Request' ? 'flag' : 'layers'} size={23} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{current.title}</h3>
                <div className="muted-3" style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>{current.project} · {current.code}</div>
              </div>
              <Badge tag={current.tag} dot={false}>{current.type}</Badge>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: 14, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)', marginBottom: 18 }}>
              {current.note}
            </div>

            {current.amount && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', marginBottom: 18 }}>
                <span className="muted" style={{ fontWeight: 600, fontSize: 13.5 }}>Valor a aprovar</span>
                <span className="num" style={{ fontWeight: 700, fontSize: 20 }}>{eur(current.amount)}</span>
              </div>
            )}

            <div className="card-h" style={{ marginBottom: 14 }}><div><h3 style={{ fontSize: 14.5 }}>Cadeia de aprovação</h3></div></div>
            <div className="tl" style={{ marginBottom: 20 }}>
              {current.steps.map((s, i) => (
                <div className="tl-item" key={i}>
                  <div className={'tl-dot' + (s.state === 'done' ? ' on' : '')} style={s.state === 'current' ? { borderColor: 'var(--accent)', background: 'var(--accent)', color: 'var(--navy-700)' } : {}}>
                    {s.state === 'done' ? <Icon name="check" size={11} /> : s.state === 'current' ? <Icon name="clock" size={11} /> : null}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Avatar p={s.who} size={26} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.who.name} <span className="muted-3" style={{ fontWeight: 600 }}>· {s.role}</span></div>
                      <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{s.state === 'done' ? 'Aprovado ' + s.when : s.state === 'current' ? s.when : 'Por iniciar'}</div>
                    </div>
                    {s.state === 'current' && <span className="badge b-gold" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: 10.5 }}>A decidir</span>}
                  </div>
                </div>
              ))}
            </div>

            <ApprovalActions current={current} go={go} decision={decisions[current.id]} onApprove={() => decide(current.id, 'aprovado')} onReturn={() => setReturnFor(current.id)} />
          </div>
        )}
      </div>

      <ApprovalHistoryModal open={histOpen} onClose={() => setHistOpen(false)} decisions={decisions} />
      <ReturnReasonModal item={returnFor ? APPROVAL_QUEUE.find(a => a.id === returnFor) : null} onClose={() => setReturnFor(null)} onSubmit={submitReturn} />
    </div>
  );
}

/* ---------------- Ações de aprovação + fluxo SMS → pagamento ---------------- */
function MiniBubble({ out, text }) {
  return <div style={{ alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '10px 14px', borderRadius: out ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: out ? 'var(--grad)' : 'var(--surface)', color: out ? '#fff' : 'var(--text)', border: out ? 'none' : '1px solid var(--border)', fontSize: 13, fontWeight: out ? 500 : 700, boxShadow: 'var(--sh-sm)', lineHeight: 1.5 }}>{text}</div>;
}

function PaymentSmsFlow({ current, go, onApprove, onReturn }) {
  const [phase, setPhase] = useState('idle');
  const step = current.steps.find(s => s.state === 'current');
  const who = step ? step.who : { name: current.project };
  useEffect(() => {
    if (phase !== 'sending') return;
    const id = setTimeout(() => { setPhase('done'); if (window.PYToast) window.PYToast(who.name + ' respondeu APROVO por SMS'); }, 1700);
    return () => clearTimeout(id);
  }, [phase]);
  const send = () => { setPhase('sending'); if (window.PYToast) window.PYToast('SMS enviado a ' + who.name); };
  const unlock = () => { onApprove(); go('payments'); if (window.PYToast) window.PYToast('Pagamento de ' + eur(current.amount) + ' desbloqueado'); };
  return (
    <React.Fragment>
      <div className="divider"></div>
      {phase === 'idle' ? (
        <React.Fragment>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="sms" size={16} /> Aguarda confirmação de <b style={{ marginLeft: 2 }}>{who.name}</b> por SMS.</div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={send}><Icon name="send" size={16} /> Pedir aprovação por SMS</button>
            <button className="btn btn-ghost" onClick={onApprove}><Icon name="check" size={16} /> Aprovar</button>
            <button className="btn btn-ghost" onClick={onReturn}><Icon name="x" size={16} /> Devolver</button>
          </div>
        </React.Fragment>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MiniBubble out text={'O entregável aguarda a vossa aprovação. Responda APROVO ou REJEITO. Valor: ' + eur(current.amount) + '.'} />
          {phase === 'sending' && <div style={{ alignSelf: 'flex-start', fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}><span className="spin"></span> A aguardar resposta de {who.name}…</div>}
          {phase === 'done' && <MiniBubble text="APROVO" />}
          {phase === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--success-soft)', borderRadius: 'var(--r-sm)', marginTop: 4 }}>
              <Icon name="check" size={18} style={{ color: 'var(--success)' }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>Aprovado por SMS · pagamento desbloqueado</div>
              <button className="btn btn-primary btn-sm" onClick={unlock}>Registar pagamento <Icon name="arrowRight" size={14} /></button>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

function ApprovalActions({ current, go, decision, onApprove, onReturn }) {
  if (decision) {
    const dev = decision.status === 'devolvido';
    return (
      <React.Fragment>
        <div className="divider"></div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: dev ? 'var(--warning-soft)' : 'var(--success-soft)', borderRadius: 'var(--r-sm)' }}>
          <Icon name={dev ? 'x' : 'check'} size={18} style={{ color: dev ? 'var(--warning)' : 'var(--success)', flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: dev ? 'var(--warning)' : 'var(--success)' }}>{dev ? 'Devolvido para alterações' : 'Aprovado'} · registado com data, hora e autor</div>
            {dev && decision.reason && <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>Motivo: {decision.reason}</div>}
          </div>
          {current.type === 'Pagamento' && !dev && <button className="btn btn-soft btn-sm" onClick={() => go('payments')}>Financeiro <Icon name="arrowRight" size={14} /></button>}
        </div>
      </React.Fragment>
    );
  }
  if (current.type === 'Pagamento') return <PaymentSmsFlow key={current.id} current={current} go={go} onApprove={onApprove} onReturn={onReturn} />;
  return (
    <React.Fragment>
      <div className="divider"></div>
      <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onApprove}><Icon name="check" size={17} /> Aprovar</button>
        <button className="btn btn-ghost" onClick={onReturn}><Icon name="x" size={16} /> Devolver</button>
        <button className="btn btn-ghost btn-icon" title="Aprovar por SMS" onClick={() => go('sms')}><Icon name="sms" size={17} /></button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12.5, color: 'var(--text-3)', fontWeight: 600 }}>
        <Icon name="lock" size={14} /> Decisão registada com data, hora e autor para auditoria.
      </div>
    </React.Fragment>
  );
}

const RETURN_REASONS = ['Falta documentação', 'Erros técnicos a corrigir', 'Não cumpre o briefing', 'Aguarda parecer externo', 'Outro motivo'];
function ReturnReasonModal({ item, onClose, onSubmit }) {
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [note, setNote] = useState('');
  useEffect(() => { if (item) { setReason(RETURN_REASONS[0]); setNote(''); } }, [item]);
  if (!item) return null;
  const finalReason = reason === 'Outro motivo' ? (note.trim() || 'Outro motivo') : (note.trim() ? reason + ' — ' + note.trim() : reason);
  return (
    <Modal open={!!item} onClose={onClose} title="Devolver para alterações" sub={item.title} width={500}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => onSubmit(finalReason)}><Icon name="x" size={15} /> Devolver</button>
      </React.Fragment>}>
      <Field label="Motivo da devolução"><SelectInput value={reason} onChange={(e) => setReason(e.target.value)}>
        {RETURN_REASONS.map(r => <option key={r}>{r}</option>)}
      </SelectInput></Field>
      <Field label={'Nota para ' + item.who.name + (reason === 'Outro motivo' ? '' : ' (opcional)')}><TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="Detalhe o que precisa de ser corrigido…" /></Field>
    </Modal>
  );
}

function ApprovalHistoryModal({ open, onClose, decisions }) {
  const items = Object.values(decisions);
  return (
    <Modal open={open} onClose={onClose} title="Histórico de decisões" sub={items.length ? items.length + (items.length > 1 ? ' decisões' : ' decisão') + ' nesta sessão' : 'Sem decisões ainda'} width={540}
      footer={<button className="btn btn-primary" onClick={onClose}>Fechar</button>}>
      {items.length === 0 ? (
        <div className="empty" style={{ padding: '36px 0' }}><Icon name="clock" size={30} /><div style={{ marginTop: 10, fontWeight: 700, color: 'var(--text-2)' }}>Ainda sem decisões</div><div style={{ marginTop: 4 }}>As aprovações e devoluções que registar aparecem aqui.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((d, i) => { const dev = d.status === 'devolvido'; return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', background: dev ? 'var(--warning-soft)' : 'var(--success-soft)', color: dev ? 'var(--warning)' : 'var(--success)' }}><Icon name={dev ? 'x' : 'check'} size={17} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{d.item.title}</div>
                <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{d.item.project} · {d.item.code}{dev && d.reason ? ' · ' + d.reason : ''}</div>
              </div>
              <span className={'badge ' + (dev ? 'b-amber' : 'b-green')} style={{ flexShrink: 0 }}>{dev ? 'Devolvido' : 'Aprovado'}</span>
            </div>
          ); })}
        </div>
      )}
    </Modal>
  );
}

Object.assign(window, { Approvals });
