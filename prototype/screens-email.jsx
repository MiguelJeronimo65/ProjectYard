/* ProjectYard — Correio (Email) */

const MAIL_FOLDERS = [
  { id: 'inbox', label: 'Caixa de entrada', icon: 'inbox', count: 12 },
  { id: 'sent', label: 'Enviados', icon: 'send' },
  { id: 'draft', label: 'Rascunhos', icon: 'fileText', count: 2 },
  { id: 'starred', label: 'Marcados', icon: 'spark' },
  { id: 'archive', label: 'Arquivo', icon: 'folder' },
  { id: 'trash', label: 'Lixo', icon: 'card' },
];
const MAIL_LABELS = [
  { id: 'clientes', label: 'Clientes', color: '#6a5af9' },
  { id: 'entidades', label: 'Entidades', color: '#2a7fb8' },
  { id: 'fornecedores', label: 'Fornecedores', color: '#e0922a' },
  { id: 'faturacao', label: 'Faturação', color: '#1f9d6b' },
];
const EMAILS = [
  { id: 'm1', from: PEOPLE.ana && { name: 'Imobiliária Atlântico', initials: 'IA', color: '#6a5af9', email: 'gestao@atlantico.pt' },
    subject: 'Aprovação do Projeto de Arquitetura — Lic.', snippet: 'Bom dia. Confirmamos a aprovação das peças submetidas para licenciamento. Seguimos para…',
    label: 'clientes', labelColor: '#6a5af9', time: '08:40', unread: true, starred: true, attach: 'PE_Arquitetura.pdf', project: 'Edifício Marquês',
    body: ['Bom dia Ana,', 'Confirmamos a aprovação das peças de Arquitetura submetidas para licenciamento. Pode avançar com a entrega na Câmara.', 'Aguardamos o cronograma atualizado da fase seguinte.', 'Com os melhores cumprimentos,\nImobiliária Atlântico'] },
  { id: 'm2', from: { name: 'Câmara Municipal do Porto', initials: 'CM', color: '#2a7fb8', email: 'urbanismo@cm-porto.pt' },
    subject: 'Pedido de elementos adicionais — Bolhão', snippet: 'No seguimento do processo n.º 1184/26, solicitamos os seguintes elementos em falta…',
    label: 'entidades', labelColor: '#2a7fb8', time: '10:12', unread: true, starred: false, attach: null, project: 'Mercado do Bolhão',
    body: ['Exmos. Senhores,', 'No seguimento do processo n.º 1184/26, solicitamos os seguintes elementos em falta para prosseguir a apreciação:', '— Pormenor construtivo da cobertura;\n— Cálculo de acessibilidades atualizado.', 'O prazo de resposta é de 15 dias úteis.'] },
  { id: 'm3', from: { name: 'Grupo Vértice SA', initials: 'GV', color: '#21a8c4', email: 'obras@vertice.pt' },
    subject: 'Confirmação reunião de obra — 5ª feira 15h', snippet: 'Confirmamos a presença na reunião de acompanhamento. Levaremos o ponto de situação…',
    label: 'clientes', labelColor: '#6a5af9', time: '12:44', unread: false, starred: false, attach: 'Ordem_Trabalhos.pdf', project: 'Sede Nova — Vértice',
    body: ['Olá Ana,', 'Confirmamos a presença na reunião de acompanhamento de 5ª feira às 15h.', 'Levaremos o ponto de situação dos acabamentos e a lista de decisões pendentes.', 'Cumprimentos.'] },
  { id: 'm4', from: { name: 'Betões do Norte, Lda', initials: 'BN', color: '#e0922a', email: 'comercial@betoesnorte.pt' },
    subject: 'Proposta de fornecimento atualizada', snippet: 'Segue em anexo a proposta revista para o fornecimento de betão C30/37, com novas…',
    label: 'fornecedores', labelColor: '#e0922a', time: 'Ontem', unread: false, starred: false, attach: 'Proposta_Betao_v2.pdf', project: 'Edifício Marquês',
    body: ['Caros,', 'Segue em anexo a proposta revista para o fornecimento de betão C30/37, com novas condições de prazo e preço.', 'Validade da proposta: 30 dias.', 'Ao dispor.'] },
  { id: 'm5', from: { name: 'Família Albuquerque', initials: 'FA', color: '#1f9d6b', email: 'j.albuquerque@email.pt' },
    subject: 'Dúvidas sobre acabamentos da moradia', snippet: 'Boa tarde. Gostaríamos de rever a paleta de materiais do piso 0 antes de avançar…',
    label: 'clientes', labelColor: '#6a5af9', time: 'Ontem', unread: false, starred: true, attach: null, project: 'Quinta do Lago — V4',
    body: ['Boa tarde,', 'Gostaríamos de rever a paleta de materiais do piso 0 antes de avançar para a fase seguinte.', 'Podemos agendar uma chamada esta semana?', 'Obrigado.'] },
  { id: 'm6', from: { name: 'Contabilidade — ROC', initials: 'RC', color: '#1f9d6b', email: 'roc@contab.pt' },
    subject: 'Fatura FT 2026/052 emitida e enviada', snippet: 'Confirmamos a emissão da fatura FT 2026/052 no valor de 24.800 € referente ao milestone…',
    label: 'faturacao', labelColor: '#1f9d6b', time: '5 Jun', unread: false, starred: false, attach: 'FT_2026_052.pdf', project: 'Edifício Marquês',
    body: ['Olá,', 'Confirmamos a emissão da fatura FT 2026/052 no valor de 24.800 € referente ao milestone "Especialidades — 1ª fase".', 'O documento foi enviado ao cliente com vencimento a 16 Jun.'] },
  { id: 'm7', from: { name: 'Sofia Lemos', initials: 'SL', color: '#e8526b', email: 'sofia@ateliernorte.pt' },
    subject: 'Render da fachada norte para validação', snippet: 'Ana, deixei o render atualizado na pasta de Documentos. Podes validar antes de enviarmos…',
    label: null, labelColor: null, time: '4 Jun', unread: false, starred: false, attach: 'Render_Fachada.jpg', project: 'Edifício Marquês',
    body: ['Ana,', 'Deixei o render atualizado na pasta de Documentos. Podes validar antes de enviarmos ao cliente?', 'Obrigada!'] },
];

function Email({ go }) {
  const [folder, setFolder] = useState('inbox');
  const [open, setOpen] = useState(null);
  const email = EMAILS.find(e => e.id === open);

  return (
    <div className="content" style={{ maxWidth: 1440 }}>
      <PageHead title="Correio" sub="Correspondência com clientes, entidades e fornecedores — ligada aos projetos" />

      <div className="card" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '232px 1fr', minHeight: 640 }}>
        {/* rail */}
        <div style={{ borderRight: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="btn btn-gold" style={{ justifyContent: 'center', marginBottom: 12 }}><Icon name="plus" size={17} /> Escrever</button>
          {MAIL_FOLDERS.map(f => (
            <button key={f.id} onClick={() => { setFolder(f.id); setOpen(null); }} className="mail-fld"
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', border: 'none', borderRadius: 'var(--r-sm)', background: folder === f.id ? 'var(--primary-soft)' : 'transparent', color: folder === f.id ? 'var(--primary)' : 'var(--text-2)', fontWeight: folder === f.id ? 700 : 600, fontSize: 14, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <Icon name={f.icon} size={18} /><span style={{ flex: 1 }}>{f.label}</span>
              {f.count && <span className="num" style={{ fontSize: 12, fontWeight: 700, background: folder === f.id ? 'var(--primary)' : 'var(--surface-3)', color: folder === f.id ? '#fff' : 'var(--text-2)', borderRadius: 99, padding: '1px 8px' }}>{f.count}</span>}
            </button>
          ))}
          <div className="nav-label" style={{ padding: '16px 11px 6px' }}>Etiquetas</div>
          {MAIL_LABELS.map(l => (
            <button key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 11px', border: 'none', background: 'transparent', borderRadius: 'var(--r-sm)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: l.color }}></span>{l.label}
            </button>
          ))}
        </div>

        {/* list or detail */}
        {!email ? (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div className="search" style={{ width: '100%' }}><Icon name="search" size={17} /><input placeholder="Procurar correio…" /></div>
            </div>
            <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-3)' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
              <Icon name="card" size={17} /><Icon name="inbox" size={17} /><Icon name="folder" size={17} />
              <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600 }}>1–7 de 12</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {EMAILS.map(e => (
                <button key={e.id} onClick={() => setOpen(e.id)} className="mail-row"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px', border: 'none', borderBottom: '1px solid var(--border)', background: e.unread ? 'var(--surface)' : 'var(--surface-2)', textAlign: 'left', cursor: 'pointer' }}>
                  <input type="checkbox" onClick={ev => ev.stopPropagation()} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  <Icon name="spark" size={17} style={{ color: e.starred ? 'var(--accent)' : 'var(--text-3)', fill: e.starred ? 'var(--accent)' : 'none' }} />
                  <Avatar p={e.from} size={38} />
                  <div style={{ minWidth: 160, flexShrink: 0 }}>
                    <div style={{ fontWeight: e.unread ? 800 : 600, fontSize: 14 }}>{e.from.name}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: e.unread ? 700 : 600, fontSize: 13.5 }}>{e.subject}</span>
                    <span className="muted-3" style={{ fontSize: 13.5, fontWeight: 500 }}> — {e.snippet}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {e.attach && <Icon name="paperclip" size={15} style={{ color: 'var(--text-3)' }} />}
                    {e.labelColor && <span style={{ width: 8, height: 8, borderRadius: 99, background: e.labelColor }}></span>}
                    <span className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, width: 56, textAlign: 'right' }}>{e.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MailDetail email={email} onBack={() => setOpen(null)} go={go} />
        )}
      </div>
    </div>
  );
}

function MailDetail({ email, onBack, go }) {
  const lbl = MAIL_LABELS.find(l => l.id === email.label);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={onBack}><Icon name="chevL" size={18} /></button>
        <h3 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--font-display)' }}>{email.subject}</h3>
        {lbl && <Badge tag="b-violet" dot={false}>{lbl.label}</Badge>}
        <span className="badge b-gray card-h more" dot="false">{email.project}</span>
      </div>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-3)' }}>
        <Icon name="card" size={17} /><Icon name="inbox" size={17} /><Icon name="folder" size={17} /><Icon name="paperclip" size={17} />
        <span style={{ marginLeft: 'auto' }}><Icon name="spark" size={17} style={{ color: email.starred ? 'var(--accent)' : 'var(--text-3)', fill: email.starred ? 'var(--accent)' : 'none' }} /></span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 22, background: 'var(--surface-2)' }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Avatar p={email.from} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{email.from.name}</div>
              <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{email.from.email}</div>
            </div>
            <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>{email.time}</div>
          </div>
          {email.body.map((p, i) => <p key={i} style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)', margin: '0 0 14px', whiteSpace: 'pre-line' }}>{p}</p>)}
          {email.attach && (
            <React.Fragment>
              <div className="divider"></div>
              <div className="muted-3" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Anexos</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--danger-soft)', color: 'var(--danger)', display: 'grid', placeItems: 'center', fontSize: 9.5, fontWeight: 800 }}>PDF</div>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{email.attach}</span>
                <button className="icon-btn" style={{ width: 30, height: 30, border: 'none' }}><Icon name="download" size={15} /></button>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* reply */}
        <div className="card card-pad" style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Responder a {email.from.name}</div>
          <div style={{ display: 'flex', gap: 6, paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 12, color: 'var(--text-3)' }}>
            {['B', 'I', 'U'].map(t => <button key={t} style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: 14, color: 'var(--text-2)', width: 28, cursor: 'pointer' }}>{t}</button>)}
            <Icon name="layers" size={17} style={{ marginLeft: 4 }} /><Icon name="paperclip" size={17} /><Icon name="send" size={17} />
          </div>
          <textarea placeholder="Escreve a tua mensagem…" rows={4} style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'transparent' }} />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <button className="chip"><Icon name="paperclip" size={14} /> Anexar</button>
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }}><Icon name="send" size={16} /> Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Email });
