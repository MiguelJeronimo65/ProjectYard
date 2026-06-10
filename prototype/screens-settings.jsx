/* ProjectYard — Definições (Conta, Segurança, Plano, Equipa, Notificações, Integrações) */

const SET_SECTIONS = [
  { id: 'conta', label: 'Conta', icon: 'user', desc: 'Perfil e workspace' },
  { id: 'seguranca', label: 'Segurança', icon: 'lock', desc: 'Palavra-passe e 2FA' },
  { id: 'plano', label: 'Plano & Faturação', icon: 'card', desc: 'Subscrição e faturas' },
  { id: 'equipa', label: 'Equipa & permissões', icon: 'users', desc: 'Membros e papéis' },
  { id: 'lookups', label: 'Listas & lookups', icon: 'layers', desc: 'Fases, prioridades, estados' },
  { id: 'notificacoes', label: 'Notificações', icon: 'bell', desc: 'Email, SMS e portal' },
  { id: 'integracoes', label: 'Integrações', icon: 'layers', desc: 'Apps e serviços' },
];

const SET_TEAM = [
  { p: ME, email: ME.email, role: 'Superadmin', status: 'Ativo', last: 'Agora', me: true, protected: true },
  { p: PEOPLE.ana, email: 'ana.moreira@ateliernorte.pt', role: 'Administrador', status: 'Ativo', last: 'há 5 min' },
  { p: PEOPLE.rui, email: 'rui.cardoso@ateliernorte.pt', role: 'Gestor', status: 'Ativo', last: 'há 2 horas' },
  { p: PEOPLE.joana, email: 'joana.faria@ateliernorte.pt', role: 'Membro', status: 'Ativo', last: 'ontem' },
  { p: PEOPLE.sofia, email: 'sofia.lemos@ateliernorte.pt', role: 'Membro', status: 'Ativo', last: 'há 3 dias' },
  { p: PEOPLE.tiago, email: 'tiago.pinto@ateliernorte.pt', role: 'Membro', status: 'Convite pendente', last: '—' },
  { p: PEOPLE.miguel, email: 'miguel.nunes@ateliernorte.pt', role: 'Membro', status: 'Ativo', last: 'há 1 semana' },
  { p: { initials: 'HB', name: 'Helena Brás', color: '#2a7fb8', role: 'Imobiliária Atlântico' }, email: 'h.bras@atlantico.pt', role: 'Cliente', status: 'Ativo', last: 'há 2 dias' },
];

const SET_PLANS = [
  { id: 'starter', name: 'Starter', price: '29', tagline: 'Freelancers e ateliers pequenos', feats: ['3 projetos ativos', '1 utilizador', '5 GB de armazenamento', 'Suporte por email'] },
  { id: 'pro', name: 'Pro', price: '89', tagline: 'Ateliers em crescimento', current: true, feats: ['Projetos ilimitados', 'Até 15 utilizadores', '100 GB de armazenamento', 'SMS, Aprovações e Portal', 'Integrações BIM'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Sob consulta', enterprise: true, tagline: 'Grandes gabinetes', feats: ['Tudo do plano Pro', 'Utilizadores ilimitados', 'Armazenamento dedicado', 'SSO e SLA dedicado', 'Gestor de conta'] },
];

const SET_PERMS = {
  roles: ['Superadmin', 'Administrador', 'Gestor', 'Membro', 'Cliente'],
  rows: [
    { cap: 'Ver projetos e tarefas', vals: [1, 1, 1, 1, 2] },
    { cap: 'Criar e editar projetos', vals: [1, 1, 1, 0, 0] },
    { cap: 'Gerir tarefas e cronograma', vals: [1, 1, 1, 1, 0] },
    { cap: 'Aprovar entregáveis', vals: [1, 1, 1, 0, 0] },
    { cap: 'Faturação e pagamentos', vals: [1, 1, 0, 0, 0] },
    { cap: 'Enviar SMS a clientes', vals: [1, 1, 1, 0, 0] },
    { cap: 'Gerir equipa e permissões', vals: [1, 1, 0, 0, 0] },
    { cap: 'Gerir faturação do workspace', vals: [1, 0, 0, 0, 0] },
    { cap: 'Aceder ao portal do cliente', vals: [1, 1, 1, 0, 1] },
  ],
};

const SET_NOTIFS = [
  { ev: 'Tarefa atribuída a mim', email: true, sms: false, portal: true },
  { ev: 'Comentário ou menção', email: true, sms: false, portal: true },
  { ev: 'Entregável submetido', email: true, sms: false, portal: true },
  { ev: 'Pedido de aprovação', email: true, sms: true, portal: true },
  { ev: 'Aprovação concluída', email: true, sms: true, portal: false },
  { ev: 'Nova fatura ou pagamento', email: true, sms: false, portal: true },
  { ev: 'Risco aberto ou agravado', email: true, sms: true, portal: false },
  { ev: 'Resumo diário do workspace', email: false, sms: false, portal: true },
];

const SET_INTEGR = [
  { name: 'Google Calendar', cat: 'Calendário', mono: 'GC', color: '#2a7fb8', desc: 'Sincroniza prazos e marcos com a tua agenda.', on: true },
  { name: 'Microsoft 365', cat: 'Email & ficheiros', mono: 'M', color: '#d65151', desc: 'Outlook, calendário e documentos partilhados.', on: true },
  { name: 'Autodesk Cloud', cat: 'BIM / CAD', mono: 'A', color: '#e0922a', desc: 'Modelos BIM e ficheiros Revit e AutoCAD.', on: true },
  { name: 'Twilio SMS', cat: 'Comunicação', mono: 'Tw', color: '#d65151', desc: 'Envio de SMS e aprovações por mensagem.', on: true },
  { name: 'Dropbox', cat: 'Armazenamento', mono: 'Db', color: '#2a7fb8', desc: 'Guarda e versiona documentos do projeto.', on: false },
  { name: 'Stripe', cat: 'Pagamentos', mono: 'S', color: '#6a5af9', desc: 'Pagamentos online e referências Multibanco.', on: false },
  { name: 'Slack', cat: 'Comunicação', mono: 'Sl', color: '#9b59f5', desc: 'Notificações da equipa em canais dedicados.', on: false },
  { name: 'Zapier', cat: 'Automação', mono: 'Z', color: '#e0922a', desc: 'Liga o ProjectYard a mais de 5000 apps.', on: false },
];

const SET_SESSIONS = [
  { device: 'MacBook Pro · Chrome', loc: 'Porto, Portugal', ip: '85.243.118.x', last: 'Sessão atual', current: true },
  { device: 'iPhone 15 · App ProjectYard', loc: 'Porto, Portugal', ip: '95.94.21.x', last: 'há 3 horas' },
  { device: 'Windows 11 · Edge', loc: 'Lisboa, Portugal', ip: '188.250.4.x', last: 'ontem, 18:42' },
];

const SET_SUBINV = [
  { num: 'PY-INV-0042', date: '01 Jun 2026', plan: 'Plano Pro · Mensal', amount: '89,00 €', status: 'Pago' },
  { num: 'PY-INV-0039', date: '01 Mai 2026', plan: 'Plano Pro · Mensal', amount: '89,00 €', status: 'Pago' },
  { num: 'PY-INV-0036', date: '01 Abr 2026', plan: 'Plano Pro · Mensal', amount: '89,00 €', status: 'Pago' },
  { num: 'PY-INV-0033', date: '01 Mar 2026', plan: 'Plano Pro · Mensal', amount: '89,00 €', status: 'Pago' },
];

/* ---------- shared bits ---------- */
function StSwitch({ on, onClick, sm }) {
  return <button type="button" className={'sw' + (sm ? ' sw-sm' : '') + (on ? ' on' : '')} onClick={onClick} aria-pressed={on}></button>;
}

function StField({ label, defaultValue, placeholder, hint, type = 'text', icon, children }) {
  return (
    <div className="fld" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      {children || (
        <div className="fld__box">
          {icon && <Icon name={icon} size={16} />}
          <input type={type} defaultValue={defaultValue} placeholder={placeholder} />
        </div>
      )}
      {hint && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function StSelect({ label, options, defaultValue, hint }) {
  return (
    <div className="fld" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      <div className="fld__box" style={{ position: 'relative' }}>
        <select defaultValue={defaultValue} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '13px 0', fontSize: 14.5, fontWeight: 600, color: 'var(--text)', appearance: 'none', cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <Icon name="chevD" size={16} />
      </div>
      {hint && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function StCard({ title, sub, children, foot, danger }) {
  return (
    <div className="card card-pad" style={danger ? { borderColor: 'var(--danger-soft)' } : null}>
      {title && (
        <div className="card-h" style={{ marginBottom: 18, alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ color: danger ? 'var(--danger)' : undefined }}>{title}</h3>
            {sub && <span className="sub" style={{ display: 'block', marginTop: 3 }}>{sub}</span>}
          </div>
        </div>
      )}
      {children}
      {foot && (
        <React.Fragment>
          <div className="divider"></div>
          <div style={{ display: 'flex', gap: 9, justifyContent: 'flex-end' }}>{foot}</div>
        </React.Fragment>
      )}
    </div>
  );
}

function StGrid2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>{children}</div>;
}

const roleTag = (r) => r === 'Superadmin' ? 'b-navy' : r === 'Administrador' ? 'b-gold' : r === 'Gestor' ? 'b-violet' : r === 'Cliente' ? 'b-blue' : 'b-gray';

/* ===================== LISTAS & LOOKUPS ===================== */
const LK_PAL = ['#6a5af9', '#2a7fb8', '#1f9d6b', '#d9a32a', '#e8526b', '#9b59f5', '#21a8c4', '#ef7d54', '#e0922a', '#d65151', '#8a949e', '#233140'];

function ColorSwatches({ value, onPick }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} title="Mudar cor" style={{ width: 24, height: 24, borderRadius: 7, background: value, border: '2px solid var(--surface)', boxShadow: '0 0 0 1px var(--border)', cursor: 'pointer' }}></button>
      {open && (
        <React.Fragment>
          <div className="flt-backdrop" onClick={() => setOpen(false)}></div>
          <div className="flt-pop" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, minWidth: 'auto', padding: 9 }}>
            {LK_PAL.map(c => <button key={c} onClick={() => { onPick(c); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: value === c ? '2px solid var(--text)' : 'none', cursor: 'pointer' }}></button>)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function LookupCard({ title, sub, items, setItems }) {
  const [nv, setNv] = useState('');
  const [nc, setNc] = useState(LK_PAL[0]);
  const rename = (id, name) => setItems(it => it.map(x => x.id === id ? { ...x, name } : x));
  const recolor = (id, color) => setItems(it => it.map(x => x.id === id ? { ...x, color } : x));
  const toggle = (id) => setItems(it => it.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const remove = (id) => { const r = items.find(x => x.id === id); setItems(it => it.filter(x => x.id !== id)); if (window.PYToast) window.PYToast('“' + (r ? r.name : '') + '” removido'); };
  const add = () => { if (!nv.trim()) return; setItems(it => [...it, { id: 'n' + Date.now(), name: nv.trim(), color: nc, active: true }]); if (window.PYToast) window.PYToast('“' + nv.trim() + '” adicionado'); setNv(''); };
  return (
    <StCard title={title} sub={sub}>
      <table className="tbl">
        <thead><tr><th style={{ width: 54 }}>Cor</th><th>Nome</th><th style={{ width: 70, textAlign: 'center' }}>Ordem</th><th style={{ width: 80, textAlign: 'center' }}>Ativo</th><th style={{ width: 46 }}></th></tr></thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id}>
              <td><ColorSwatches value={it.color} onPick={(c) => recolor(it.id, c)} /></td>
              <td><input value={it.name} onChange={(e) => rename(it.id, e.target.value)} className="lk-input" /></td>
              <td className="num muted-3" style={{ textAlign: 'center', fontWeight: 700 }}>{i + 1}</td>
              <td style={{ textAlign: 'center' }}><button className={'sw sw-sm' + (it.active ? ' on' : '')} onClick={() => toggle(it.id)}></button></td>
              <td style={{ textAlign: 'right' }}><button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => remove(it.id)} title="Remover"><Icon name="x" size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <ColorSwatches value={nc} onPick={setNc} />
        <input value={nv} onChange={(e) => setNv(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Novo valor…" className="lk-input" style={{ flex: 1, background: 'var(--surface-2)' }} />
        <button className="btn btn-primary btn-sm" onClick={add}><Icon name="plus" size={14} /> Adicionar</button>
      </div>
    </StCard>
  );
}

function StLookups() {
  const [fases, setFases] = useState(LK_FASES.map((n, i) => ({ id: 'f' + i, name: n, color: LK_PAL[i % LK_PAL.length], active: true })));
  const [prios, setPrios] = useState([
    { id: 'p1', name: 'Alta', color: '#d65151', active: true },
    { id: 'p2', name: 'Média', color: '#e0922a', active: true },
    { id: 'p3', name: 'Baixa', color: '#8a949e', active: true },
  ]);
  const [estados, setEstados] = useState([
    { id: 'e1', name: 'Por fazer', color: '#8a949e', active: true },
    { id: 'e2', name: 'Em curso', color: '#2a7fb8', active: true },
    { id: 'e3', name: 'Em revisão', color: '#e0922a', active: true },
    { id: 'e4', name: 'Concluído', color: '#1f9d6b', active: true },
  ]);
  const [tipos, setTipos] = useState([
    { id: 't1', name: 'Produção', color: '#6a5af9', active: true },
    { id: 't2', name: 'Coordenação', color: '#2a7fb8', active: true },
    { id: 't3', name: 'Reunião', color: '#8a949e', active: true },
    { id: 't4', name: 'Licenciamento', color: '#e0922a', active: true },
    { id: 't5', name: 'Assistência', color: '#1f9d6b', active: true },
    { id: 't6', name: 'Deslocação', color: '#ef7d54', active: true },
  ]);
  const [evtipos, setEvtipos] = useState([
    { id: 'ev1', name: 'Reuniões', color: '#6a5af9', active: true },
    { id: 'ev2', name: 'Prazos', color: '#d65151', active: true },
    { id: 'ev3', name: 'Visitas de obra', color: '#e0922a', active: true },
    { id: 'ev4', name: 'Aprovações', color: '#2a7fb8', active: true },
    { id: 'ev5', name: 'Pessoal', color: '#1f9d6b', active: true },
  ]);
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, color: 'var(--accent-700)' }}>
        <Icon name="shield" size={16} /> Tabelas de referência do workspace. Só <b>Superadmin</b> e <b>Administrador</b> podem editar; renomear não afeta o histórico (as tarefas guardam a referência).
      </div>
      <LookupCard title="Fases do projeto" sub="Usadas em tarefas, entregáveis, horas e cronograma" items={fases} setItems={setFases} />
      <div className="grid cols-2">
        <LookupCard title="Prioridades" sub="Nível de urgência das tarefas" items={prios} setItems={setPrios} />
        <LookupCard title="Estados de tarefa" sub="Colunas do quadro Kanban" items={estados} setItems={setEstados} />
      </div>
      <div className="grid cols-2">
        <LookupCard title="Tipos de hora" sub="Categorias no registo de horas" items={tipos} setItems={setTipos} />
        <LookupCard title="Tipos de evento" sub="Filtros e cores do calendário" items={evtipos} setItems={setEvtipos} />
      </div>
    </div>
  );
}

/* ===================== CONTA ===================== */
function StAccount() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <StCard title="Perfil pessoal" sub="A tua informação dentro do workspace"
        foot={<React.Fragment><button className="btn btn-ghost">Cancelar</button><button className="btn btn-primary">Guardar alterações</button></React.Fragment>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <Avatar p={ME} size={66} />
          <div style={{ display: 'flex', gap: 9 }}>
            <button className="btn btn-soft btn-sm"><Icon name="upload" size={14} /> Mudar foto</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-3)' }}>Remover</button>
          </div>
        </div>
        <StGrid2>
          <StField label="Nome" defaultValue={ME.name} />
          <StField label="Cargo" defaultValue={ME.role} />
          <StField label="Email" defaultValue={ME.email} icon="mail" />
          <StField label="Telefone" defaultValue="+351 93 100 2030" />
          <StSelect label="Idioma" options={['Português (PT)', 'English', 'Español']} defaultValue="Português (PT)" />
          <StSelect label="Fuso horário" options={['(GMT+00:00) Lisboa', '(GMT+01:00) Madrid', '(GMT+00:00) Londres']} defaultValue="(GMT+00:00) Lisboa" />
        </StGrid2>
      </StCard>

      <StCard title="Dados do workspace" sub="Identidade do gabinete usada em propostas e faturas"
        foot={<React.Fragment><button className="btn btn-ghost">Cancelar</button><button className="btn btn-primary">Guardar alterações</button></React.Fragment>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div className="brand__logo" style={{ width: 60, height: 60, borderRadius: 14 }}><img src="assets/projectyard-icon.png" alt="logo" /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Atelier Norte</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Logótipo apresentado a clientes · PNG ou SVG</div>
            <button className="btn btn-soft btn-sm" style={{ marginTop: 9 }}><Icon name="upload" size={14} /> Carregar logótipo</button>
          </div>
        </div>
        <StGrid2>
          <StField label="Nome do gabinete" defaultValue="Atelier Norte" />
          <StField label="NIF" defaultValue="509 482 117" />
          <StField label="Morada" defaultValue="Rua de Cedofeita 215, Porto" />
          <StField label="Website" defaultValue="ateliernorte.pt" icon="grid" />
          <StSelect label="Área de atividade" options={['Arquitetura', 'Engenharia', 'Arquitetura + Engenharia', 'Construção']} defaultValue="Arquitetura + Engenharia" />
          <StField label="Email de faturação" defaultValue="faturacao@ateliernorte.pt" icon="mail" />
        </StGrid2>
      </StCard>

      <StCard title="Eliminar workspace" sub="Esta ação é permanente e não pode ser revertida" danger>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="muted" style={{ flex: 1, minWidth: 240, fontSize: 13.5, fontWeight: 600 }}>
            Ao eliminar o workspace, todos os projetos, documentos e dados de faturação serão removidos definitivamente.
          </div>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}><Icon name="alert" size={15} /> Eliminar workspace</button>
        </div>
      </StCard>
    </div>
  );
}

/* ===================== SEGURANÇA ===================== */
function StSecurity() {
  const [twofa, setTwofa] = useState(true);
  return (
    <div className="grid" style={{ gap: 20 }}>
      <StCard title="Palavra-passe" sub="Recomendamos uma palavra-passe forte e única"
        foot={<button className="btn btn-primary">Atualizar palavra-passe</button>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ gridColumn: '1 / -1', maxWidth: 360 }}><StField label="Palavra-passe atual" type="password" defaultValue="000000000000" icon="lock" /></div>
          <StField label="Nova palavra-passe" type="password" placeholder="Mínimo 8 caracteres" icon="lock" />
          <StField label="Confirmar nova palavra-passe" type="password" placeholder="Repetir palavra-passe" icon="lock" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 5, flex: 1, maxWidth: 220 }}>
            {[1, 2, 3, 4].map(i => <span key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= 3 ? 'var(--success)' : 'var(--surface-3)' }}></span>)}
          </div>
          <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 700 }}>Força: <b style={{ color: 'var(--success)' }}>Forte</b></span>
        </div>
      </StCard>

      <StCard title="Autenticação de dois fatores (2FA)" sub="Camada extra de segurança ao iniciar sessão">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--success-soft)', color: 'var(--success)', display: 'grid', placeItems: 'center' }}><Icon name="shield" size={22} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>App de autenticação</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{twofa ? 'Ativa · Google Authenticator' : 'Desativada'}</div>
          </div>
          {twofa && <Badge tag="b-green">Ativa</Badge>}
          <StSwitch on={twofa} onClick={() => setTwofa(v => !v)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', marginTop: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--info-soft)', color: 'var(--info)', display: 'grid', placeItems: 'center' }}><Icon name="sms" size={22} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Código por SMS</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Enviado para +351 93 100 2030</div>
          </div>
          <button className="btn btn-ghost btn-sm">Configurar</button>
        </div>
      </StCard>

      <StCard title="Sessões ativas" sub="Dispositivos com sessão iniciada nesta conta"
        foot={<button className="btn btn-ghost" style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}>Terminar todas as outras sessões</button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SET_SESSIONS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}><Icon name={s.device.includes('iPhone') ? 'sms' : 'grid'} size={19} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>{s.device} {s.current && <Badge tag="b-green">Atual</Badge>}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{s.loc} · {s.ip} · {s.last}</div>
              </div>
              {!s.current && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-3)' }}>Terminar</button>}
            </div>
          ))}
        </div>
      </StCard>
    </div>
  );
}

/* ===================== PLANO & FATURAÇÃO ===================== */
function StBilling() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      {/* current plan banner */}
      <div className="card" style={{ padding: 22, background: 'var(--grad)', color: '#fff', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge b-gold" style={{ background: 'var(--accent-soft2)', color: '#fff' }}><Icon name="spark" size={13} /> Plano Pro</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, opacity: .8 }}>Trial · 18 dias restantes</span>
          </div>
          <div className="display" style={{ fontSize: 27, fontWeight: 700, marginTop: 12 }}>89 € <span style={{ fontSize: 15, fontWeight: 600, opacity: .75 }}>/ mês · faturado mensalmente</span></div>
          <div style={{ fontSize: 13.5, fontWeight: 600, opacity: .82, marginTop: 4 }}>Próxima renovação a 26 Jun 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', borderColor: 'rgba(255,255,255,.22)' }}>Mudar plano</button>
          <button className="btn btn-gold"><Icon name="arrowUp" size={15} /> Fazer upgrade</button>
        </div>
      </div>

      {/* usage */}
      <StCard title="Utilização" sub="Consumo do plano neste ciclo">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { label: 'Projetos ativos', val: 6, max: '∞', pct: 30, note: 'Ilimitados no Pro' },
            { label: 'Utilizadores', val: 7, max: 15, pct: 47, note: '8 lugares disponíveis' },
            { label: 'Armazenamento', val: '38 GB', max: '100 GB', pct: 38, note: '62 GB livres' },
          ].map((u, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{u.label}</span>
                <span className="num" style={{ fontWeight: 700, fontSize: 14 }}>{u.val} <span className="muted-3" style={{ fontSize: 12.5 }}>/ {u.max}</span></span>
              </div>
              <Progress value={u.pct} />
              <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 7 }}>{u.note}</div>
            </div>
          ))}
        </div>
      </StCard>

      {/* plans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17 }}>Planos disponíveis</h3>
          <div className="seg" style={{ marginLeft: 'auto' }}>
            <button className="active">Mensal</button>
            <button>Anual <span className="badge b-green" style={{ marginLeft: 5, padding: '1px 7px', fontSize: 10.5 }}>−20%</span></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {SET_PLANS.map(pl => (
            <div key={pl.id} className={'plan-card' + (pl.current ? ' current' : '')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{pl.name}</span>
                {pl.current && <Badge tag="b-gold">Plano atual</Badge>}
              </div>
              <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: -6 }}>{pl.tagline}</div>
              <div className="display" style={{ fontSize: pl.enterprise ? 22 : 30, fontWeight: 700 }}>
                {pl.enterprise ? pl.price : <React.Fragment>{pl.price} €<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)' }}> /mês</span></React.Fragment>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {pl.feats.map((f, i) => <div key={i} className="plan-feat"><Icon name="check" size={16} /> {f}</div>)}
              </div>
              <button className={'btn ' + (pl.current ? 'btn-soft' : pl.enterprise ? 'btn-ghost' : 'btn-primary')} style={{ justifyContent: 'center', marginTop: 'auto' }} disabled={pl.current}>
                {pl.current ? 'Plano atual' : pl.enterprise ? 'Falar com vendas' : 'Escolher Pro'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* payment + invoices */}
      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        <StCard title="Método de pagamento" foot={<button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Alterar cartão</button>}>
          <div style={{ borderRadius: 'var(--r)', background: 'var(--grad)', color: '#fff', padding: 18, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Icon name="card" size={26} />
              <span style={{ fontWeight: 700, fontSize: 13, opacity: .85 }}>VISA</span>
            </div>
            <div>
              <div className="num" style={{ fontSize: 17, letterSpacing: '0.12em', fontWeight: 600 }}>•••• •••• •••• 4218</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, opacity: .82, marginTop: 6 }}><span>Ana Moreira</span><span>09/28</span></div>
            </div>
          </div>
          <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 12 }}>Cobrança a 1 de cada mês. IVA incluído à taxa legal em vigor.</div>
        </StCard>

        <StCard title="Histórico de faturas" sub="Faturas da subscrição ProjectYard">
          <table className="tbl" style={{ marginTop: -4 }}>
            <thead><tr><th>Fatura</th><th>Data</th><th>Plano</th><th>Valor</th><th></th></tr></thead>
            <tbody>
              {SET_SUBINV.map((inv, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }} className="num">{inv.num}</td>
                  <td className="muted" style={{ fontWeight: 600 }}>{inv.date}</td>
                  <td style={{ fontWeight: 600, fontSize: 13.5 }}>{inv.plan}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{inv.amount}</td>
                  <td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm"><Icon name="download" size={14} /> PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </StCard>
      </div>
    </div>
  );
}

/* ===================== EQUIPA & PERMISSÕES ===================== */
function StTeam() {
  const SEAT_LIMIT = 15;
  const [team, setTeam] = useState(SET_TEAM);
  const [channel, setChannel] = useState('email');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('Membro');
  const sendInvite = () => {
    const handle = contact.trim();
    if (!handle) return;
    const initials = channel === 'email' ? (handle.replace(/@.*/, '').slice(0, 2) || 'NN').toUpperCase() : 'SMS';
    const palette = ['#6a5af9', '#21a8c4', '#1f9d6b', '#e0922a', '#9b59f5', '#ef7d54', '#2a7fb8', '#d65151'];
    const p = { initials, name: handle, color: palette[team.length % palette.length] };
    setTeam(t => [...t, { p, email: handle, role, status: 'Pendente', last: channel === 'email' ? 'Convite por email' : 'Convite por SMS', via: channel, invited: true }]);
    if (window.PYToast) window.PYToast('Convite ' + (channel === 'email' ? 'por email' : 'por SMS') + ' enviado · ' + role);
    setContact('');
  };
  return (
    <div className="grid" style={{ gap: 20 }}>
      <StCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17 }}>Membros da equipa</h3>
            <span className="sub" style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 600 }}>{team.length} membros · {Math.min(team.length, SEAT_LIMIT)} de {SEAT_LIMIT} lugares ocupados</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="seg">
            <button className={channel === 'email' ? 'active' : ''} onClick={() => setChannel('email')}><Icon name="mail" size={14} /> Email</button>
            <button className={channel === 'sms' ? 'active' : ''} onClick={() => setChannel('sms')}><Icon name="sms" size={14} /> SMS</button>
          </div>
          <div className="fld__box" style={{ padding: '0 12px', minWidth: 220, flex: 1 }}>
            <Icon name={channel === 'email' ? 'mail' : 'sms'} size={15} />
            <input value={contact} onChange={e => setContact(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendInvite(); }} placeholder={channel === 'email' ? 'convite@email.pt' : '+351 …'} style={{ border: 'none', outline: 'none', background: 'transparent', padding: '11px 0', fontSize: 13.5, flex: 1 }} />
          </div>
          <div style={{ minWidth: 150 }}><SelectInput value={role} onChange={e => setRole(e.target.value)}>{['Administrador', 'Gestor', 'Membro', 'Cliente'].map(r => <option key={r}>{r}</option>)}</SelectInput></div>
          <button className="btn btn-primary" onClick={sendInvite} disabled={!contact.trim()}><Icon name="plus" size={15} /> Convidar</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Membro</th><th>Papel</th><th>Estado</th><th>Última atividade</th><th></th></tr></thead>
          <tbody>
            {team.map((m, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar p={m.p} size={38} />
                    <div>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>{m.p.name}{m.me && <span className="badge b-gray" style={{ padding: '1px 7px', fontSize: 10.5 }}>Tu</span>}</div>
                      <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td><Badge tag={roleTag(m.role)}>{m.role}</Badge></td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13, color: m.status === 'Ativo' ? 'var(--success)' : 'var(--warning)' }}><span style={{ width: 7, height: 7, borderRadius: 99, background: 'currentColor' }}></span>{m.status}</span></td>
                <td className="muted" style={{ fontWeight: 600, fontSize: 13.5 }}>{m.last}</td>
                <td style={{ textAlign: 'right' }}>{m.protected
                  ? <span title="Protegido — não pode ser removido" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontWeight: 700, fontSize: 12 }}><Icon name="lock" size={14} /> Protegido</span>
                  : m.invited
                    ? <button className="btn btn-ghost btn-sm" onClick={() => setTeam(t => t.filter((_, j) => j !== i))}><Icon name="x" size={14} /> Cancelar</button>
                    : <button className="icon-btn" style={{ width: 34, height: 34 }}><Icon name="more" size={17} /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StCard>

      <StCard title="Papéis e permissões" sub="O que cada papel pode fazer no workspace">
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: 620 }}>
            <thead>
              <tr>
                <th>Permissão</th>
                {SET_PERMS.roles.map(r => <th key={r} style={{ textAlign: 'center' }}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {SET_PERMS.rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: 13.5 }}>{row.cap}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} style={{ textAlign: 'center' }}>
                      {v === 1 ? <span style={{ color: 'var(--success)', display: 'inline-grid', placeItems: 'center' }}><Icon name="check" size={17} /></span>
                        : v === 2 ? <span className="muted-3" style={{ fontSize: 11.5, fontWeight: 700 }}>Próprios</span>
                          : <span style={{ color: 'var(--border-2)' }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 14, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="lock" size={13} /> Apenas administradores podem alterar papéis e permissões.</div>
      </StCard>
    </div>
  );
}

/* ===================== NOTIFICAÇÕES ===================== */
function StNotify() {
  const [rows, setRows] = useState(SET_NOTIFS);
  const toggle = (i, key) => setRows(rs => rs.map((r, j) => j === i ? { ...r, [key]: !r[key] } : r));
  return (
    <div className="grid" style={{ gap: 20 }}>
      <StCard title="Preferências de notificação" sub="Escolhe como queres ser avisado de cada evento"
        foot={<React.Fragment><button className="btn btn-ghost">Repor predefinições</button><button className="btn btn-primary">Guardar</button></React.Fragment>}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Evento</th>
              <th style={{ textAlign: 'center', width: 110 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Icon name="mail" size={14} /> Email</span></th>
              <th style={{ textAlign: 'center', width: 110 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Icon name="sms" size={14} /> SMS</span></th>
              <th style={{ textAlign: 'center', width: 110 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Icon name="bell" size={14} /> Portal</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: 13.5 }}>{r.ev}</td>
                {['email', 'sms', 'portal'].map(k => (
                  <td key={k} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex' }}><StSwitch sm on={r[k]} onClick={() => toggle(i, k)} /></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </StCard>

      <StCard title="Canais e horários">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Resumo diário por email</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Um email às 08:00 com tarefas, prazos e aprovações do dia.</div>
          </div>
          <StSwitch on={true} onClick={() => { }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Horário de silêncio</div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Não enviar SMS nem notificações fora deste período.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13.5 }}>
            <span style={{ padding: '7px 12px', border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)' }}>20:00</span>
            <span className="muted-3">até</span>
            <span style={{ padding: '7px 12px', border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)' }}>08:00</span>
          </div>
        </div>
      </StCard>
    </div>
  );
}

/* ===================== INTEGRAÇÕES ===================== */
function StIntegrations() {
  const [items, setItems] = useState(SET_INTEGR);
  const toggle = (i) => setItems(its => its.map((it, j) => j === i ? { ...it, on: !it.on } : it));
  const connected = items.filter(i => i.on).length;
  return (
    <div className="grid" style={{ gap: 20 }}>
      <StCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17 }}>Integrações</h3>
            <span className="sub" style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 600 }}>{connected} ligadas · liga o ProjectYard às tuas ferramentas</span>
          </div>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto' }}><Icon name="search" size={15} /> Explorar diretório</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {items.map((it, i) => (
            <div key={i} className="integ-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                <div className="integ-logo" style={{ background: it.color }}>{it.mono}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{it.name}</span>
                    {it.on && <Badge tag="b-green">Ligado</Badge>}
                  </div>
                  <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{it.cat}</div>
                </div>
                <StSwitch on={it.on} onClick={() => toggle(i)} />
              </div>
              <div className="muted" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{it.desc}</div>
              <button className={'btn btn-sm ' + (it.on ? 'btn-ghost' : 'btn-soft')} style={{ justifyContent: 'center' }} onClick={() => toggle(i)}>
                {it.on ? <React.Fragment><Icon name="settings" size={14} /> Gerir ligação</React.Fragment> : <React.Fragment><Icon name="plus" size={14} /> Ligar</React.Fragment>}
              </button>
            </div>
          ))}
        </div>
      </StCard>

      <StCard title="Chave de API" sub="Para integrações personalizadas e webhooks">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="fld__box num" style={{ flex: 1, minWidth: 260, padding: '0 14px', letterSpacing: '0.04em', color: 'var(--text-2)' }}>
            <Icon name="lock" size={15} />
            <input readOnly value="py_live_8f2a••••••••••••••••3c91" style={{ border: 'none', outline: 'none', background: 'transparent', padding: '12px 0', fontSize: 13.5, flex: 1, fontFamily: 'var(--font-display)' }} />
          </div>
          <button className="btn btn-ghost"><Icon name="paperclip" size={15} /> Copiar</button>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}>Regenerar</button>
        </div>
      </StCard>
    </div>
  );
}

/* ===================== ROOT ===================== */
function SettingsScreen({ go }) {
  const [sec, setSec] = useState('conta');
  const active = SET_SECTIONS.find(s => s.id === sec);

  let body;
  switch (sec) {
    case 'conta': body = <StAccount />; break;
    case 'seguranca': body = <StSecurity />; break;
    case 'plano': body = <StBilling />; break;
    case 'equipa': body = <StTeam />; break;
    case 'lookups': body = <StLookups />; break;
    case 'notificacoes': body = <StNotify />; break;
    case 'integracoes': body = <StIntegrations />; break;
    default: body = <StAccount />;
  }

  return (
    <div className="content">
      <PageHead title="Definições" sub="Gere a tua conta, equipa, plano e integrações do workspace" />
      <div className="grid" style={{ gridTemplateColumns: '244px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 8, position: 'sticky', top: 90 }}>
          {SET_SECTIONS.map(s => (
            <button key={s.id} className={'set-nav' + (sec === s.id ? ' active' : '')} onClick={() => setSec(s.id)}>
              <Icon name={s.icon} size={18} />
              <div style={{ minWidth: 0 }}>
                <div style={{ lineHeight: 1.2 }}>{s.label}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: sec === s.id ? 'var(--accent-700)' : 'var(--text-3)', opacity: .85 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div key={sec} className="rise">{body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
