/* ProjectYard — Consola de Plataforma (Superadmin transversal)
   Lista todos os workspaces (ateliers) e permite entrar em cada um. */

function PlatformConsole({ go, onOpen }) {
  const [tenants, setTenants] = useState(TENANTS);
  const [wiz, setWiz] = useState(false);
  const total = tenants.length;
  const projetos = tenants.reduce((a, t) => a + t.projetos, 0);
  const faturado = tenants.reduce((a, t) => a + t.faturado, 0);
  const trials = tenants.filter(t => t.estado === 'Trial').length;
  const suspensos = tenants.filter(t => t.estado === 'Suspenso').length;
  const estTag = (e) => e === 'Ativo' ? 'b-green' : e === 'Trial' ? 'b-amber' : e === 'Suspenso' ? 'b-red' : 'b-gray';
  const createWorkspace = (d) => {
    const initials = (d.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('') || 'NW').toUpperCase();
    const palette = ['#6a5af9', '#21a8c4', '#1f9d6b', '#e0922a', '#9b59f5', '#ef7d54', '#2a7fb8', '#d65151'];
    const users = 1 + d.members.length;
    const nt = { name: d.name.trim(), slug: d.slug, plan: d.plan, initials, color: palette[tenants.length % palette.length], trial: d.estado === 'Trial', projetos: 0, membros: users, faturado: 0, estado: d.estado, owner: d.ownerName, isNew: true };
    setTenants(ts => [nt, ...ts]);
    setWiz(false);
    if (window.PYToast) window.PYToast('Workspace criado · ' + nt.name + ' · ' + users + ' utilizador' + (users === 1 ? '' : 'es'));
  };

  return (
    <div className="content">
      <PageHead
        title="Workspaces"
        sub="Consola de plataforma · todos os ateliers que operam no ProjectYard"
        actions={<React.Fragment>
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setWiz(true)}><Icon name="plus" size={16} /> Novo workspace</button>
        </React.Fragment>}
      />

      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        <Stat icon="building" iconBg="var(--primary-soft)" iconColor="var(--primary)" value={total} label="Workspaces" foot={`${total - trials - suspensos} ativos · ${trials} em trial`} />
        <Stat icon="folder" iconBg="var(--accent-soft)" iconColor="var(--accent-700)" value={fmt(projetos)} label="Projetos (todos)" foot="Agregado da plataforma" />
        <Stat icon="euro" iconBg="var(--success-soft)" iconColor="var(--success)" value={kk(faturado)} label="Faturação agregada" foot="Ano · todos os ateliers" />
        <Stat icon="alert" iconBg="var(--warning-soft)" iconColor="var(--warning)" value={trials + suspensos} label="A precisar de atenção" foot={`${trials} trial · ${suspensos} suspenso`} />
      </div>

      <div className="grid cols-3">
        {tenants.map(t => (
          <div key={t.slug} className="card card-pad rise" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar p={{ initials: t.initials, color: t.color }} size={48} sq />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15.5, fontFamily: 'var(--font-display)' }}>{t.name}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>projectyard.app/{t.slug}</div>
              </div>
              <Badge tag={estTag(t.estado)} dot={false}>{t.estado}</Badge>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <ConsoleStat n={t.projetos} l="Projetos" />
              <ConsoleStat n={t.membros} l="Membros" />
              <ConsoleStat n={kk(t.faturado)} l="Faturado" />
            </div>

            <div className="divider" style={{ margin: 0 }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>Proprietário</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{t.owner}</div>
              </div>
              <span className={'badge ' + (t.plan === 'Enterprise' ? 'b-violet' : t.plan === 'Pro' ? 'b-gold' : 'b-gray')} style={{ fontSize: 11 }}>{t.plan}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onOpen(t)} disabled={t.estado === 'Suspenso'}>
              {t.estado === 'Suspenso' ? <React.Fragment><Icon name="lock" size={15} /> Suspenso</React.Fragment> : <React.Fragment><Icon name="arrowRight" size={16} /> Abrir workspace</React.Fragment>}
            </button>
          </div>
        ))}
      </div>

      <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 18, display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name="shield" size={14} /> Acesso de plataforma · ao abrir um workspace entras em modo de apoio, com registo de auditoria.
      </div>
      <NovoWorkspaceModal open={wiz} onClose={() => setWiz(false)} onCreate={createWorkspace} existing={tenants} />
    </div>
  );
}

function ConsoleStat({ n, l }) {
  return (
    <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '11px 12px' }}>
      <div className="num" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>{n}</div>
      <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{l}</div>
    </div>
  );
}

/* Wizard — criar workspace (Passo 1: tenant + proprietário · Passo 2: convidar utilizadores) */
function NovoWorkspaceModal({ open, onClose, onCreate, existing }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [plan, setPlan] = useState('Pro');
  const [estado, setEstado] = useState('Trial');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [mChannel, setMChannel] = useState('email');
  const [mContact, setMContact] = useState('');
  const [mRole, setMRole] = useState('Membro');
  useEffect(() => { if (open) { setStep(1); setName(''); setSlug(''); setSlugEdited(false); setPlan('Pro'); setEstado('Trial'); setOwnerName(''); setOwnerEmail(''); setMembers([]); setMChannel('email'); setMContact(''); setMRole('Membro'); } }, [open]);
  const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const onName = (v) => { setName(v); if (!slugEdited) setSlug(slugify(v)); };
  const slugTaken = !!slug && existing.some(t => t.slug === slug);
  const step1ok = name.trim() && slug && !slugTaken && ownerName.trim() && /.+@.+\..+/.test(ownerEmail);
  const addMember = () => { const c = mContact.trim(); if (!c) return; setMembers(m => [...m, { contact: c, channel: mChannel, role: mRole }]); setMContact(''); };
  const ownerInit = (ownerName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('') || 'OW').toUpperCase();

  return (
    <Modal open={open} onClose={onClose} width={560}
      title="Novo workspace"
      sub={step === 1 ? 'Passo 1 de 2 · dados do atelier e proprietário' : 'Passo 2 de 2 · convidar os primeiros utilizadores'}
      footer={step === 1
        ? <React.Fragment>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={!step1ok} onClick={() => setStep(2)}>Continuar <Icon name="arrowRight" size={15} /></button>
          </React.Fragment>
        : <React.Fragment>
            <button className="btn btn-ghost" onClick={() => setStep(1)}><Icon name="chevL" size={15} /> Voltar</button>
            <button className="btn btn-primary" onClick={() => onCreate({ name, slug, plan, estado, ownerName, ownerEmail, members })}><Icon name="check" size={15} /> Criar workspace</button>
          </React.Fragment>}>
      {step === 1 ? (
        <React.Fragment>
          <Field label="Nome do atelier / empresa"><TextInput value={name} onChange={e => onName(e.target.value)} placeholder="Ex.: Atelier Norte" /></Field>
          <Field label="Endereço (slug)" hint={slugTaken ? '⚠ já existe um workspace com este endereço' : 'projectyard.app/' + (slug || '…')}>
            <div className="fld__box" style={{ height: 46 }}><span style={{ color: 'var(--text-3)', fontWeight: 600, fontSize: 13 }}>projectyard.app/</span><input value={slug} onChange={e => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} placeholder="atelier-norte" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, marginLeft: 2, fontSize: 14, fontWeight: 600, color: slugTaken ? 'var(--danger)' : 'var(--text)' }} /></div>
          </Field>
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Plano" half><SelectInput value={plan} onChange={e => setPlan(e.target.value)}>{['Starter', 'Pro', 'Enterprise'].map(p => <option key={p}>{p}</option>)}</SelectInput></Field>
            <Field label="Estado inicial" half>
              <div className="seg" style={{ width: '100%' }}>{['Trial', 'Ativo'].map(s => <button key={s} className={estado === s ? 'active' : ''} style={{ flex: 1 }} onClick={() => setEstado(s)}>{s}</button>)}</div>
            </Field>
          </div>
          <div className="divider"></div>
          <div className="muted-3" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="user" size={13} /> Proprietário · primeiro utilizador (Owner)</div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Nome" half><TextInput value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Nome do responsável" /></Field>
            <Field label="Email" half><TextInput type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@atelier.pt" /></Field>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', marginBottom: 16 }}>
            <Avatar p={{ initials: ownerInit, color: '#6a5af9' }} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>{ownerName} <span className="badge b-gold" style={{ padding: '1px 7px', fontSize: 10 }}>Owner</span></div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{ownerEmail}</div></div>
          </div>
          <Field label="Convidar utilizador (email ou SMS)">
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              <div className="seg"><button className={mChannel === 'email' ? 'active' : ''} onClick={() => setMChannel('email')}><Icon name="mail" size={14} /></button><button className={mChannel === 'sms' ? 'active' : ''} onClick={() => setMChannel('sms')}><Icon name="sms" size={14} /></button></div>
              <div className="fld__box" style={{ flex: 1, minWidth: 150, padding: '0 12px' }}><input value={mContact} onChange={e => setMContact(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMember(); } }} placeholder={mChannel === 'email' ? 'email@…' : '+351 …'} style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, padding: '11px 0', fontSize: 13.5 }} /></div>
              <div style={{ minWidth: 132 }}><SelectInput value={mRole} onChange={e => setMRole(e.target.value)}>{['Administrador', 'Gestor', 'Membro', 'Cliente'].map(r => <option key={r}>{r}</option>)}</SelectInput></div>
              <button className="btn btn-soft" onClick={addMember} disabled={!mContact.trim()}><Icon name="plus" size={15} /></button>
            </div>
          </Field>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {members.length === 0 && <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, padding: '8px 2px' }}>Ainda sem convites. Podes criar o workspace só com o proprietário e convidar depois.</div>}
            {members.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                <Icon name={m.channel === 'email' ? 'mail' : 'sms'} size={15} style={{ color: 'var(--text-3)' }} />
                <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{m.contact}</span>
                <span className="badge b-gray" style={{ padding: '1px 8px', fontSize: 11 }}>{m.role}</span>
                <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setMembers(ms => ms.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 14, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="shield" size={13} /> Os convidados recebem um link para definir a password. Total: {1 + members.length} utilizador{1 + members.length === 1 ? '' : 'es'}.</div>
        </React.Fragment>
      )}
    </Modal>
  );
}

Object.assign(window, { PlatformConsole });
