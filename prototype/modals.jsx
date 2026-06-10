/* ProjectYard — Modais globais: Command palette (⌘K) + Novo projeto */

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function CommandPalette({ open, onClose, go, onNovo }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);

  const screens = NAV_GROUPS.flatMap(g => g.items).concat([{ id: 'settings', label: 'Definições', icon: 'settings' }]);
  const actions = [
    { id: 'a-novo', label: 'Novo projeto', icon: 'plus', hint: 'Criar', run: () => onNovo() },
    { id: 'a-crono', label: 'Iniciar cronómetro', icon: 'play', hint: 'Horas', run: () => go('timesheets') },
    { id: 'a-fatura', label: 'Nova fatura', icon: 'euro', hint: 'Financeiro', run: () => go('payments') },
  ];
  const nq = norm(q);
  const fScreens = screens.filter(s => norm(s.label).includes(nq));
  const fActions = actions.filter(a => norm(a.label).includes(nq));
  const flat = [...fScreens.map(s => ({ kind: 's', ...s })), ...fActions.map(a => ({ kind: 'a', ...a }))];

  const activate = (it) => { onClose(); if (it.kind === 's') go(it.id); else it.run(); };

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(flat.length - 1, s + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (flat[sel]) activate(flat[sel]); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, flat, sel]);

  return (
    <Modal open={open} onClose={onClose} bare width={580}>
      <div className="cmdk-input">
        <Icon name="search" size={20} />
        <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Procurar ecrãs e ações…" />
        <kbd style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 7px' }}>esc</kbd>
      </div>
      <div className="cmdk-list">
        {flat.length === 0 && <div className="cmdk-empty">Sem resultados para “{q}”.</div>}
        {fScreens.length > 0 && <div className="cmdk-sec">Ir para</div>}
        {fScreens.map((s) => {
          const idx = flat.findIndex(f => f.kind === 's' && f.id === s.id);
          return (
            <button key={s.id} className={'cmdk-item' + (idx === sel ? ' on' : '')} onMouseEnter={() => setSel(idx)} onClick={() => activate({ kind: 's', ...s })}>
              <span className="cmdk-ico"><Icon name={s.icon} size={17} /></span>
              <span>{s.label}</span>
            </button>
          );
        })}
        {fActions.length > 0 && <div className="cmdk-sec">Ações</div>}
        {fActions.map((a) => {
          const idx = flat.findIndex(f => f.kind === 'a' && f.id === a.id);
          return (
            <button key={a.id} className={'cmdk-item' + (idx === sel ? ' on' : '')} onMouseEnter={() => setSel(idx)} onClick={() => activate({ kind: 'a', ...a })}>
              <span className="cmdk-ico"><Icon name={a.icon} size={17} /></span>
              <span>{a.label}</span>
              <span className="cmdk-k">{a.hint}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function NovoProjetoModal({ open, onClose, prefill, go }) {
  const [nome, setNome] = useState('');
  const [cliente, setCliente] = useState('');
  useEffect(() => { if (open) { setNome(''); setCliente(prefill && prefill.cliente ? prefill.cliente : ''); } }, [open, prefill]);
  const submit = () => { onClose(); if (window.PYToast) window.PYToast('Projeto criado · PY-121' + (nome ? ' — ' + nome : '')); if (go) go('projects'); };
  const clientes = ['Imobiliária Atlântico', 'Grupo Vértice SA', 'Família Albuquerque', 'Câmara Municipal', 'TransIbérica', 'Nordeste Retail', 'Construtora Dão', '+ Novo cliente…'];
  return (
    <Modal open={open} onClose={onClose} title="Novo projeto" sub="Cria um projeto e associa cliente e gestor." width={540}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit}><Icon name="plus" size={15} /> Criar projeto</button>
      </React.Fragment>}>
      {prefill && prefill.cliente && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', background: 'var(--accent-soft)', borderRadius: 'var(--r-sm)', marginBottom: 16, fontSize: 13, fontWeight: 600, color: 'var(--accent-700)' }}>
          <Icon name="spark" size={15} /> A criar a partir do cliente <b>{prefill.cliente}</b>
        </div>
      )}
      <Field label="Nome do projeto"><TextInput value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Edifício Marquês — Reabilitação" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Cliente" half><SelectInput value={cliente} onChange={(e) => setCliente(e.target.value)}>
          <option value="" disabled>Selecionar…</option>
          {clientes.map(c => <option key={c}>{c}</option>)}
        </SelectInput></Field>
        <Field label="Tipo" half><SelectInput defaultValue="Reabilitação urbana">
          {['Reabilitação urbana', 'Habitação unifamiliar', 'Edifício de serviços', 'Espaço público', 'Industrial', 'Comercial / Interiores'].map(c => <option key={c}>{c}</option>)}
        </SelectInput></Field>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Field label="Gestor de projeto" half><SelectInput defaultValue="Ana Moreira">
          {Object.values(PEOPLE).map(p => <option key={p.initials}>{p.name}</option>)}
        </SelectInput></Field>
        <Field label="Honorários (€)" half><TextInput type="number" placeholder="0" /></Field>
      </div>
      <Field label="Fase inicial"><SelectInput defaultValue="Estudo Prévio">
        {['Estudo Prévio', 'Projeto Base', 'Licenciamento', 'Projeto de Execução', 'Assistência Técnica'].map(c => <option key={c}>{c}</option>)}
      </SelectInput></Field>
    </Modal>
  );
}

Object.assign(window, { CommandPalette, NovoProjetoModal });
