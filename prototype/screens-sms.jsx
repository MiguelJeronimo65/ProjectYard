/* ProjectYard — SMS bidirecional */

function SMSScreen({ go }) {
  const [sel, setSel] = useState(SMS_THREADS[0].id);
  const [draft, setDraft] = useState('');
  const [extra, setExtra] = useState({});
  const thread = SMS_THREADS.find(t => t.id === sel);
  const msgs = [...thread.msgs, ...(extra[sel] || [])];
  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim(); setDraft('');
    setExtra(e => ({ ...e, [sel]: [...(e[sel] || []), { dir: 'out', text, time: 'agora', auto: false }] }));
    if (window.PYToast) window.PYToast('SMS enviado a ' + thread.name);
    if (/aprov|aprovo|aprovação|rejeito/i.test(text)) {
      setTimeout(() => setExtra(e => ({ ...e, [sel]: [...(e[sel] || []), { dir: 'in', text: 'APROVO', time: 'agora' }] })), 1700);
    }
  };

  return (
    <div className="content">
      <PageHead
        title="SMS"
        sub="Comunicação bidirecional com clientes e entidades · aprovações por resposta"
        actions={<React.Fragment>
          <button className="btn btn-ghost"><Icon name="settings" size={16} /> Templates</button>
          <button className="btn btn-primary"><Icon name="plus" size={16} /> Nova mensagem</button>
        </React.Fragment>}
      />

      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        <MiniSummary icon="send" tone="info" n="318" l="Enviadas (mês)" />
        <MiniSummary icon="check" tone="success" n="99%" l="Taxa de entrega" />
        <MiniSummary icon="message" tone="warning" n="47" l="Respostas inbound" />
        <MiniSummary icon="spark" tone="success" n="682" l="Créditos restantes" />
      </div>

      <div className="card" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px 1fr', height: 560 }}>
        {/* thread list */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
            <div className="search" style={{ width: '100%' }}><Icon name="search" size={17} /><input placeholder="Procurar conversa…" /></div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {SMS_THREADS.map(t => (
              <button key={t.id} onClick={() => setSel(t.id)} style={{
                width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', border: 'none',
                borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer',
                background: sel === t.id ? 'var(--accent-soft)' : 'transparent',
              }}>
                <Avatar p={{ initials: t.initials, color: t.color }} size={42} sq />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                    {t.unread > 0 && <span className="badge-count" style={{ position: 'static' }}>{t.unread}</span>}
                  </div>
                  <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.last}</div>
                  <div className="muted-3" style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{t.project}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-2)' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)' }}>
            <Avatar p={{ initials: thread.initials, color: thread.color }} size={38} sq />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{thread.name}</div>
              <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{thread.phone} · {thread.project}</div>
            </div>
            <button className="icon-btn" style={{ width: 36, height: 36 }}><Icon name="user" size={17} /></button>
            <button className="icon-btn" style={{ width: 36, height: 36 }}><Icon name="more" size={17} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center' }}><span className="badge b-gray" style={{ fontSize: 11 }}>Conversa associada a {thread.project}</span></div>
            {msgs.map((m, i) => <Bubble key={i} m={m} color={thread.color} />)}
          </div>

          {/* templates + composer */}
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: 14 }}>
            <div style={{ display: 'flex', gap: 7, marginBottom: 11, flexWrap: 'wrap' }}>
              {SMS_TEMPLATES.map((tp, i) => (
                <button key={i} className="chip" style={{ fontSize: 12 }} onClick={() => setDraft(tp.body)}>
                  <Icon name="fileText" size={13} /> {tp.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div className="fld__box" style={{ flex: 1, alignItems: 'flex-end', padding: '0 14px' }}>
                <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2} placeholder="Escreve uma mensagem…"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none', padding: '12px 0', fontSize: 14, fontFamily: 'inherit', color: 'var(--text)' }} />
                <span className="muted-3" style={{ fontSize: 11, fontWeight: 600, paddingBottom: 12 }}>{draft.length}/160</span>
              </div>
              <button className="btn btn-primary" style={{ height: 48, padding: '0 18px' }} onClick={send}><Icon name="send" size={17} /> Enviar</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>
              <Icon name="spark" size={13} /> Respostas com palavras-chave (APROVO, REJEITO) atualizam aprovações automaticamente.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m, color }) {
  const out = m.dir === 'out';
  return (
    <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '74%' }}>
        <div style={{
          padding: '11px 15px', borderRadius: out ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: out ? 'var(--grad)' : 'var(--surface)', color: out ? '#fff' : 'var(--text)',
          border: out ? 'none' : '1px solid var(--border)', fontSize: 13.5, lineHeight: 1.5,
          boxShadow: 'var(--sh-sm)', fontWeight: m.text.length < 12 && !out ? 700 : 500,
        }}>{m.text}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, justifyContent: out ? 'flex-end' : 'flex-start', paddingInline: 4 }}>
          {m.auto && <span className="badge b-violet" style={{ padding: '1px 7px', fontSize: 10 }}>Auto</span>}
          <span className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{m.time}</span>
          {out && <Icon name="check" size={13} style={{ color: 'var(--success)' }} />}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SMSScreen });
