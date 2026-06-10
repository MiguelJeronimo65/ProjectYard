/* ProjectYard — Deliverables + Documents */

function Deliverables({ go }) {
  const [fStatus, setFStatus] = useState('Todos');
  const estados = ['Todos', 'Aprovado', 'Em aprovação', 'Em revisão', 'Precisa revisão', 'Rascunho'];
  const mine = DELIVERABLES.filter(d => d.code === 'PY-118');
  const filtered = fStatus === 'Todos' ? mine : mine.filter(d => d.status === fStatus);
  const sort = useSort(filtered, { owner: (d) => d.owner.name }, null);
  return (
    <div className="content">
      <PageHead
        title="Entregáveis"
        sub="Edifício Marquês — Reabilitação · 5 entregáveis"
        actions={<React.Fragment>
          <button className="btn btn-ghost"><Icon name="filter" size={16} /> Estado</button>
          <button className="btn btn-primary"><Icon name="plus" size={16} /> Novo entregável</button>
        </React.Fragment>}
      />

      {/* status summary */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <MiniSummary icon="check" tone="success" n="1" l="Aprovados" />
        <MiniSummary icon="clock" tone="warning" n="1" l="Em aprovação" />
        <MiniSummary icon="eye" tone="info" n="1" l="Em revisão" />
        <MiniSummary icon="alert" tone="danger" n="1" l="Precisam revisão" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {estados.map(s => <button key={s} className={'chip' + (fStatus === s ? ' active' : '')} onClick={() => setFStatus(s)}>{s}</button>)}
        <span className="muted-3" style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600 }}>{sort.sorted.length} de {mine.length}</span>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr>
            <Th label="Entregável" k="name" sort={sort} />
            <Th label="Tipo" k="type" sort={sort} />
            <Th label="Versão" k="version" sort={sort} />
            <Th label="Estado" k="status" sort={sort} />
            <th>Responsável</th>
            <Th label="Prazo" k="due" sort={sort} />
            <th></th>
          </tr></thead>
          <tbody>
            {sort.sorted.map(d => (
              <tr key={d.id} className="row-click">
                <td style={{ maxWidth: 320 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="layers" size={19} /></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{d.name}{d.required && <span className="b-red badge" style={{ marginLeft: 8, padding: '2px 7px', fontSize: 10.5 }} >Obrigatório</span>}</div>
                      <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{d.phase} · {d.files} ficheiros</div>
                    </div>
                  </div>
                </td>
                <td className="muted" style={{ fontWeight: 600 }}>{d.type}</td>
                <td><span className="num badge b-gray">{d.version}</span></td>
                <td><Badge tag={d.statusTag}>{d.status}</Badge></td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar p={d.owner} size={28} /><span style={{ fontWeight: 600, fontSize: 13 }}>{d.owner.name.split(' ')[0]}</span></div></td>
                <td className="muted" style={{ fontWeight: 600 }}>{d.due}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {d.status === 'Em aprovação' && <button className="btn btn-primary btn-sm" style={{ padding: '6px 11px' }} onClick={(e) => { e.stopPropagation(); if (window.PYToast) window.PYToast('“' + d.name + '” aprovado'); }}><Icon name="check" size={13} /> Aprovar</button>}
                    {(d.status === 'Rascunho' || d.status === 'Em revisão' || d.status === 'Precisa revisão') && <button className="btn btn-soft btn-sm" style={{ padding: '6px 11px' }} onClick={(e) => { e.stopPropagation(); if (window.PYToast) window.PYToast('“' + d.name + '” submetido para aprovação'); go('approvals'); }}><Icon name="send" size={13} /> Submeter</button>}
                    <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={(e) => e.stopPropagation()}><Icon name="more" size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval flow + versions */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 20, alignItems: 'start' }}>
        <div className="card card-pad">
          <div className="card-h"><div><h3>Fluxo de aprovação</h3><span className="sub">Projeto de Estabilidade v2</span></div><Badge tag="b-amber" >Em aprovação</Badge></div>
          <div className="tl">
            <FlowStep on title="Submetido por Joana Faria" meta="Eng.ª Estruturas · há 18 min" icon="upload" />
            <FlowStep on title="Revisão técnica — Coordenação BIM" meta="Miguel Nunes · em curso" icon="eye" current />
            <FlowStep title="Aprovação do cliente" meta="Imobiliária Atlântico · pendente" icon="shield" />
            <FlowStep title="Disponível para execução" meta="aguarda aprovação" icon="check" last />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => { if (window.PYToast) window.PYToast('Etapa aprovada · notificado o cliente'); }}><Icon name="check" size={14} /> Aprovar etapa</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (window.PYToast) window.PYToast('Pedido de alterações enviado a Joana Faria'); }}><Icon name="x" size={14} /> Pedir alterações</button>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => go('approvals')}><Icon name="sms" size={14} /> Aprovar por SMS</button>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-h"><div><h3>Histórico de versões</h3></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { v: 'v2', cur: true, who: PEOPLE.joana, when: 'há 18 min', note: 'Revisão de cálculo pisos 2-3 após parecer', tag: 'b-amber', st: 'Em aprovação' },
              { v: 'v1', cur: false, who: PEOPLE.joana, when: 'há 6 dias', note: 'Versão inicial submetida', tag: 'b-red', st: 'Rejeitado' },
            ].map((ver, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: 13, border: '1px solid ' + (ver.cur ? 'var(--accent)' : 'var(--border)'), borderRadius: 'var(--r-sm)', background: ver.cur ? 'var(--accent-soft)' : 'transparent' }}>
                <span className="num badge b-gray" style={{ height: 'fit-content' }}>{ver.v}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{ver.note}</span>
                    <Badge tag={ver.tag} dot={false}>{ver.st}</Badge>
                  </div>
                  <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar p={ver.who} size={20} /> {ver.who.name} · {ver.when}
                  </div>
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="download" size={16} /></button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => go('documents')}><Icon name="fileText" size={14} /> Ver documentos ligados</button>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ on, current, last, title, meta, icon }) {
  return (
    <div className="tl-item">
      <div className={'tl-dot' + (on ? ' on' : '')} style={current ? { borderColor: 'var(--accent)', background: 'var(--accent)', color: 'var(--navy-700)' } : {}}>
        {(on || current) ? <Icon name={icon} size={11} /> : null}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{title}{current && <span className="badge b-gold" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 10.5 }}>Agora</span>}</div>
      <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{meta}</div>
    </div>
  );
}

function MiniSummary({ icon, tone, n, l, onClick, active }) {
  const map = { success: ['var(--success)', 'var(--success-soft)'], warning: ['var(--warning)', 'var(--warning-soft)'], info: ['var(--info)', 'var(--info-soft)'], danger: ['var(--danger)', 'var(--danger-soft)'] };
  const [c, bg] = map[tone];
  return (
    <div className={'card card-pad' + (onClick ? ' stat-link' : '')} onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', cursor: onClick ? 'pointer' : undefined, borderColor: active ? c : undefined, boxShadow: active ? '0 0 0 2px ' + bg : undefined }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, color: c, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={22} /></div>
      <div style={{ flex: 1 }}>
        <div className="num" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{n}</div>
        <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{l}</div>
      </div>
      {onClick && <Icon name={active ? 'x' : 'filter'} size={15} style={{ color: active ? c : 'var(--text-3)', flexShrink: 0 }} />}
    </div>
  );
}

/* ---------------- Documents ---------------- */
const DOC_FOLDER_COLOR = { 'Arquitetura': 'var(--primary)', 'Estruturas': 'var(--success)', 'Especialidades MEP': 'var(--info)', 'Licenciamento': 'var(--accent-700)' };
const DOC_LINK_TAG = { 'Projeto': 'b-gray', 'Entregável': 'b-violet', 'Tarefa': 'b-blue', 'Aprovação': 'b-amber' };

function Documents({ go }) {
  const [docs, setDocs] = useState(DOCS);
  const [folders, setFolders] = useState(['Arquitetura', 'Estruturas', 'Especialidades MEP', 'Licenciamento']);
  const [activeFolder, setActiveFolder] = useState(null);
  const [scope, setScope] = useState('Recentes');
  const [novaPasta, setNovaPasta] = useState(false);
  const [detail, setDetail] = useState(null);
  const [menuFor, setMenuFor] = useState(null);
  const fileRef = React.useRef(null);
  const [dragging, setDragging] = useState(false);

  const folderCount = (f) => docs.filter(d => d.folder === f).length;
  const usedGb = (186 + (docs.length - DOCS.length) * 6).toFixed(0);
  let shown = activeFolder ? docs.filter(d => d.folder === activeFolder) : docs;
  if (scope === 'Recentes' && !activeFolder) shown = shown.slice(0, 6);

  const addFile = (name) => {
    const ext = (name.split('.').pop() || 'PDF').toUpperCase().slice(0, 3);
    const extMap = { PDF: '#e8526b', IFC: '#6a5af9', XLS: '#18b07b', DOC: '#21a8c4', DWG: '#f5a524', JPG: '#9b59f5', PNG: '#9b59f5' };
    const nd = { id: 'doc' + Date.now(), name, type: ext, size: (Math.random() * 18 + 1).toFixed(1).replace('.', ',') + ' MB', ext, color: extMap[ext] || 'var(--text-3)', ver: 'v1', who: ME, when: 'agora', folder: activeFolder || 'Arquitetura', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Projeto', label: 'Edifício Marquês', route: 'projects' } };
    setDocs(d => [nd, ...d]);
    if (window.PYToast) window.PYToast('Carregado · ' + name + ' (v1)');
  };
  const onPick = (e) => { const fs = Array.from(e.target.files || []); fs.forEach(f => addFile(f.name)); if (fs.length === 0) addFile('Documento_' + (docs.length + 1) + '.pdf'); e.target.value = ''; };
  const onDrop = (e) => { e.preventDefault(); setDragging(false); const fs = Array.from(e.dataTransfer.files || []); if (fs.length) fs.forEach(f => addFile(f.name)); else addFile('Ficheiro_arrastado.pdf'); };
  const deleteDoc = (id) => { const d = docs.find(x => x.id === id); setDocs(list => list.filter(x => x.id !== id)); setMenuFor(null); if (window.PYToast) window.PYToast('Documento eliminado' + (d ? ' · ' + d.name : '')); };
  const newVersion = (id) => { setDocs(list => list.map(d => { if (d.id !== id) return d; const n = parseInt(d.ver.slice(1), 10) + 1; return { ...d, ver: 'v' + n, who: ME, when: 'agora' }; })); setMenuFor(null); const d = docs.find(x => x.id === id); if (window.PYToast) window.PYToast('Nova versão de ' + (d ? d.name : 'documento')); };

  return (
    <div className="content">
      <PageHead
        crumb={['Edifício Marquês', 'Documentos']}
        title="Documentos"
        sub={`Base documental separada · ${usedGb} GB de 500 GB usados · ${docs.length} ficheiros`}
        actions={<React.Fragment>
          <button className="btn btn-ghost" onClick={() => setNovaPasta(true)}><Icon name="folder" size={16} /> Nova pasta</button>
          <button className="btn btn-primary" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="upload" size={16} /> Carregar</button>
        </React.Fragment>}
      />
      <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={onPick} />

      {/* dropzone */}
      <div className="card" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
        style={{ border: '2px dashed ' + (dragging ? 'var(--accent)' : 'var(--border-2)'), background: dragging ? 'var(--accent-soft)' : 'var(--surface-2)', padding: 26, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, transition: 'background .12s, border-color .12s' }}>
        <div style={{ width: 50, height: 50, borderRadius: 13, background: 'var(--accent-soft)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center' }}><Icon name="upload" size={24} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{dragging ? 'Larga para carregar' : 'Arrasta ficheiros para aqui ou carrega do teu computador'}</div>
          <div className="muted-3" style={{ fontSize: 13, fontWeight: 600 }}>PDF, DWG, IFC, DOCX, XLSX, imagens · até 500 MB por ficheiro · versionamento automático</div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => fileRef.current && fileRef.current.click()}>Selecionar ficheiros</button>
      </div>

      {/* folders */}
      <div className="grid cols-4" style={{ marginBottom: 22 }}>
        {folders.map((f, i) => {
          const on = activeFolder === f;
          return (
            <button key={i} onClick={() => setActiveFolder(on ? null : f)} className="card card-pad" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', borderColor: on ? 'var(--accent)' : 'var(--border)', boxShadow: on ? '0 0 0 3px var(--accent-soft)' : 'var(--sh-sm)' }}>
              <div style={{ color: DOC_FOLDER_COLOR[f] || 'var(--text-3)' }}><Icon name="folder" size={30} /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{f}</div><div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{folderCount(f)} ficheiros</div></div>
              <Icon name={on ? 'check' : 'chevR'} size={17} />
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17 }}>{activeFolder || (scope === 'Recentes' ? 'Ficheiros recentes' : 'Todos os ficheiros')}</h3>
          {activeFolder && <button className="btn btn-ghost btn-sm" onClick={() => setActiveFolder(null)}><Icon name="x" size={13} /> Limpar pasta</button>}
          <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{shown.length} ficheiro{shown.length === 1 ? '' : 's'}</span>
          {!activeFolder && <div style={{ marginLeft: 'auto' }} className="seg"><button className={scope === 'Recentes' ? 'active' : ''} onClick={() => setScope('Recentes')}>Recentes</button><button className={scope === 'Todos' ? 'active' : ''} onClick={() => setScope('Todos')}>Todos</button></div>}
        </div>
        <table className="tbl">
          <thead><tr><th>Ficheiro</th><th>Registo ligado</th><th>Versão</th><th>Tamanho</th><th>Modificado por</th><th></th></tr></thead>
          <tbody>
            {shown.map((d) => (
              <tr key={d.id} className="row-click" onClick={() => setDetail(d)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: d.color + '1a', color: d.color, display: 'grid', placeItems: 'center', fontSize: 10.5, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{d.ext}</div>
                    <div><div style={{ fontWeight: 700 }}>{d.name}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{d.folder}</div></div>
                  </div>
                </td>
                <td><div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}><Badge tag={DOC_LINK_TAG[d.link.type] || 'b-gray'} dot={false}>{d.link.type}</Badge><span className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{d.code} · {d.link.label}</span></div></td>
                <td><span className="num badge b-gray">{d.ver}</span></td>
                <td className="num muted" style={{ fontWeight: 600 }}>{d.size}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar p={d.who} size={26} /><div><div style={{ fontWeight: 600, fontSize: 13 }}>{d.who.name.split(' ')[0]}</div><div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{d.when}</div></div></div></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" style={{ width: 32, height: 32 }} title="Descarregar" onClick={() => window.PYToast && window.PYToast('A descarregar ' + d.name)}><Icon name="download" size={16} /></button>
                    <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setMenuFor(menuFor === d.id ? null : d.id)}><Icon name="more" size={16} /></button>
                    {menuFor === d.id && (
                      <React.Fragment>
                        <div className="flt-backdrop" onClick={() => setMenuFor(null)}></div>
                        <div className="flt-pop" style={{ left: 'auto', right: 0, top: 38, minWidth: 184 }}>
                          <button className="flt-opt" onClick={() => { setMenuFor(null); setDetail(d); }}>Abrir detalhe</button>
                          <button className="flt-opt" onClick={() => newVersion(d.id)}>Carregar nova versão</button>
                          <button className="flt-opt" onClick={() => { setMenuFor(null); window.PYToast && window.PYToast('Renomear · ' + d.name); }}>Renomear</button>
                          <button className="flt-opt" onClick={() => { setMenuFor(null); window.PYToast && window.PYToast('Ligar a outro registo'); }}>Ligar a registo…</button>
                          <div className="divider" style={{ margin: '6px 0' }}></div>
                          <button className="flt-opt" style={{ color: 'var(--danger)' }} onClick={() => deleteDoc(d.id)}>Eliminar</button>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <div className="empty" style={{ padding: '40px 0' }}><Icon name="fileText" size={30} /><div style={{ marginTop: 10, fontWeight: 700, color: 'var(--text-2)' }}>Sem ficheiros nesta pasta</div></div>}
      </div>

      <NovaPastaModal open={novaPasta} onClose={() => setNovaPasta(false)} onCreate={(name) => { setFolders(f => [...f, name]); if (window.PYToast) window.PYToast('Pasta criada · ' + name); }} />
      <DocDetailModal doc={detail} onClose={() => setDetail(null)} go={go} onNewVersion={newVersion} />
    </div>
  );
}

function NovaPastaModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  useEffect(() => { if (open) setName(''); }, [open]);
  const submit = () => { if (!name.trim()) return; onCreate(name.trim()); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Nova pasta" sub="Organiza os documentos por especialidade ou fase." width={440}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!name.trim()}><Icon name="folder" size={15} /> Criar pasta</button>
      </React.Fragment>}>
      <Field label="Nome da pasta"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Segurança Contra Incêndio" /></Field>
    </Modal>
  );
}

function DocDetailModal({ doc, onClose, go, onNewVersion }) {
  if (!doc) return null;
  const cur = parseInt(doc.ver.slice(1), 10);
  const versionAuthors = [doc.who, PEOPLE.miguel, PEOPLE.rui, PEOPLE.joana, PEOPLE.sofia, PEOPLE.pedro, PEOPLE.ana];
  const whenScale = ['agora', 'ontem', 'há 3 dias', 'há 1 semana', 'há 2 semanas', 'há 3 semanas', 'há 1 mês'];
  const versions = Array.from({ length: cur }, (_, i) => { const v = cur - i; return { ver: 'v' + v, who: versionAuthors[i % versionAuthors.length], when: i === 0 ? doc.when : whenScale[Math.min(i + 1, whenScale.length - 1)], note: v === cur ? 'Versão atual' : v === 1 ? 'Versão inicial' : 'Revisão ' + v }; });
  const access = [
    { who: ME, action: 'Abriu', when: 'há 12 min' },
    { who: PEOPLE.ana, action: 'Descarregou', when: 'há 2 horas' },
    { who: doc.who, action: 'Carregou ' + doc.ver, when: doc.when },
    { who: PEOPLE.miguel, action: 'Abriu', when: 'ontem' },
  ];
  return (
    <Modal open={!!doc} onClose={onClose} title={doc.name} sub={doc.folder + ' · ' + doc.size + ' · ' + doc.ver} width={620}
      footer={<React.Fragment>
        <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
        <button className="btn btn-soft" onClick={() => onNewVersion(doc.id)}><Icon name="upload" size={15} /> Nova versão</button>
        <button className="btn btn-primary" onClick={() => window.PYToast && window.PYToast('A descarregar ' + doc.name)}><Icon name="download" size={15} /> Descarregar</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 11, background: doc.color + '1a', color: doc.color, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{doc.ext}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{doc.type} · {doc.size}</div>
          <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>Carregado por {doc.who.name} · {doc.when}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge tag={DOC_LINK_TAG[doc.link.type] || 'b-gray'} dot={false}>{doc.link.type}</Badge>
          <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{doc.link.label}</div><div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>{doc.code} · {doc.project}</div></div>
        </div>
        <button className="btn btn-soft btn-sm" onClick={() => { onClose(); go(doc.link.route); }}>Abrir registo <Icon name="arrowRight" size={14} /></button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 10 }}>Versões ({cur})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {versions.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span className="num badge b-gray" style={{ minWidth: 30, justifyContent: 'center' }}>{v.ver}</span>
                <Avatar p={v.who} size={24} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.who.name.split(' ')[0]} · {v.note}</div><div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{v.when}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 10 }}>Histórico de acesso</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {access.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar p={a.who} size={24} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{a.who.name.split(' ')[0]} <span className="muted-3">· {a.action}</span></div><div className="muted-3" style={{ fontSize: 11, fontWeight: 600 }}>{a.when}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { Deliverables, Documents });
