/* ProjectYard — Chat de equipa (módulo completo)
   Canais + DMs · isolado por workspace · envio em tempo real (simulado),
   indicador "a escrever…", não-lidas, anexos à base documental, pesquisa e presença. */

let _chatUid = 100;
const chatUid = () => 'm' + (++_chatUid);
const _hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const firstName = (p) => (p && p.name ? p.name.split(' ')[0] : '');

/* Respostas simuladas (entrega em tempo real via SignalR no backend) */
const CHAT_REPLIES = [
  'Perfeito, obrigado.', 'Combinado.', 'Vejo isso já a seguir.', 'Boa, faz sentido.',
  'Certo, trato disso hoje.', 'Confirmo e dou retorno ainda hoje.', 'Recebido. 👍',
];
const CHAT_EMOJI = ['👍', '❤️', '✅', '🎉', '👀', '🙌'];

/* Estado inicial — reconstruído a cada montagem para não partilhar arrays */
function buildChatThreads() {
  const P = PEOPLE;
  return [
    /* ---------- Canais (ligados a projeto) ---------- */
    {
      id: 'ch1', type: 'channel', name: 'marques-geral', project: 'Edifício Marquês', code: 'PY-118',
      color: '#6a5af9', members: [P.ana, P.rui, P.joana, P.miguel, P.pedro], unread: 0, lastTime: '10:02', pinned: true,
      msgs: [
        { id: chatUid(), dir: 'in', from: P.joana, text: 'Bom dia a todos. Carreguei a v2 do cálculo de estabilidade para aprovação.', time: '09:42', reactions: { '👍': ['Ana Moreira', 'Rui Cardoso'] } },
        { id: chatUid(), dir: 'in', from: P.rui, text: 'Vi os pormenores da cobertura — faltam as secções da platibanda.', time: '09:50' },
        { id: chatUid(), dir: 'out', text: 'Obrigado. Pedro, consegues fechar essas secções ainda hoje?', time: '09:54' },
        { id: chatUid(), dir: 'in', from: P.pedro, text: 'Sim, envio ao fim da tarde.', time: '09:58' },
        { id: chatUid(), dir: 'in', from: P.ana, text: 'Reunião de coordenação às 15h confirmada na sala 2.', time: '10:02', pinned: true, reactions: { '✅': ['Rui Cardoso', 'Joana Faria', 'Miguel Nunes'] } },
      ],
    },
    {
      id: 'ch2', type: 'channel', name: 'coordenacao-bim', project: 'Edifício Marquês', code: 'PY-118',
      color: '#9b59f5', members: [P.miguel, P.tiago, P.joana, P.rui], unread: 3, lastTime: '09:30',
      msgs: [
        { id: chatUid(), dir: 'in', from: P.miguel, text: 'Modelo federado atualizado no servidor.', time: '09:20' },
        { id: chatUid(), dir: 'in', from: P.tiago, text: 'Três colisões novas na zona técnica do piso -1.', time: '09:25' },
        { id: chatUid(), dir: 'in', from: P.miguel, text: 'Marquei revisão de colisões para amanhã às 10h.', time: '09:30' },
      ],
    },
    {
      id: 'ch3', type: 'channel', name: 'bolhao-licenciamento', project: 'Mercado do Bolhão', code: 'PY-112',
      color: '#d65151', members: [P.sofia, P.pedro, P.rui, P.ana], unread: 0, lastTime: 'Ontem',
      msgs: [
        { id: chatUid(), dir: 'in', from: P.sofia, text: 'Recebemos o parecer da Câmara — há elementos em falta.', time: 'Ontem 16:40' },
        { id: chatUid(), dir: 'in', from: P.rui, text: 'Quais? Posso ajudar na resposta.', time: 'Ontem 16:52' },
        { id: chatUid(), dir: 'in', from: P.sofia, text: 'Plano de acessibilidades e mapa de quantidades atualizado.', time: 'Ontem 17:01' },
      ],
    },
    /* ---------- Mensagens diretas (1:1) ---------- */
    {
      id: 'd1', type: 'direct', who: P.joana, online: true, lastSeen: 'agora', unread: 2, lastTime: '09:55',
      msgs: [
        { id: chatUid(), dir: 'in', from: P.joana, text: 'Ana, terminei a revisão dos pisos 2 e 3.', time: '09:48' },
        { id: chatUid(), dir: 'in', from: P.joana, text: 'Já enviei o cálculo revisto para aprovação.', time: '09:49' },
        { id: chatUid(), dir: 'out', text: 'Perfeito, Joana! Vou rever ainda hoje.', time: '09:52' },
        { id: chatUid(), dir: 'out', text: 'Confirmas que o mapa de armaduras também foi atualizado?', time: '09:52' },
        { id: chatUid(), dir: 'in', from: P.joana, text: 'Sim, está tudo na v2.', time: '09:55', reactions: { '👍': ['Miguel Jerónimo'] } },
      ],
    },
    {
      id: 'd2', type: 'direct', who: P.miguel, online: true, lastSeen: 'agora', unread: 0, lastTime: '09:19',
      msgs: [
        { id: chatUid(), dir: 'in', from: P.miguel, text: 'Tens cinco minutos para ver o modelo federado?', time: '09:15' },
        { id: chatUid(), dir: 'out', text: 'Agora não consigo — depois das 11h.', time: '09:18' },
        { id: chatUid(), dir: 'in', from: P.miguel, text: 'Combinado.', time: '09:19' },
      ],
    },
    {
      id: 'd3', type: 'direct', who: P.sofia, online: false, lastSeen: 'há 3 h', unread: 1, lastTime: '08:20',
      msgs: [
        { id: chatUid(), dir: 'in', from: P.sofia, text: 'Consegues validar a planta de implantação antes de enviarmos à Câmara?', time: '08:20' },
      ],
    },
    {
      id: 'd4', type: 'direct', who: P.rui, online: false, lastSeen: 'há 1 h', unread: 0, lastTime: '08:45',
      msgs: [
        { id: chatUid(), dir: 'out', text: 'Rui, consegues validar o render da Sofia antes de enviarmos?', time: '08:40' },
        { id: chatUid(), dir: 'in', from: P.rui, text: 'Combinado. Falamos depois da reunião.', time: '08:45' },
      ],
    },
  ];
}

/* Pré-visualização ("último") de uma conversa na lista */
function chatPreview(t) {
  const m = t.msgs[t.msgs.length - 1];
  if (!m) return '';
  const body = m.deleted ? 'Mensagem eliminada' : (m.attach ? ('Anexo · ' + m.attach.name) : m.text);
  if (t.type === 'channel') return (m.dir === 'out' ? 'Tu' : firstName(m.from)) + ': ' + body;
  return body;
}

/* Destacar termo de pesquisa dentro de uma mensagem */
function highlightText(text, term) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx < 0) return text;
  return [
    text.slice(0, idx),
    <mark key="hl" style={{ background: 'var(--accent-soft2)', color: 'inherit', borderRadius: 3, padding: '0 2px' }}>{text.slice(idx, idx + term.length)}</mark>,
    text.slice(idx + term.length),
  ];
}

function PresenceDot({ online, ring = 'var(--surface)' }) {
  return <span style={{ position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: 99, background: online ? 'var(--success)' : 'var(--text-3)', border: '2px solid ' + ring }}></span>;
}

function ChannelTile({ color, size = 42, fz }) {
  return <div style={{ width: size, height: size, borderRadius: 12, background: color + '22', color: color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: fz || size * 0.5, flexShrink: 0, fontFamily: 'var(--font-display)' }}>#</div>;
}

/* Cartão de anexo (liga à base documental — ChatAttachment → DocumentId) */
function AttachCard({ doc, out }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11, padding: 10, borderRadius: 12, marginTop: doc._withText ? 9 : 0,
      background: out ? 'rgba(255,255,255,.14)' : 'var(--surface-2)', border: '1px solid ' + (out ? 'rgba(255,255,255,.22)' : 'var(--border)'),
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: out ? 'rgba(255,255,255,.18)' : doc.color + '1c', color: out ? '#fff' : doc.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0, fontFamily: 'var(--font-display)' }}>{doc.ext}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
        <div style={{ fontSize: 11, fontWeight: 600, opacity: out ? 0.85 : 0.6, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
          <Icon name="fileText" size={11} /> {doc.size} · {doc.ver} · base documental
        </div>
      </div>
      <Icon name="download" size={16} style={{ opacity: out ? 0.85 : 0.55, flexShrink: 0 }} />
    </div>
  );
}

function Chat({ go }) {
  const [threads, setThreads] = useState(buildChatThreads);
  const [sel, setSel] = useState('ch1');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [typing, setTyping] = useState({});           // { [threadId]: person }
  const [convSearch, setConvSearch] = useState(false);  // pesquisa dentro da conversa
  const [convTerm, setConvTerm] = useState('');
  const [attachOpen, setAttachOpen] = useState(false);
  const [info, setInfo] = useState(false);             // modal membros/contacto
  const [newCh, setNewCh] = useState(false);           // modal novo canal
  const [menuFor, setMenuFor] = useState(null);        // menu de opções de mensagem aberto
  const [reactFor, setReactFor] = useState(null);      // seletor de reações aberto
  const [pinExpanded, setPinExpanded] = useState(false);
  const [unreadFromId, setUnreadFromId] = useState(null);  // 1ª mensagem não lida (divisor)
  const [editingId, setEditingId] = useState(null);    // mensagem em edição
  const [editText, setEditText] = useState('');
  const scrollRef = useRef(null);

  const t = threads.find(x => x.id === sel);
  const channels = threads.filter(x => x.type === 'channel');
  const dms = threads.filter(x => x.type === 'direct');

  const matchQ = (th) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const label = th.type === 'channel' ? th.name + ' ' + th.project : th.who.name + ' ' + th.who.role;
    return (label + ' ' + chatPreview(th)).toLowerCase().includes(q);
  };
  const fChannels = channels.filter(matchQ);
  const fDms = dms.filter(matchQ);

  /* Limpar não-lidas ao abrir a conversa (POST /read → LastReadAt = agora) */
  const openThread = (id) => {
    setSel(id);
    setConvSearch(false); setConvTerm(''); setAttachOpen(false);
    // marcar a fronteira das não-lidas ANTES de limpar (divisor "Novas mensagens")
    const th = threads.find(x => x.id === id);
    let markId = null;
    if (th && th.unread > 0) {
      let need = th.unread;
      for (let i = th.msgs.length - 1; i >= 0; i--) {
        const m = th.msgs[i];
        if (m.dir === 'in' && !m.deleted) { markId = m.id; if (--need === 0) break; }
      }
    }
    setUnreadFromId(markId);
    setThreads(prev => prev.map(x => x.id === id ? { ...x, unread: 0 } : x));
  };

  /* Auto-scroll para o fundo a cada nova mensagem / "a escrever" */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sel, t && t.msgs.length, typing[sel]]);

  /* Mover conversa para o topo da sua secção + atualizar pré-visualização */
  const pushMsg = (id, msg, opts = {}) => {
    setThreads(prev => {
      const idx = prev.findIndex(x => x.id === id);
      if (idx < 0) return prev;
      const updated = {
        ...prev[idx], msgs: [...prev[idx].msgs, msg], lastTime: msg.time === 'agora' ? _hhmm() : msg.time,
        unread: opts.incUnread && id !== sel ? prev[idx].unread + 1 : (opts.read ? 0 : prev[idx].unread),
      };
      return [updated, ...prev.filter(x => x.id !== id)];
    });
  };

  /* Atualizar estado de entrega de uma mensagem própria (enviado → entregue → lido) */
  const setMsgStatus = (threadId, msgId, status) => {
    setThreads(prev => prev.map(th => th.id !== threadId ? th : { ...th, msgs: th.msgs.map(m => m.id === msgId ? { ...m, status } : m) }));
  };

  /* Entrega simulada em tempo real: "a escrever…" → resposta */
  const scheduleReply = (id, mine) => {
    const th = threads.find(x => x.id === id);
    if (!th) return;
    const responder = th.type === 'direct' ? th.who : th.members.filter(p => p.name !== ME.name)[Math.floor(Math.random() * Math.max(1, th.members.length - 1))];
    if (th.type === 'direct' && !th.online) return; // destinatário offline: sem resposta imediata
    if (th.type === 'channel' && Math.random() > 0.65) return; // nem sempre alguém responde num canal
    window.setTimeout(() => setTyping(tp => ({ ...tp, [id]: responder })), 550);
    window.setTimeout(() => {
      setTyping(tp => { const n = { ...tp }; delete n[id]; return n; });
      const approve = /aprov|aprovo|aprovação/i.test(mine);
      const text = approve ? 'Confirmado — aprovação registada.' : CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)];
      pushMsg(id, { id: chatUid(), dir: 'in', from: responder, text, time: _hhmm() }, { incUnread: true });
    }, 1900);
  };

  const send = (attachDoc) => {
    const text = draft.trim();
    if (!text && !attachDoc) return;
    const targetId = sel;
    setDraft(''); setAttachOpen(false);
    const msg = { id: chatUid(), dir: 'out', text, time: _hhmm(), attach: attachDoc ? { ...attachDoc, _withText: !!text } : null, status: 'sent' };
    pushMsg(targetId, msg);
    // progressão de entrega: entregue (sempre) → lido (se o destinatário está online / canal)
    const th = threads.find(x => x.id === targetId);
    const willRead = th && (th.type === 'channel' || th.online);
    window.setTimeout(() => setMsgStatus(targetId, msg.id, 'delivered'), 550);
    if (willRead) window.setTimeout(() => setMsgStatus(targetId, msg.id, 'read'), 1750);
    scheduleReply(targetId, text);
  };

  const startDM = (person) => {
    const existing = threads.find(x => x.type === 'direct' && x.who.name === person.name);
    if (existing) { openThread(existing.id); return; }
    const id = 'dm' + Date.now();
    const nt = { id, type: 'direct', who: person, online: Math.random() > 0.5, lastSeen: 'há pouco', unread: 0, lastTime: _hhmm(), msgs: [] };
    setThreads(prev => [...prev, nt]);
    setSel(id); setConvSearch(false); setConvTerm(''); setUnreadFromId(null);
    if (window.PYToast) window.PYToast('Conversa iniciada com ' + firstName(person));
  };

  const createChannel = (name, code, members) => {
    const proj = PROJECTS.find(p => p.code === code);
    const id = 'ch' + Date.now();
    const nt = { id, type: 'channel', name: name.toLowerCase().replace(/\s+/g, '-'), project: proj ? proj.name : '—', code, color: '#2a7fb8', members, unread: 0, lastTime: _hhmm(), msgs: [] };
    setThreads(prev => [nt, ...prev]);
    setSel(id); setNewCh(false); setUnreadFromId(null);
    if (window.PYToast) window.PYToast('Canal #' + nt.name + ' criado');
  };

  /* Editar mensagem (PATCH → EditedAt = agora) — só o autor */
  const saveEdit = (msgId) => {
    const text = editText.trim();
    if (!text) return;
    setThreads(prev => prev.map(th => ({ ...th, msgs: th.msgs.map(m => m.id === msgId ? { ...m, text, edited: true, editedAt: _hhmm() } : m) })));
    setEditingId(null); setEditText('');
  };

  /* Apagar mensagem (soft-delete → DeletedAt = agora) */
  const deleteMsg = (threadId, msgId) => {
    setMenuFor(null);
    setThreads(prev => prev.map(th => th.id !== threadId ? th : { ...th, msgs: th.msgs.map(m => m.id === msgId ? { ...m, deleted: true, deletedAt: _hhmm(), text: '', attach: null, reactions: {}, pinned: false } : m) }));
    if (window.PYToast) window.PYToast('Mensagem eliminada');
  };

  /* Reagir a uma mensagem (alterna a minha reação) */
  const toggleReaction = (threadId, msgId, emoji) => {
    setReactFor(null);
    setThreads(prev => prev.map(th => th.id !== threadId ? th : { ...th, msgs: th.msgs.map(m => {
      if (m.id !== msgId) return m;
      const r = { ...(m.reactions || {}) };
      const arr = r[emoji] ? [...r[emoji]] : [];
      const i = arr.indexOf(ME.name);
      if (i >= 0) arr.splice(i, 1); else arr.push(ME.name);
      if (arr.length) r[emoji] = arr; else delete r[emoji];
      return { ...m, reactions: r };
    }) }));
  };

  /* Fixar / desafixar mensagem */
  const togglePin = (threadId, msgId) => {
    setMenuFor(null);
    const th = threads.find(x => x.id === threadId);
    const cur = th && th.msgs.find(m => m.id === msgId);
    const willPin = !(cur && cur.pinned);
    setThreads(prev => prev.map(x => x.id !== threadId ? x : { ...x, msgs: x.msgs.map(m => m.id === msgId ? { ...m, pinned: willPin } : m) }));
    if (window.PYToast) window.PYToast(willPin ? 'Mensagem fixada' : 'Mensagem desafixada');
  };

  const msgs = t ? t.msgs : [];
  const pinnedMsgs = msgs.filter(m => m.pinned && !m.deleted);
  const matchCount = convTerm ? msgs.filter(m => m.text && m.text.toLowerCase().includes(convTerm.toLowerCase())).length : 0;

  /* ---------- Linha da lista ---------- */
  const ThreadRow = ({ c }) => {
    const on = sel === c.id;
    const isCh = c.type === 'channel';
    return (
      <button onClick={() => openThread(c.id)} style={{
        width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: 10, borderRadius: 'var(--r-sm)',
        border: 'none', textAlign: 'left', cursor: 'pointer', marginBottom: 3,
        background: on ? 'var(--grad)' : 'transparent', color: on ? '#fff' : 'var(--text)',
      }}>
        <div style={{ position: 'relative' }}>
          {isCh ? <ChannelTile color={c.color} size={42} /> : <Avatar p={c.who} size={42} />}
          {!isCh && <PresenceDot online={c.online} ring={on ? '#26323f' : 'var(--surface)'} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isCh ? c.name : c.who.name}</span>
            <span style={{ fontSize: 11, fontWeight: 600, opacity: on ? 0.85 : 0.5 }}>{c.lastTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: on ? 0.9 : 0.6 }}>
              {typing[c.id] ? <em style={{ color: on ? '#fff' : 'var(--accent-700)', fontStyle: 'normal', fontWeight: 700 }}>a escrever…</em> : chatPreview(c)}
            </span>
            {c.unread > 0 && <span style={{ fontSize: 11, fontWeight: 700, background: on ? 'rgba(255,255,255,.28)' : 'var(--danger)', color: '#fff', borderRadius: 99, minWidth: 18, height: 18, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{c.unread}</span>}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="content" style={{ maxWidth: 1440 }}>
      <style>{`
        @keyframes chatIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:none; } }
        .chat-msg { animation: chatIn .22s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes chatBlink { 0%,60%,100%{opacity:.25;transform:translateY(0)} 30%{opacity:1;transform:translateY(-3px)} }
        .chat-typing span { width:6px;height:6px;border-radius:99px;background:var(--text-3);display:inline-block;animation:chatBlink 1.2s infinite; }
        .chat-typing span:nth-child(2){animation-delay:.18s} .chat-typing span:nth-child(3){animation-delay:.36s}
        .chat-acts { opacity:0; transition:opacity .12s; }
        .chat-msg:hover .chat-acts, .chat-acts.open { opacity:1; }
        .chat-acts-btn { width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);display:grid;place-items:center;cursor:pointer; }
        .chat-acts-btn:hover { color:var(--primary);box-shadow:var(--sh-sm); }
        .chat-menu-item { display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:none;background:transparent;border-radius:var(--r-sm);text-align:left;font-size:13.5px;font-weight:600;color:var(--text);cursor:pointer; }
        .chat-menu-item:hover { background:var(--surface-2); }
        .chat-menu-item.danger { color:var(--danger); }
        .chat-menu-item.danger:hover { background:var(--danger-soft); }
        .chat-emoji-btn { border:none;background:transparent;font-size:18px;line-height:1;padding:3px 5px;border-radius:8px;cursor:pointer;transition:transform .1s,background .1s; }
        .chat-emoji-btn:hover { background:var(--surface-2);transform:scale(1.18); }
        .chat-react-chip { display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:var(--r-pill);font-size:12px;font-weight:700;color:var(--text-2);cursor:pointer;transition:border-color .1s; }
      `}</style>

      <PageHead title="Chat" sub="Canais de projeto e mensagens diretas — isolado por workspace"
        actions={<button className="btn btn-primary" onClick={() => setNewCh(true)}><Icon name="plus" size={16} /> Novo canal</button>} />

      <div className="card" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px 1fr', height: 660 }}>
        {/* ---------- Lista ---------- */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ position: 'relative' }}><Avatar p={ME} size={38} /><PresenceDot online={true} /></div>
            <div className="search" style={{ flex: 1, padding: '8px 13px' }}><Icon name="search" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Procurar conversa…" /></div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px' }}>
              <div className="nav-label" style={{ flex: 1, padding: 0 }}>Canais</div>
              <button className="icon-btn" style={{ width: 24, height: 24, border: 'none', background: 'transparent' }} title="Novo canal" onClick={() => setNewCh(true)}><Icon name="plus" size={15} /></button>
            </div>
            {fChannels.map(c => <ThreadRow key={c.id} c={c} />)}
            {fChannels.length === 0 && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px 8px' }}>Sem canais.</div>}

            <div className="nav-label" style={{ padding: '14px 8px 6px' }}>Mensagens diretas</div>
            {fDms.map(c => <ThreadRow key={c.id} c={c} />)}
            {fDms.length === 0 && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px 8px' }}>Sem mensagens diretas.</div>}

            {!query && <React.Fragment>
              <div className="nav-label" style={{ padding: '14px 8px 6px' }}>Contactos</div>
              {Object.values(PEOPLE).map((p, i) => (
                <button key={i} onClick={() => startDM(p)} style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: 9, borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                  <Avatar p={p} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{p.role}</div></div>
                  <Icon name="message" size={16} style={{ color: 'var(--text-3)' }} />
                </button>
              ))}
            </React.Fragment>}
          </div>
        </div>

        {/* ---------- Conversa ---------- */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-2)' }}>
          {/* cabeçalho */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)' }}>
            <div style={{ position: 'relative' }}>
              {t.type === 'channel' ? <ChannelTile color={t.color} size={40} /> : <Avatar p={t.who} size={40} />}
              {t.type === 'direct' && <PresenceDot online={t.online} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.type === 'channel' ? '# ' + t.name : t.who.name}
                {t.type === 'channel' && <span className="badge b-violet" style={{ padding: '1px 8px', fontSize: 10.5 }}><Icon name="folder" size={10} /> {t.project}</span>}
              </div>
              <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>
                {t.type === 'channel'
                  ? t.members.length + ' participantes · ' + t.code
                  : t.who.role + ' · ' + (t.online ? 'Online' : 'Visto ' + t.lastSeen)}
              </div>
            </div>
            <button className={'icon-btn' + (convSearch ? ' on' : '')} style={{ width: 38, height: 38, color: convSearch ? 'var(--primary)' : undefined }} title="Procurar na conversa" onClick={() => { setConvSearch(s => !s); setConvTerm(''); }}><Icon name="search" size={18} /></button>
            <button className="icon-btn" style={{ width: 38, height: 38 }} title={t.type === 'channel' ? 'Participantes' : 'Contacto'} onClick={() => setInfo(true)}><Icon name={t.type === 'channel' ? 'users' : 'user'} size={18} /></button>
            <button className="icon-btn" style={{ width: 38, height: 38 }}><Icon name="more" size={18} /></button>
          </div>

          {/* barra de pesquisa na conversa */}
          {convSearch && (
            <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="search" style={{ flex: 1, padding: '7px 13px' }}><Icon name="search" size={15} /><input autoFocus value={convTerm} onChange={e => setConvTerm(e.target.value)} placeholder="Destacar nesta conversa…" /></div>
              <span className="muted-3" style={{ fontSize: 12, fontWeight: 700, minWidth: 80, textAlign: 'right' }}>{convTerm ? matchCount + ' resultado' + (matchCount === 1 ? '' : 's') : ''}</span>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => { setConvSearch(false); setConvTerm(''); }}><Icon name="x" size={16} /></button>
            </div>
          )}

          {/* barra de mensagens fixadas */}
          {pinnedMsgs.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--accent-soft)' }}>
              <button onClick={() => setPinExpanded(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 18px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'var(--accent-700)', fontWeight: 700, fontSize: 12.5 }}>
                <Icon name="pin" size={14} />
                <span style={{ flex: 1 }}>{pinnedMsgs.length} {pinnedMsgs.length === 1 ? 'mensagem fixada' : 'mensagens fixadas'}</span>
                <Icon name="chevD" size={15} style={{ transform: pinExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>
              {pinExpanded && (
                <div style={{ padding: '0 14px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pinnedMsgs.map(pm => (
                    <div key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                      <Icon name="pin" size={13} style={{ color: 'var(--accent-700)', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>{pm.dir === 'out' ? ME.name : (pm.from ? pm.from.name : (t.who && t.who.name))} · {pm.time}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pm.text || (pm.attach ? 'Anexo · ' + pm.attach.name : '')}</div>
                      </div>
                      <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }} title="Desafixar" onClick={() => togglePin(sel, pm.id)}><Icon name="x" size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* mensagens */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ textAlign: 'center', marginBottom: 6 }}><span className="badge b-gray" style={{ fontSize: 11 }}>Hoje</span></div>
            {msgs.map((m, i) => {
              const out = m.dir === 'out';
              const prev = msgs[i - 1];
              const sameSender = prev && prev.dir === m.dir && (out || (prev.from && m.from && prev.from.name === m.from.name));
              const showMeta = t.type === 'channel' && !out && !sameSender;
              const editing = editingId === m.id;
              const reacts = m.reactions ? Object.entries(m.reactions).filter(([, arr]) => arr.length > 0) : [];
              const popSide = out ? { right: 0 } : { left: 0 };
              const actsCell = (!m.deleted && !editing) ? (
                <div className={'chat-acts' + ((menuFor === m.id || reactFor === m.id) ? ' open' : '')} style={{ position: 'relative', alignSelf: 'center', display: 'flex', gap: 3 }}>
                  <button className="chat-acts-btn" title="Reagir" onClick={() => { setReactFor(reactFor === m.id ? null : m.id); setMenuFor(null); }}><Icon name="spark" size={14} /></button>
                  <button className="chat-acts-btn" title="Opções" onClick={() => { setMenuFor(menuFor === m.id ? null : m.id); setReactFor(null); }}><Icon name="dots" size={15} /></button>
                  {reactFor === m.id && (
                    <React.Fragment>
                      <div onClick={() => setReactFor(null)} style={{ position: 'fixed', inset: 0, zIndex: 30 }}></div>
                      <div style={{ position: 'absolute', bottom: '100%', ...popSide, marginBottom: 6, zIndex: 31, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', boxShadow: 'var(--sh-md)', padding: '4px 7px', display: 'flex', gap: 2 }}>
                        {CHAT_EMOJI.map(e => <button key={e} className="chat-emoji-btn" onClick={() => toggleReaction(sel, m.id, e)}>{e}</button>)}
                      </div>
                    </React.Fragment>
                  )}
                  {menuFor === m.id && (
                    <React.Fragment>
                      <div onClick={() => setMenuFor(null)} style={{ position: 'fixed', inset: 0, zIndex: 30 }}></div>
                      <div style={{ position: 'absolute', bottom: '100%', ...popSide, marginBottom: 6, zIndex: 31, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', boxShadow: 'var(--sh-md)', padding: 6, width: 156 }}>
                        <button className="chat-menu-item" onClick={() => togglePin(sel, m.id)}><Icon name="pin" size={15} /> {m.pinned ? 'Desafixar' : 'Fixar'}</button>
                        {out && m.text && <button className="chat-menu-item" onClick={() => { setEditingId(m.id); setEditText(m.text); setMenuFor(null); }}><Icon name="fileText" size={15} /> Editar</button>}
                        {out && <button className="chat-menu-item danger" onClick={() => deleteMsg(sel, m.id)}><Icon name="x" size={15} /> Eliminar</button>}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              ) : null;
              return (
                <React.Fragment key={m.id}>
                {m.id === unreadFromId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 2px 2px' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--danger)', opacity: .35 }}></div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--danger)' }}>Novas mensagens</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--danger)', opacity: .35 }}></div>
                  </div>
                )}
                <div className="chat-msg" style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 9, marginTop: sameSender ? 2 : 10 }}>
                  {!out && (sameSender ? <div style={{ width: 28, flexShrink: 0 }}></div> : <Avatar p={m.from || t.who} size={28} />)}
                  {out && actsCell}
                  <div style={{ maxWidth: editing ? '80%' : '64%', minWidth: editing ? 300 : 0 }}>
                    {showMeta && <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', marginBottom: 3, paddingInline: 4 }}>{m.from.name}</div>}
                    {editing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        <div className="fld__box" style={{ padding: '0 13px', background: 'var(--surface)' }}>
                          <input autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(m.id); } if (e.key === 'Escape') { setEditingId(null); } }}
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '11px 0', fontSize: 13.5, color: 'var(--text)' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditingId(null); setEditText(''); }}>Cancelar</button>
                          <button className="btn btn-primary btn-sm" onClick={() => saveEdit(m.id)}><Icon name="check" size={14} /> Guardar</button>
                        </div>
                      </div>
                    ) : m.deleted ? (
                      <div style={{ padding: '9px 14px', borderRadius: out ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: 'transparent', border: '1px dashed var(--border-2)', color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <Icon name="x" size={13} /> Mensagem eliminada
                      </div>
                    ) : (
                      <div style={{ position: 'relative', padding: m.attach && !m.text ? 8 : '10px 14px', borderRadius: out ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: out ? 'var(--grad)' : 'var(--surface)', color: out ? '#fff' : 'var(--text)', border: out ? 'none' : '1px solid var(--border)', fontSize: 13.5, lineHeight: 1.5, boxShadow: 'var(--sh-sm)' }}>
                        {m.pinned && <span title="Fixada" style={{ position: 'absolute', top: -7, ...(out ? { left: -7 } : { right: -7 }), width: 20, height: 20, borderRadius: 99, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-sm)' }}><Icon name="pin" size={11} /></span>}
                        {m.text && <span>{highlightText(m.text, convTerm)}</span>}
                        {m.attach && <AttachCard doc={m.attach} out={out} />}
                      </div>
                    )}
                    {!editing && !m.deleted && reacts.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 5, justifyContent: out ? 'flex-end' : 'flex-start' }}>
                        {reacts.map(([emoji, arr]) => {
                          const mine = arr.includes(ME.name);
                          return <button key={emoji} className="chat-react-chip" title={arr.join(', ')} onClick={() => toggleReaction(sel, m.id, emoji)}
                            style={{ border: '1px solid ' + (mine ? 'var(--primary)' : 'var(--border)'), background: mine ? 'var(--primary-soft)' : 'var(--surface)' }}><span style={{ fontSize: 13 }}>{emoji}</span>{arr.length}</button>;
                        })}
                      </div>
                    )}
                    {!editing && (
                      <div className="muted-3" style={{ fontSize: 11, fontWeight: 600, marginTop: 3, textAlign: out ? 'right' : 'left', paddingInline: 4, display: 'flex', gap: 5, justifyContent: out ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
                        {m.pinned && !m.deleted && <Icon name="pin" size={11} style={{ color: 'var(--accent-700)' }} />}{m.time}{m.edited && !m.deleted && <span>· editado</span>}{out && !m.deleted && (
                          (m.status || 'read') === 'read'
                            ? <Icon name="checks" size={13} style={{ color: 'var(--info)' }} title="Lido" />
                            : (m.status === 'delivered'
                              ? <Icon name="checks" size={13} style={{ color: 'var(--text-3)' }} title="Entregue" />
                              : <Icon name="check" size={12} style={{ color: 'var(--text-3)' }} title="Enviado" />)
                        )}
                      </div>
                    )}
                  </div>
                  {!out && actsCell}
                </div>
                </React.Fragment>
              );
            })}
            {typing[sel] && (
              <div className="chat-msg" style={{ display: 'flex', alignItems: 'flex-end', gap: 9, marginTop: 10 }}>
                <Avatar p={typing[sel]} size={28} />
                <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
                  <div className="chat-typing" style={{ display: 'flex', gap: 4 }}><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
          </div>

          {/* composer */}
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: 14, display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
            {attachOpen && (
              <React.Fragment>
                <div onClick={() => setAttachOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }}></div>
                <div style={{ position: 'absolute', bottom: 72, left: 14, width: 320, maxHeight: 320, overflowY: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', zIndex: 21, padding: 8 }}>
                  <div className="nav-label" style={{ padding: '6px 10px' }}>Anexar da base documental</div>
                  {DOCS.map(d => (
                    <button key={d.id} onClick={() => send(d)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: 9, borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: d.color + '1c', color: d.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 10, flexShrink: 0, fontFamily: 'var(--font-display)' }}>{d.ext}</div>
                      <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div><div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{d.size} · {d.ver}</div></div>
                    </button>
                  ))}
                </div>
              </React.Fragment>
            )}
            <button className="icon-btn" style={{ width: 48, height: 48, flexShrink: 0, color: attachOpen ? 'var(--primary)' : undefined }} title="Anexar documento" onClick={() => setAttachOpen(o => !o)}><Icon name="paperclip" size={18} /></button>
            <div className="fld__box" style={{ flex: 1, padding: '0 14px' }}>
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={t.type === 'channel' ? 'Mensagem para #' + t.name + '…' : 'Mensagem para ' + firstName(t.who) + '…'}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '13px 0', fontSize: 14, color: 'var(--text)' }} />
            </div>
            <button className="btn btn-primary" style={{ height: 48, padding: '0 18px' }} onClick={() => send()}><Icon name="send" size={17} /> Enviar</button>
          </div>
        </div>
      </div>

      {/* modal participantes / contacto */}
      <Modal open={info} onClose={() => setInfo(false)} width={420}
        title={t.type === 'channel' ? '# ' + t.name : t.who.name}
        sub={t.type === 'channel' ? t.members.length + ' participantes · ' + t.project : t.who.role}>
        {t.type === 'channel' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {t.members.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
                <Avatar p={p} size={38} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{p.role}</div></div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setInfo(false); startDM(p); }}><Icon name="message" size={14} /> Mensagem</button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ position: 'relative' }}><Avatar p={t.who} size={56} /><PresenceDot online={t.online} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 16 }}>{t.who.name}</div><div className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>{t.who.role}</div>
                <div style={{ marginTop: 4 }}><span className={'badge ' + (t.online ? 'b-green' : 'b-gray')} style={{ fontSize: 11 }}>{t.online ? 'Online' : 'Visto ' + t.lastSeen}</span></div></div>
            </div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.6 }}>Conversa direta privada — visível apenas para os dois participantes.</div>
          </div>
        )}
      </Modal>

      <NovoCanalModal open={newCh} onClose={() => setNewCh(false)} onCreate={createChannel} />
    </div>
  );
}

/* Modal — criar canal (POST /api/chat/channels) */
function NovoCanalModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState(PROJECTS[0].code);
  const [sel, setSel] = useState(() => Object.keys(PEOPLE).slice(0, 3));
  useEffect(() => { if (open) { setName(''); setCode(PROJECTS[0].code); setSel(Object.keys(PEOPLE).slice(0, 3)); } }, [open]);
  const toggle = (k) => setSel(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k]);
  const create = () => { if (!name.trim()) return; onCreate(name.trim(), code, sel.map(k => PEOPLE[k])); };
  return (
    <Modal open={open} onClose={onClose} width={460} title="Novo canal" sub="Espaço de conversa ligado a um projeto"
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={create} disabled={!name.trim()}><Icon name="plus" size={15} /> Criar canal</button>
      </React.Fragment>}>
      <Field label="Nome do canal">
        <div className="fld__box" style={{ height: 46 }}><span style={{ color: 'var(--text-3)', fontWeight: 800, fontSize: 16, paddingLeft: 2 }}>#</span><input value={name} onChange={e => setName(e.target.value)} placeholder="ex.: execucao-fachada" style={{ marginLeft: 6 }} /></div>
      </Field>
      <Field label="Projeto associado">
        <SelectInput value={code} onChange={e => setCode(e.target.value)}>
          {PROJECTS.map(p => <option key={p.code} value={p.code}>{p.code} · {p.name}</option>)}
        </SelectInput>
      </Field>
      <Field label="Participantes">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.keys(PEOPLE).map(k => {
            const p = PEOPLE[k]; const on = sel.includes(k);
            return (
              <button key={k} onClick={() => toggle(k)} className={'chip' + (on ? ' active' : '')} style={{ gap: 8 }}>
                <Avatar p={p} size={22} /> {firstName(p)}{on && <Icon name="check" size={13} />}
              </button>
            );
          })}
        </div>
      </Field>
    </Modal>
  );
}

Object.assign(window, { Chat });
