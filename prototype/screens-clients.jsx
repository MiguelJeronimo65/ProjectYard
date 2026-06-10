/* ProjectYard — Clientes (CRM: fases de contacto + detalhe) */

const CRM_STAGES = [
  { id: 'contacto', label: 'Contacto inicial', color: '#8a949e' },
  { id: 'proposta', label: 'Proposta enviada', color: '#2a7fb8' },
  { id: 'negociacao', label: 'Em negociação', color: '#e0922a' },
  { id: 'adjudicado', label: 'Adjudicado', color: '#6a5af9' },
  { id: 'execucao', label: 'Em execução', color: '#d9a32a' },
  { id: 'concluido', label: 'Concluído', color: '#1f9d6b' },
];

const CLIENTS = [
  { id: 'cl1', company: 'Imobiliária Atlântico', initials: 'IA', color: '#6a5af9', contact: 'Helena Brás', role: 'Diretora de Projetos', email: 'h.bras@atlantico.pt', phone: '+351 93 888 4040', city: 'Porto', stage: 'execucao', since: '2024', projects: 3, billed: 186000, value: 248000, status: 'Ativo', last: 'Aprovou Arquitetura · há 2 dias',
    timeline: [
      { type: 'Reunião', icon: 'users', text: 'Reunião de arranque — Edifício Marquês', date: '12 Jan 2026', who: PEOPLE.ana },
      { type: 'Proposta', icon: 'fileText', text: 'Proposta de honorários enviada (€248k)', date: '20 Dez 2025', who: PEOPLE.ana },
      { type: 'Email', icon: 'mail', text: 'Pedido de orçamento para reabilitação', date: '08 Dez 2025', who: PEOPLE.rui },
    ] },
  { id: 'cl2', company: 'Grupo Vértice SA', initials: 'GV', color: '#21a8c4', contact: 'Carlos Mendes', role: 'Administrador', email: 'obras@vertice.pt', phone: '+351 91 234 5678', city: 'Matosinhos', stage: 'execucao', since: '2025', projects: 1, billed: 251000, value: 410000, status: 'Ativo', last: 'Reunião de obra · 5ª feira',
    timeline: [
      { type: 'Visita', icon: 'building', text: 'Visita de obra — Sede Nova', date: '02 Jun 2026', who: PEOPLE.joana },
      { type: 'Reunião', icon: 'users', text: 'Validação do Projeto de Execução 50%', date: '20 Mai 2026', who: PEOPLE.ana },
    ] },
  { id: 'cl3', company: 'Família Albuquerque', initials: 'FA', color: '#1f9d6b', contact: 'João Albuquerque', role: 'Cliente particular', email: 'j.albuquerque@email.pt', phone: '+351 96 555 1212', city: 'Faro', stage: 'adjudicado', since: '2026', projects: 1, billed: 12900, value: 86000, status: 'Ativo', last: 'Dúvidas de acabamentos · ontem',
    timeline: [
      { type: 'Chamada', icon: 'sms', text: 'Esclarecimento sobre materiais', date: '07 Jun 2026', who: PEOPLE.rui },
      { type: 'Proposta', icon: 'fileText', text: 'Adjudicação assinada — Moradia V4', date: '03 Mar 2026', who: PEOPLE.rui },
    ] },
  { id: 'cl4', company: 'Câmara Municipal', initials: 'CM', color: '#e0922a', contact: 'Dep. Urbanismo', role: 'Entidade pública', email: 'urbanismo@cm-porto.pt', phone: '+351 22 339 0000', city: 'Porto', stage: 'negociacao', since: '2025', projects: 1, billed: 72500, value: 134000, status: 'Em risco', last: 'Pedido de elementos · há 1 dia',
    timeline: [
      { type: 'Email', icon: 'mail', text: 'Pedido de elementos adicionais', date: '02 Jun 2026', who: PEOPLE.sofia },
    ] },
  { id: 'cl5', company: 'TransIbérica', initials: 'TI', color: '#9b59f5', contact: 'Marta Lopes', role: 'Diretora de Operações', email: 'm.lopes@transiberica.pt', phone: '+351 92 700 1100', city: 'Maia', stage: 'proposta', since: '—', projects: 0, billed: 0, value: 295000, status: 'Lead', last: 'Proposta enviada · há 4 dias',
    timeline: [
      { type: 'Proposta', icon: 'fileText', text: 'Proposta Parque Logístico enviada', date: '04 Jun 2026', who: PEOPLE.ana },
      { type: 'Reunião', icon: 'users', text: 'Reunião de apresentação', date: '28 Mai 2026', who: PEOPLE.ana },
    ] },
  { id: 'cl6', company: 'Nordeste Retail', initials: 'NR', color: '#ef7d54', contact: 'Pedro Sá', role: 'Gestor de Expansão', email: 'p.sa@nordeste.pt', phone: '+351 93 220 0099', city: 'Braga', stage: 'concluido', since: '2025', projects: 1, billed: 58000, value: 58000, status: 'Concluído', last: 'Projeto encerrado',
    timeline: [
      { type: 'Reunião', icon: 'check', text: 'Encerramento — Loja Flagship', date: '18 Dez 2025', who: PEOPLE.rui },
    ] },
  { id: 'cl7', company: 'Construtora Dão', initials: 'CD', color: '#2a7fb8', contact: 'Inês Ferreira', role: 'Diretora Técnica', email: 'i.ferreira@dao.pt', phone: '+351 91 540 7788', city: 'Viseu', stage: 'contacto', since: '—', projects: 0, billed: 0, value: 0, status: 'Lead', last: 'Primeiro contacto · há 1 semana',
    timeline: [
      { type: 'Chamada', icon: 'sms', text: 'Primeiro contacto telefónico', date: '01 Jun 2026', who: PEOPLE.ana },
    ] },
];

const CLIENT_COLORS = ['#6a5af9', '#21a8c4', '#1f9d6b', '#e0922a', '#9b59f5', '#ef7d54', '#2a7fb8', '#d65151'];

/* MERGE (aditivo): NIF dos clientes — modelo do cliente (tabela Clientes) */
const CLIENT_NIF = { cl1: 'PT 501 234 567', cl2: 'PT 502 998 110', cl3: '—', cl4: 'PT 600 000 153', cl5: 'PT 503 771 220', cl6: 'PT 504 220 099', cl7: 'PT 505 540 778' };
CLIENTS.forEach(c => { if (!c.nif) c.nif = CLIENT_NIF[c.id] || '—'; });

function Clients({ go }) {
  const [view, setView] = useState('pipeline');
  const [open, setOpen] = useState(null);
  const [clients, setClients] = useState(() => CLIENTS.map(c => ({ ...c, timeline: c.timeline.map(t => ({ ...t })) })));
  const [novo, setNovo] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const sort = useSort(clients, { company: (c) => c.company, contact: (c) => c.contact, stage: (c) => CRM_STAGES.findIndex(s => s.id === c.stage), projects: (c) => c.projects, billed: (c) => c.billed, status: (c) => c.status }, null);

  const updateClient = (id, patch) => setClients(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  const moveStage = (id, stage) => { const c = clients.find(x => x.id === id); if (!c || c.stage === stage) return; updateClient(id, { stage }); const lbl = CRM_STAGES.find(s => s.id === stage).label; if (window.PYToast) window.PYToast('“' + c.company + '” movido para ' + lbl); };
  const addClient = (data) => {
    const id = 'cl' + Date.now();
    const initials = data.company.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    setClients(cs => [{ id, initials, color: CLIENT_COLORS[cs.length % CLIENT_COLORS.length], projects: 0, billed: 0, value: 0, status: 'Lead', since: '—', last: 'Criado agora', timeline: [], ...data }, ...cs]);
    if (window.PYToast) window.PYToast('Cliente criado · ' + data.company);
  };
  const removeClient = (id) => { const c = clients.find(x => x.id === id); setClients(cs => cs.filter(x => x.id !== id)); setOpen(null); if (window.PYToast) window.PYToast('Cliente removido' + (c ? ' · ' + c.company : '')); };
  const pipelineValue = clients.reduce((a, c) => a + c.value, 0);
  const leads = clients.filter(c => c.status === 'Lead').length;

  const client = clients.find(c => c.id === open);
  if (client) return <ClientDetail c={client} onBack={() => setOpen(null)} go={go} onUpdate={updateClient} onRemove={removeClient} />;

  return (
    <div className="content">
      <PageHead
        title="Clientes"
        sub={`Funil comercial e fases de contacto · ${clients.length} clientes · ${leads} lead${leads === 1 ? '' : 's'}`}
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => window.PYToast && window.PYToast('Exportação iniciada · clientes.csv')}><Icon name="download" size={16} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setNovo(true)}><Icon name="plus" size={16} /> Novo cliente</button>
        </React.Fragment>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div className="seg">
          <button className={view === 'pipeline' ? 'active' : ''} onClick={() => setView('pipeline')}><Icon name="kanban" size={15} /> Pipeline</button>
          <button className={view === 'lista' ? 'active' : ''} onClick={() => setView('lista')}><Icon name="dots" size={15} /> Lista</button>
        </div>
        <span className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>Valor em pipeline: <b className="num" style={{ color: 'var(--text)' }}>€{(pipelineValue / 1e6).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M</b></span>
      </div>

      {view === 'pipeline' ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${CRM_STAGES.length}, minmax(210px, 1fr))`, gap: 14, alignItems: 'start', overflowX: 'auto', paddingBottom: 8 }}>
          {CRM_STAGES.map(s => {
            const cards = clients.filter(c => c.stage === s.id);
            const isOver = dragOver === s.id && dragId;
            return (
              <div key={s.id}
                onDragOver={(e) => { if (dragId) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOver !== s.id) setDragOver(s.id); } }}
                onDrop={(e) => { e.preventDefault(); moveStage(dragId, s.id); setDragId(null); setDragOver(null); }}
                style={{ background: isOver ? 'var(--accent-soft)' : 'var(--surface-2)', borderRadius: 'var(--r)', border: '1px solid ' + (isOver ? 'var(--accent)' : 'var(--border)'), padding: 11, transition: 'background .12s, border-color .12s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: s.color }}></span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{s.label}</span>
                  <span className="num" style={{ marginLeft: 'auto', fontWeight: 700, fontSize: 12, color: 'var(--text-3)', background: 'var(--surface)', padding: '1px 7px', borderRadius: 99 }}>{cards.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minHeight: 8 }}>
                  {cards.map(c => (
                    <button key={c.id} draggable
                      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragId(c.id); }}
                      onDragEnd={() => { setDragId(null); setDragOver(null); }}
                      onClick={() => setOpen(c.id)} className="card card-pad" title={c.company + ' — arraste para mudar de fase'}
                      style={{ padding: 13, textAlign: 'left', cursor: dragId === c.id ? 'grabbing' : 'grab', display: 'flex', flexDirection: 'column', gap: 9, opacity: dragId === c.id ? 0.4 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar p={{ initials: c.initials, color: c.color }} size={34} sq />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                          <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{c.city}</div>
                        </div>
                      </div>
                      {c.value > 0 && <div className="num" style={{ fontWeight: 700, fontSize: 15 }}>{eur(c.value)}</div>}
                      <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={12} /> {c.last}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead><tr>
              <Th label="Cliente" k="company" sort={sort} />
              <Th label="Contacto" k="contact" sort={sort} />
              <Th label="Fase" k="stage" sort={sort} />
              <Th label="Projetos" k="projects" sort={sort} />
              <Th label="Faturado" k="billed" sort={sort} />
              <Th label="Estado" k="status" sort={sort} />
            </tr></thead>
            <tbody>
              {sort.sorted.map(c => {
                const st = CRM_STAGES.find(s => s.id === c.stage);
                return (
                  <tr key={c.id} className="row-click" onClick={() => setOpen(c.id)}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar p={{ initials: c.initials, color: c.color }} size={36} sq /><div><div style={{ fontWeight: 700 }}>{c.company}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{c.city} · desde {c.since}</div></div></div></td>
                    <td><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.contact}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{c.role}</div></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13, color: st.color }}><span style={{ width: 8, height: 8, borderRadius: 99, background: st.color }}></span>{st.label}</span></td>
                    <td className="num" style={{ fontWeight: 700 }}>{c.projects}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{eur(c.billed)}</td>
                    <td><Badge tag={c.status === 'Ativo' ? 'b-green' : c.status === 'Em risco' ? 'b-red' : c.status === 'Concluído' ? 'b-blue' : 'b-gray'}>{c.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NovoClienteModal open={novo} onClose={() => setNovo(false)} onCreate={addClient} />
    </div>
  );
}

function NovoClienteModal({ open, onClose, onCreate }) {
  const [f, setF] = useState({ company: '', contact: '', role: '', nif: '', email: '', phone: '', city: '', stage: 'contacto' });
  useEffect(() => { if (open) setF({ company: '', contact: '', role: '', nif: '', email: '', phone: '', city: '', stage: 'contacto' }); }, [open]);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const submit = () => { if (!f.company.trim()) return; onCreate(f); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Novo cliente" sub="Adiciona um cliente ou lead ao funil comercial." width={560}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!f.company.trim()}><Icon name="plus" size={15} /> Criar cliente</button>
      </React.Fragment>}>
      <Field label="Empresa / cliente"><TextInput value={f.company} onChange={set('company')} placeholder="Ex.: Imobiliária Atlântico" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Pessoa de contacto" half><TextInput value={f.contact} onChange={set('contact')} placeholder="Nome" /></Field>
        <Field label="NIF" half><TextInput value={f.nif} onChange={set('nif')} placeholder="PT 000 000 000" /></Field>
      </div>
      <Field label="Função"><TextInput value={f.role} onChange={set('role')} placeholder="Ex.: Diretora de Projetos" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Email" half><TextInput type="email" value={f.email} onChange={set('email')} placeholder="nome@empresa.pt" /></Field>
        <Field label="Telefone" half><TextInput value={f.phone} onChange={set('phone')} placeholder="+351 …" /></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Localidade" half><TextInput value={f.city} onChange={set('city')} placeholder="Ex.: Porto" /></Field>
        <Field label="Fase de contacto" half><SelectInput value={f.stage} onChange={set('stage')}>
          {CRM_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </SelectInput></Field>
      </div>
    </Modal>
  );
}

function ClientDetail({ c, onBack, go, onUpdate, onRemove }) {
  const [tab, setTab] = useState('Visão geral');
  const [edit, setEdit] = useState(false);
  const [reg, setReg] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [extra, setExtra] = useState(() => (CLIENT_EXTRA[c.id] || []).map(x => ({ ...x })));
  const tabs = ['Visão geral', 'Contactos', 'Faturação', 'Notificações'];
  const stageIdx = CRM_STAGES.findIndex(s => s.id === c.stage);

  return (
    <div className="content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="chevL" size={16} /> Clientes</button>
      </div>
      <div className="page-head" style={{ marginBottom: 22 }}>
        <div><h1>{c.company}</h1><p>Cliente desde {c.since} · {c.city} · {c.status}</p></div>
        <div className="page-head__actions">
          <button className="btn btn-primary" onClick={() => window.PYNewProject && window.PYNewProject({ cliente: c.company })}><Icon name="plus" size={15} /> Criar projeto</button>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }} onClick={() => setConfirmDel(true)}><Icon name="x" size={15} /> Remover</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', alignItems: 'start' }}>
        {/* profile card */}
        <div className="grid" style={{ gap: 18 }}>
          <div className="card card-pad" style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto 14px' }}><Avatar p={{ initials: c.initials, color: c.color }} size={84} sq /></div>
            <div style={{ fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-display)' }}>{c.company}</div>
            <div className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>{c.contact} · {c.role}</div>
            <div style={{ display: 'flex', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '12px' }}><div className="num" style={{ fontWeight: 700, fontSize: 20 }}>{c.projects}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>Projetos</div></div>
              <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '12px' }}><div className="num" style={{ fontWeight: 700, fontSize: 20 }}>{eur(c.billed)}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>Faturado</div></div>
            </div>
            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <Detail label="Contacto" value={c.contact} />
              <Detail label="NIF" value={c.nif || '—'} />
              <Detail label="Email" value={c.email} />
              <Detail label="Telefone" value={c.phone} />
              <Detail label="Localidade" value={c.city} />
              <Detail label="Estado" value={<Badge tag={c.status === 'Ativo' ? 'b-green' : c.status === 'Em risco' ? 'b-red' : c.status === 'Concluído' ? 'b-blue' : 'b-gray'}>{c.status}</Badge>} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={() => setEdit(true)}><Icon name="user" size={16} /> Editar detalhes</button>
          </div>

          {/* contact phase card */}
          <div className="card card-pad">
            <div className="card-h"><div><h3 style={{ fontSize: 15 }}>Fase de contacto</h3></div></div>
            <div className="tl">
              {CRM_STAGES.map((s, i) => (
                <div className="tl-item" key={s.id} style={{ paddingBottom: 14 }}>
                  <div className={'tl-dot' + (i <= stageIdx ? ' on' : '')} style={i === stageIdx ? { borderColor: 'var(--accent)', background: 'var(--accent)', color: 'var(--navy-700)' } : {}}>
                    {i < stageIdx ? <Icon name="check" size={11} /> : i === stageIdx ? <Icon name="dot" size={11} /> : null}
                  </div>
                  <div style={{ fontWeight: i === stageIdx ? 700 : 600, fontSize: 13.5, color: i <= stageIdx ? 'var(--text)' : 'var(--text-3)' }}>{s.label}{i === stageIdx && <span className="badge b-gold" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 10.5 }}>Atual</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right */}
        <div>
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ border: 'none', background: 'transparent', padding: '12px 16px', fontWeight: 700, fontSize: 14, color: tab === t ? 'var(--primary-700)' : 'var(--text-2)', borderBottom: '2px solid ' + (tab === t ? 'var(--accent)' : 'transparent'), marginBottom: -1 }}>{t}</button>
            ))}
          </div>

          {tab === 'Visão geral' ? (
            <div className="grid" style={{ gap: 20 }}>
              <div className="grid cols-2">
                <OvCard icon="euro" tone="violet" big={eur(c.value)} title="Valor de contrato" sub="Honorários contratados / em proposta" />
                <OvCard icon="folder" tone="gold" big={c.projects} title="Projetos" sub={c.projects > 0 ? 'Ativos com este cliente' : 'Ainda sem adjudicação'} />
                <OvCard icon="check" tone="green" big={eur(c.billed)} title="Faturado" sub={c.value > 0 ? Math.round(c.billed / c.value * 100) + '% do contrato' : '—'} />
                <OvCard icon="clock" tone="blue" big={'Desde ' + c.since} title="Relação" sub="Cliente do gabinete" />
              </div>

              <div className="card card-pad">
                <div className="card-h"><div><h3>Histórico de contacto</h3><span className="sub">Interações registadas com o cliente</span></div><button className="btn btn-soft btn-sm card-h more" onClick={() => setReg(true)}><Icon name="plus" size={14} /> Registar</button></div>
                <div className="tl">
                  {c.timeline.map((t, i) => (
                    <div className="tl-item" key={i}>
                      <div className="tl-dot on"><Icon name={t.icon} size={11} /></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.text}</div>
                          <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{t.type} · {t.date}</div>
                        </div>
                        <Avatar p={t.who} size={28} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : tab === 'Notificações' ? (
            <NotificationsTab />
          ) : tab === 'Contactos' ? (
            <ContactsTab c={c} extra={extra} onAdd={() => setAddContact(true)} />
          ) : tab === 'Faturação' ? (
            <BillingTab c={c} go={go} />
          ) : (
            <div className="card card-pad" style={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
              <div className="empty"><Icon name="user" size={32} /><div style={{ marginTop: 10, fontWeight: 700, fontSize: 15, color: 'var(--text-2)' }}>{tab}</div><div style={{ marginTop: 4 }}>Pessoas de contacto e moradas do cliente.</div></div>
            </div>
          )}
        </div>
      </div>

      <EditClienteModal open={edit} onClose={() => setEdit(false)} c={c} onSave={(patch) => { onUpdate(c.id, patch); if (window.PYToast) window.PYToast('Detalhes atualizados'); }} />
      <RegistarInteracaoModal open={reg} onClose={() => setReg(false)} onAdd={(item) => { onUpdate(c.id, { timeline: [item, ...c.timeline], last: item.type + ' · agora' }); if (window.PYToast) window.PYToast('Interação registada'); }} />
      <AddContactoModal open={addContact} onClose={() => setAddContact(false)} onAdd={(p) => { setExtra(e => [...e, p]); if (window.PYToast) window.PYToast('Contacto adicionado · ' + p.name); }} />
      <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title="Remover cliente" sub={c.company} width={440}
        footer={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => setConfirmDel(false)}>Cancelar</button>
          <button className="btn btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { setConfirmDel(false); onRemove(c.id); }}><Icon name="x" size={15} /> Remover</button>
        </React.Fragment>}>
        <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: 0 }}>Tens a certeza que queres remover <b>{c.company}</b> do funil comercial? Esta ação não afeta projetos já adjudicados.</p>
      </Modal>
    </div>
  );
}

function Detail({ label, value }) {
  return <div style={{ display: 'flex', gap: 8, padding: '7px 0', fontSize: 13.5 }}><span className="muted-3" style={{ fontWeight: 700, minWidth: 80 }}>{label}</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span></div>;
}
function OvCard({ icon, tone, big, title, sub }) {
  const map = { violet: ['var(--primary)', 'var(--primary-soft)'], gold: ['var(--accent-700)', 'var(--accent-soft)'], green: ['var(--success)', 'var(--success-soft)'], blue: ['var(--info)', 'var(--info-soft)'] };
  const [col, bg] = map[tone];
  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, color: col, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></div>
      </div>
      <div className="num" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{big}</div>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>{title}</div>
      <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ---------------- Dados de faturação + contactos por cliente ---------------- */
const CLIENT_BILL = {
  cl1: { nif: '504 882 113', addr: 'Av. da Boavista 1430, 4100-114 Porto', terms: '30 dias · transferência', match: 'Marquês' },
  cl2: { nif: '501 223 947', addr: 'Rua do Mar 88, 4450-289 Matosinhos', terms: '45 dias · transferência', match: 'Vértice' },
  cl3: { nif: '235 778 902', addr: 'Rua das Oliveiras 12, 8000-145 Faro', terms: 'A pronto · MB Way', match: 'Quinta' },
  cl4: { nif: '506 700 011', addr: 'Praça General Humberto Delgado, 4000-286 Porto', terms: '60 dias · ofício', match: 'Bolhão' },
  cl5: { nif: '509 334 120', addr: 'Zona Industrial da Maia, 4470-208 Maia', terms: '30 dias', match: null },
  cl6: { nif: '502 119 556', addr: 'Av. Central 210, 4710-229 Braga', terms: '30 dias', match: 'Flagship' },
  cl7: { nif: '—', addr: 'Viseu', terms: '—', match: null },
};
const CLIENT_EXTRA = {
  cl1: [{ name: 'Nuno Brito', role: 'Departamento Financeiro', email: 'financeiro@atlantico.pt', phone: '+351 22 600 1200' }],
  cl2: [{ name: 'Sofia Reis', role: 'Gabinete de Obras', email: 's.reis@vertice.pt', phone: '+351 91 700 8890' }],
  cl4: [{ name: 'Eng. Paulo Matos', role: 'Fiscalização Municipal', email: 'p.matos@cm-porto.pt', phone: '+351 22 339 0044' }],
};

function ContactCard({ p, color }) {
  const initials = p.name.replace(/^(Eng\.|Arq\.|Dr\.|Dra\.)\s*/, '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ display: 'flex', gap: 12, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
      <Avatar p={{ initials, color: p.primary ? color : 'var(--text-3)' }} size={42} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
          {p.primary && <span className="badge b-gold" style={{ padding: '1px 8px', fontSize: 10 }}>Principal</span>}
        </div>
        <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>{p.role}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href={'mailto:' + p.email} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}><Icon name="mail" size={14} /> {p.email}</a>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' }}><Icon name="sms" size={14} /> {p.phone}</span>
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ c, extra, onAdd }) {
  const bill = CLIENT_BILL[c.id] || {};
  const people = [{ name: c.contact, role: c.role, email: c.email, phone: c.phone, primary: true }, ...(extra || [])];
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card card-pad">
        <div className="card-h"><div><h3>Pessoas de contacto</h3><span className="sub">{people.length} contacto{people.length > 1 ? 's' : ''}</span></div><button className="btn btn-soft btn-sm card-h more" onClick={onAdd}><Icon name="plus" size={14} /> Adicionar</button></div>
        <div className="grid cols-2">{people.map((p, i) => <ContactCard key={i} p={p} color={c.color} />)}</div>
      </div>
      <div className="card card-pad">
        <div className="card-h"><div><h3>Morada e dados fiscais</h3></div></div>
        <div className="grid cols-2" style={{ gap: '0 28px' }}>
          <Detail label="NIF" value={bill.nif || '—'} />
          <Detail label="Localidade" value={c.city} />
          <Detail label="Morada" value={bill.addr || '—'} />
          <Detail label="Pagamento" value={bill.terms || '—'} />
        </div>
      </div>
    </div>
  );
}

function BillingTab({ c, go }) {
  const bill = CLIENT_BILL[c.id] || {};
  const invs = bill.match ? INVOICES.filter(x => x.project.includes(bill.match)) : [];
  const porFaturar = Math.max(0, c.value - c.billed);
  const emptyMsg = c.status === 'Lead' ? 'Cliente em fase comercial — ainda sem faturas emitidas.' : c.status === 'Concluído' ? 'Projeto encerrado e totalmente liquidado.' : 'Sem faturas emitidas para este cliente.';
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid cols-3">
        <OvCard icon="euro" tone="violet" big={eur(c.value)} title="Valor de contrato" sub="Honorários contratados / propostos" />
        <OvCard icon="check" tone="green" big={eur(c.billed)} title="Faturado" sub={c.value > 0 ? Math.round(c.billed / c.value * 100) + '% do contrato' : '—'} />
        <OvCard icon="clock" tone="gold" big={eur(porFaturar)} title="Por faturar" sub={porFaturar > 0 ? 'Saldo do contrato' : 'Contrato liquidado'} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="card-h" style={{ padding: '18px 18px 0' }}><div><h3>Faturas</h3><span className="sub">Emitidas a este cliente</span></div></div>
          {invs.length ? (
            <table className="tbl" style={{ marginTop: 12 }}>
              <thead><tr><th>Fatura</th><th>Milestone</th><th>Valor</th><th>Estado</th></tr></thead>
              <tbody>
                {invs.map((inv, i) => (
                  <tr key={i}>
                    <td><span className="num" style={{ fontWeight: 700 }}>{inv.num}</span></td>
                    <td className="muted" style={{ fontWeight: 600 }}>{inv.milestone}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{eur(inv.amount)}</td>
                    <td><Badge tag={inv.tag}>{inv.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty" style={{ padding: '44px 20px' }}><Icon name="card" size={30} /><div style={{ marginTop: 10, fontWeight: 700, fontSize: 14.5, color: 'var(--text-2)' }}>Sem faturas</div><div style={{ marginTop: 4 }}>{emptyMsg}</div></div>
          )}
        </div>

        <div className="card card-pad">
          <div className="card-h"><div><h3 style={{ fontSize: 16 }}>Dados de faturação</h3></div></div>
          <Detail label="Cliente" value={c.company} />
          <Detail label="NIF" value={bill.nif || '—'} />
          <Detail label="Morada" value={bill.addr || '—'} />
          <Detail label="Condições" value={bill.terms || '—'} />
          <button className="btn btn-soft btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={() => go('payments')}>Abrir no financeiro <Icon name="arrowRight" size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const ROWS = [['Estado do projeto', true, true, true], ['Entregável aprovado', true, true, true], ['Pedido de aprovação', true, true, false], ['Nova fatura', true, false, true]];
  const init = () => ROWS.map(r => [r[1], r[2], r[3]]);
  const [vals, setVals] = useState(init);
  const toggle = (ri, ci) => setVals(v => v.map((row, i) => i === ri ? row.map((x, j) => j === ci ? !x : x) : row));
  return (
    <div className="card card-pad">
      <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Notificações</h3>
      <p className="muted" style={{ fontSize: 13.5, marginTop: 0 }}>Define como este cliente recebe atualizações dos projetos.</p>
      <table className="tbl" style={{ marginTop: 10 }}>
        <thead><tr><th>Tipo</th><th style={{ textAlign: 'center' }}>Email</th><th style={{ textAlign: 'center' }}>SMS</th><th style={{ textAlign: 'center' }}>Portal</th></tr></thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i}><td style={{ fontWeight: 600 }}>{r[0]}</td>{[0, 1, 2].map(j => <td key={j} style={{ textAlign: 'center' }}><input type="checkbox" checked={vals[i][j]} onChange={() => toggle(i, j)} style={{ width: 17, height: 17, accentColor: 'var(--navy)' }} /></td>)}</tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 9, marginTop: 16 }}><button className="btn btn-primary" onClick={() => window.PYToast && window.PYToast('Preferências guardadas')}>Guardar</button><button className="btn btn-ghost" onClick={() => setVals(init)}>Descartar</button></div>
    </div>
  );
}

function EditClienteModal({ open, onClose, c, onSave }) {
  const [f, setF] = useState({ contact: '', role: '', email: '', phone: '', city: '', status: 'Ativo' });
  useEffect(() => { if (open) setF({ contact: c.contact, role: c.role, email: c.email, phone: c.phone, city: c.city, status: c.status }); }, [open, c]);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  return (
    <Modal open={open} onClose={onClose} title="Editar detalhes" sub={c.company} width={540}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => { onSave(f); onClose(); }}><Icon name="check" size={15} /> Guardar</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Pessoa de contacto" half><TextInput value={f.contact} onChange={set('contact')} /></Field>
        <Field label="Função" half><TextInput value={f.role} onChange={set('role')} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Email" half><TextInput type="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Telefone" half><TextInput value={f.phone} onChange={set('phone')} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Localidade" half><TextInput value={f.city} onChange={set('city')} /></Field>
        <Field label="Estado" half><SelectInput value={f.status} onChange={set('status')}>
          {['Ativo', 'Em risco', 'Lead', 'Concluído'].map(o => <option key={o}>{o}</option>)}
        </SelectInput></Field>
      </div>
    </Modal>
  );
}

const REG_TIPOS = [{ t: 'Reunião', icon: 'users' }, { t: 'Chamada', icon: 'sms' }, { t: 'Email', icon: 'mail' }, { t: 'Proposta', icon: 'fileText' }, { t: 'Visita', icon: 'building' }];
function RegistarInteracaoModal({ open, onClose, onAdd }) {
  const [tipo, setTipo] = useState('Reunião');
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => { if (open) { setTipo('Reunião'); setText(''); setDate(''); } }, [open]);
  const submit = () => {
    if (!text.trim()) return;
    const ic = (REG_TIPOS.find(x => x.t === tipo) || {}).icon || 'message';
    onAdd({ type: tipo, icon: ic, text: text.trim(), date: date.trim() || 'Hoje', who: PEOPLE.miguel });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Registar interação" sub="Adiciona uma entrada ao histórico de contacto." width={500}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!text.trim()}><Icon name="plus" size={15} /> Registar</button>
      </React.Fragment>}>
      <Field label="Tipo de interação"><SelectInput value={tipo} onChange={(e) => setTipo(e.target.value)}>
        {REG_TIPOS.map(x => <option key={x.t}>{x.t}</option>)}
      </SelectInput></Field>
      <Field label="Descrição"><TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex.: Reunião de acompanhamento do projeto" /></Field>
      <Field label="Data"><TextInput value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ex.: 09 Jun 2026" /></Field>
    </Modal>
  );
}

function AddContactoModal({ open, onClose, onAdd }) {
  const [f, setF] = useState({ name: '', role: '', email: '', phone: '' });
  useEffect(() => { if (open) setF({ name: '', role: '', email: '', phone: '' }); }, [open]);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const submit = () => { if (!f.name.trim()) return; onAdd(f); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Adicionar contacto" sub="Nova pessoa de contacto do cliente." width={500}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!f.name.trim()}><Icon name="plus" size={15} /> Adicionar</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Nome" half><TextInput value={f.name} onChange={set('name')} placeholder="Nome completo" /></Field>
        <Field label="Função" half><TextInput value={f.role} onChange={set('role')} placeholder="Ex.: Departamento Financeiro" /></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Email" half><TextInput type="email" value={f.email} onChange={set('email')} placeholder="nome@empresa.pt" /></Field>
        <Field label="Telefone" half><TextInput value={f.phone} onChange={set('phone')} placeholder="+351 …" /></Field>
      </div>
    </Modal>
  );
}

Object.assign(window, { Clients });
