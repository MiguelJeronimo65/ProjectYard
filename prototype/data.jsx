/* ProjectYard — Icons (simple line icons) + Mock data */

const I = {};
(function () {
  const mk = (paths, opts = {}) => ({ size = 20, stroke = 2, ...rest } = {}) =>
    React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round',
      strokeLinejoin: 'round', ...rest
    }, paths.map((d, i) =>
      typeof d === 'string'
        ? React.createElement('path', { key: i, d })
        : React.createElement(d.t, { key: i, ...d.p })
    ));

  I.grid = mk(['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z']);
  I.folder = mk(['M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z']);
  I.check = mk(['M20 6 9 17l-5-5']);
  I.checks = mk(['M18 6 7 17l-5-5', 'm22 10-7.5 7.5L13 16']);
  I.checkSquare = mk(['m9 11 3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11']);
  I.file = mk(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6']);
  I.fileText = mk(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6', 'M9 17h4']);
  I.card = mk(['M2 5h20v14H2z', 'M2 10h20']);
  I.search = mk(['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm21 21-4.3-4.3']);
  I.bell = mk(['M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0']);
  I.settings = mk(['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z']);
  I.plus = mk(['M12 5v14', 'M5 12h14']);
  I.chevR = mk(['m9 18 6-6-6-6']);
  I.chevL = mk(['m15 18-6-6 6-6']);
  I.chevD = mk(['m6 9 6 6 6-6']);
  I.arrowUp = mk(['M12 19V5', 'm5 12 7-7 7 7']);
  I.arrowRight = mk(['M5 12h14', 'm12 5 7 7-7 7']);
  I.trend = mk(['m23 6-9.5 9.5-5-5L1 18', 'M17 6h6v6']);
  I.clock = mk(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2']);
  I.calendar = mk(['M3 4h18v18H3z', 'M3 10h18', 'M8 2v4', 'M16 2v4']);
  I.users = mk(['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8']);
  I.user = mk(['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8']);
  I.alert = mk(['M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', 'M12 9v4', 'M12 17h.01']);
  I.shield = mk(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z']);
  I.flag = mk(['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7']);
  I.pin = mk(['M12 17v5', 'M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z']);
  I.layers = mk(['m12 2 9 5-9 5-9-5 9-5z', 'm3 12 9 5 9-5', 'm3 17 9 5 9-5']);
  I.message = mk(['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']);
  I.sms = mk(['M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.5 8.5 0 0 1 3.6-11.4 8.4 8.4 0 0 1 12 7.9z', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01']);
  I.download = mk(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3']);
  I.upload = mk(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm17 8-5-5-5 5', 'M12 3v12']);
  I.more = mk(['M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z']);
  I.filter = mk(['M22 3H2l8 9.5V19l4 2v-8.5z']);
  I.dots = mk(['M5 12h.01', 'M12 12h.01', 'M19 12h.01']);
  I.logout = mk(['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9']);
  I.eye = mk(['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']);
  I.euro = mk(['M14 21a8 8 0 1 1 0-16', 'M4 11h10', 'M4 15h8']);
  I.paperclip = mk(['M21 12.5 12 21a5.6 5.6 0 0 1-8-8l9-9a3.7 3.7 0 0 1 5.3 5.3l-9 9a1.9 1.9 0 0 1-2.7-2.7l8-8']);
  I.send = mk(['m22 2-7 20-4-9-9-4z', 'M22 2 11 13']);
  I.dl = mk(['M12 3v12', 'm7 10 5 5 5-5', 'M21 21H3']);
  I.x = mk(['M18 6 6 18', 'M6 6l12 12']);
  I.dot = mk([{ t: 'circle', p: { cx: 12, cy: 12, r: 4, fill: 'currentColor', stroke: 'none' } }]);
  I.building = mk(['M3 21h18', 'M5 21V7l7-4 7 4v14', 'M9 9h.01', 'M15 9h.01', 'M9 13h.01', 'M15 13h.01', 'M9 17h.01', 'M15 17h.01']);
  I.target = mk(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']);
  I.gauge = mk(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm15 9-3 3', 'M12 6v.01']);
  I.kanban = mk(['M6 3v12', 'M12 3v8', 'M18 3v16', { t: 'circle', p: { cx: 6, cy: 18, r: 2 } }, { t: 'circle', p: { cx: 12, cy: 14, r: 2 } }, { t: 'circle', p: { cx: 18, cy: 21, r: 2 } }]);
  I.gantt = mk(['M8 6h12', 'M4 12h10', 'M10 18h8'], { stroke: 2.4 });
  I.inbox = mk(['M22 12h-6l-2 3h-4l-2-3H2', 'M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z']);
  I.spark = mk(['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'm5.6 5.6 2.8 2.8', 'm15.6 15.6 2.8 2.8', 'm18.4 5.6-2.8 2.8', 'm8.4 15.6-2.8 2.8']);
  I.lock = mk(['M5 11h14a0 0 0 0 1 0 0v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a0 0 0 0 1 0 0z', 'M8 11V7a4 4 0 1 1 8 0v4']);
  I.mail = mk(['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-10 6L2 7']);
  I.play = mk(['M8 5v14l11-7z']);
  I.copy = mk(['M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']);
  I.pause = mk(['M6 4h4v16H6z', 'M14 4h4v16h-4z']);
  I.briefcase = mk(['M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M2 12h20']);
  I.menu = mk(['M3 6h18', 'M3 12h18', 'M3 18h18'], { stroke: 2.2 });
  I.sun = mk(['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 1v2', 'M12 21v2', 'M4.2 4.2l1.4 1.4', 'M18.4 18.4l1.4 1.4', 'M1 12h2', 'M21 12h2', 'M4.2 19.8l1.4-1.4', 'M18.4 5.6l1.4-1.4']);
  I.moon = mk(['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z']);
  I.monitor = mk(['M3 4h18v12H3z', 'M8 20h8', 'M12 16v4']);
})();

/* ---------- Mock data ---------- */
const AV = {
  AM: '#6a5af9', RC: '#18b07b', JF: '#f5a524', SL: '#e8526b', TP: '#21a8c4', MN: '#9b59f5', PD: '#ef7d54',
};
function person(initials, name, role, color) { return { initials, name, role, color }; }

const PEOPLE = {
  ana: person('AM', 'Ana Moreira', 'Gestora de Projeto', '#6a5af9'),
  rui: person('RC', 'Rui Cardoso', 'Arquiteto Sénior', '#18b07b'),
  joana: person('JF', 'Joana Faria', 'Eng.ª Estruturas', '#f5a524'),
  sofia: person('SL', 'Sofia Lemos', 'Arquiteta', '#e8526b'),
  tiago: person('TP', 'Tiago Pinto', 'Eng. MEP', '#21a8c4'),
  miguel: person('MN', 'Miguel Nunes', 'Coordenador BIM', '#9b59f5'),
  pedro: person('PD', 'Pedro Dias', 'Desenhador', '#ef7d54'),
};
// Utilizador autenticado — dono da plataforma (Superadmin, protegido)
const OWNER = { initials: 'MJ', name: 'Miguel Jerónimo', role: 'Superadmin', color: '#233140', rate: 45, email: 'migueljeronimo@netcabo.pt', platform: true };
const ME = OWNER;
// Custo/hora interno por colaborador (€) — alinhado com a folha "Colaboradores" do cliente
const RATES = { ana: 32, rui: 38, joana: 35, sofia: 28, tiago: 34, miguel: 36, pedro: 24 };
Object.keys(PEOPLE).forEach(k => { PEOPLE[k].rate = RATES[k]; });

const PROJECTS = [
  {
    id: 'PY-118', code: 'PY-118', name: 'Edifício Marquês — Reabilitação',
    client: 'Imobiliária Atlântico', type: 'Reabilitação urbana',
    status: 'Em curso', health: 'green', progress: 64,
    contract: 248000, budget: 192000, spent: 121400, currency: '€',
    start: '12 Jan 2026', end: '30 Set 2026', endRaw: '2026-09-30',
    pm: PEOPLE.ana, team: [PEOPLE.ana, PEOPLE.rui, PEOPLE.joana, PEOPLE.miguel, PEOPLE.pedro],
    openTasks: 14, overdue: 2, deliverables: 5, approvals: 2, risks: 1,
    phase: 'Projeto de Execução', tag: 'b-violet',
  },
  {
    id: 'PY-117', code: 'PY-117', name: 'Quinta do Lago — Moradia V4',
    client: 'Família Albuquerque', type: 'Habitação unifamiliar',
    status: 'Em curso', health: 'amber', progress: 41,
    contract: 86000, budget: 64000, spent: 38900, currency: '€',
    start: '03 Mar 2026', end: '15 Nov 2026', endRaw: '2026-11-15',
    pm: PEOPLE.rui, team: [PEOPLE.rui, PEOPLE.sofia, PEOPLE.tiago],
    openTasks: 9, overdue: 3, deliverables: 3, approvals: 1, risks: 2,
    phase: 'Licenciamento', tag: 'b-amber',
  },
  {
    id: 'PY-115', code: 'PY-115', name: 'Sede Nova — Grupo Vértice',
    client: 'Grupo Vértice SA', type: 'Edifício de serviços',
    status: 'Em curso', health: 'green', progress: 78,
    contract: 410000, budget: 320000, spent: 251000, currency: '€',
    start: '08 Set 2025', end: '20 Jul 2026', endRaw: '2026-07-20',
    pm: PEOPLE.ana, team: [PEOPLE.ana, PEOPLE.joana, PEOPLE.tiago, PEOPLE.miguel],
    openTasks: 7, overdue: 0, deliverables: 2, approvals: 3, risks: 0,
    phase: 'Assistência Técnica', tag: 'b-blue',
  },
  {
    id: 'PY-112', code: 'PY-112', name: 'Mercado do Bolhão — Quiosques',
    client: 'Câmara Municipal', type: 'Espaço público',
    status: 'Em risco', health: 'red', progress: 28,
    contract: 134000, budget: 110000, spent: 72500, currency: '€',
    start: '21 Out 2025', end: '28 Fev 2026', endRaw: '2026-02-28',
    pm: PEOPLE.sofia, team: [PEOPLE.sofia, PEOPLE.pedro, PEOPLE.rui],
    openTasks: 11, overdue: 5, deliverables: 4, approvals: 0, risks: 3,
    phase: 'Projeto Base', tag: 'b-red',
  },
  {
    id: 'PY-109', code: 'PY-109', name: 'Loja Flagship — Avenida',
    client: 'Nordeste Retail', type: 'Comercial / Interiores',
    status: 'Concluído', health: 'green', progress: 100,
    contract: 58000, budget: 42000, spent: 41200, currency: '€',
    start: '02 Jun 2025', end: '18 Dez 2025', endRaw: '2025-12-18',
    pm: PEOPLE.rui, team: [PEOPLE.rui, PEOPLE.sofia],
    openTasks: 0, overdue: 0, deliverables: 0, approvals: 0, risks: 0,
    phase: 'Encerrado', tag: 'b-green',
  },
  {
    id: 'PY-120', code: 'PY-120', name: 'Parque Logístico — Maia',
    client: 'TransIbérica', type: 'Industrial',
    status: 'Proposta', health: 'amber', progress: 6,
    contract: 295000, budget: 0, spent: 0, currency: '€',
    start: '—', end: '02 Mai 2027', endRaw: '2027-05-02',
    pm: PEOPLE.ana, team: [PEOPLE.ana, PEOPLE.miguel],
    openTasks: 3, overdue: 0, deliverables: 1, approvals: 1, risks: 0,
    phase: 'Proposta enviada', tag: 'b-gray',
  },
];

const KANBAN = {
  cols: [
    { id: 'todo', name: 'Por fazer', accent: 'var(--text-3)' },
    { id: 'doing', name: 'Em curso', accent: 'var(--info)' },
    { id: 'review', name: 'Em revisão', accent: 'var(--warning)' },
    { id: 'done', name: 'Concluído', accent: 'var(--success)' },
  ],
  tasks: [
    { id: 't1', col: 'todo', title: 'Levantamento topográfico do lote', phase: 'Projeto de Execução', prio: 'Alta', due: '12 Jun', assignee: PEOPLE.pedro, checklist: [0, 4], comments: 2, attach: 1, tags: ['Topografia'] },
    { id: 't2', col: 'todo', title: 'Definir paleta de materiais — fachada', phase: 'Arquitetura', prio: 'Média', due: '18 Jun', assignee: PEOPLE.sofia, checklist: [1, 3], comments: 5, attach: 4, tags: ['Materiais'] },
    { id: 't3', col: 'todo', title: 'Pedido de elementos à Câmara', phase: 'Licenciamento', prio: 'Baixa', due: '24 Jun', assignee: PEOPLE.ana, checklist: [0, 2], comments: 0, attach: 0, tags: ['Licenciamento'] },
    { id: 't4', col: 'doing', title: 'Cálculo estrutural — piso 2 e 3', phase: 'Estruturas', prio: 'Alta', due: '10 Jun', assignee: PEOPLE.joana, checklist: [3, 6], comments: 8, attach: 2, tags: ['Estruturas'], overdue: false },
    { id: 't5', col: 'doing', title: 'Modelo BIM — coordenação MEP', phase: 'Coordenação', prio: 'Alta', due: '09 Jun', assignee: PEOPLE.miguel, checklist: [4, 5], comments: 3, attach: 6, tags: ['BIM', 'MEP'] },
    { id: 't6', col: 'doing', title: 'Mapa de acabamentos interiores', phase: 'Arquitetura', prio: 'Média', due: '14 Jun', assignee: PEOPLE.rui, checklist: [2, 4], comments: 1, attach: 0, tags: ['Interiores'] },
    { id: 't7', col: 'review', title: 'Memória descritiva — Arquitetura', phase: 'Projeto Base', prio: 'Alta', due: '06 Jun', assignee: PEOPLE.rui, checklist: [5, 5], comments: 4, attach: 3, tags: ['Documento'], overdue: true },
    { id: 't8', col: 'review', title: 'Pormenores construtivos — cobertura', phase: 'Execução', prio: 'Média', due: '07 Jun', assignee: PEOPLE.pedro, checklist: [3, 3], comments: 2, attach: 5, tags: ['Detalhe'] },
    { id: 't9', col: 'done', title: 'Plantas de implantação', phase: 'Projeto Base', prio: 'Média', due: '28 Mai', assignee: PEOPLE.sofia, checklist: [4, 4], comments: 6, attach: 2, tags: ['Desenho'] },
    { id: 't10', col: 'done', title: 'Estudo de insolação', phase: 'Arquitetura', prio: 'Baixa', due: '22 Mai', assignee: PEOPLE.miguel, checklist: [3, 3], comments: 0, attach: 1, tags: ['Análise'] },
    { id: 't11', col: 'done', title: 'Reunião de arranque com cliente', phase: 'Gestão', prio: 'Média', due: '15 Mai', assignee: PEOPLE.ana, checklist: [2, 2], comments: 3, attach: 0, tags: ['Reunião'] },
  ],
};

const DELIVERABLES = [
  { id: 'd1', name: 'Projeto de Arquitetura — Licenciamento', phase: 'Licenciamento', type: 'Conjunto de peças', version: 'v3', status: 'Aprovado', statusTag: 'b-green', due: '28 Mai 2026', owner: PEOPLE.rui, files: 12, required: true },
  { id: 'd2', name: 'Projeto de Estabilidade', phase: 'Especialidades', type: 'Especialidade', version: 'v2', status: 'Em aprovação', statusTag: 'b-amber', due: '14 Jun 2026', owner: PEOPLE.joana, files: 8, required: true },
  { id: 'd3', name: 'Projeto de Águas e Esgotos', phase: 'Especialidades', type: 'Especialidade', version: 'v1', status: 'Em revisão', statusTag: 'b-blue', due: '20 Jun 2026', owner: PEOPLE.tiago, files: 5, required: true },
  { id: 'd4', name: 'Caderno de Encargos', phase: 'Execução', type: 'Documento', version: 'v1', status: 'Rascunho', statusTag: 'b-gray', due: '02 Jul 2026', owner: PEOPLE.ana, files: 2, required: false },
  { id: 'd5', name: 'Mapa de Quantidades', phase: 'Execução', type: 'Documento', version: 'v2', status: 'Precisa revisão', statusTag: 'b-red', due: '05 Jun 2026', owner: PEOPLE.pedro, files: 3, required: true },
];

const DOCS = [
  { id: 'doc1', name: 'PE_Arquitetura_Pranchas.pdf', type: 'PDF', size: '24,1 MB', ext: 'PDF', color: '#e8526b', ver: 'v3', who: PEOPLE.rui, when: 'há 2 dias', folder: 'Arquitetura', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Entregável', label: 'Projeto de Execução', route: 'deliverables' } },
  { id: 'doc2', name: 'Modelo_BIM_Coordenacao.ifc', type: 'IFC', size: '186 MB', ext: 'IFC', color: '#6a5af9', ver: 'v7', who: PEOPLE.miguel, when: 'há 5 horas', folder: 'Especialidades MEP', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Tarefa', label: 'Coordenação BIM', route: 'tasks' } },
  { id: 'doc3', name: 'Calculo_Estrutural_P2-P3.xlsx', type: 'Folha', size: '3,4 MB', ext: 'XLS', color: '#18b07b', ver: 'v2', who: PEOPLE.joana, when: 'ontem', folder: 'Estruturas', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Entregável', label: 'Projeto de Estabilidade v2', route: 'approvals' } },
  { id: 'doc4', name: 'Memoria_Descritiva_Arq.docx', type: 'Documento', size: '820 KB', ext: 'DOC', color: '#21a8c4', ver: 'v4', who: PEOPLE.rui, when: 'há 3 dias', folder: 'Licenciamento', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Entregável', label: 'Licenciamento — Arquitetura', route: 'deliverables' } },
  { id: 'doc5', name: 'Levantamento_Topografico.dwg', type: 'CAD', size: '12,7 MB', ext: 'DWG', color: '#f5a524', ver: 'v1', who: PEOPLE.pedro, when: 'há 1 semana', folder: 'Licenciamento', code: 'PY-117', project: 'Quinta do Lago — V4', link: { type: 'Tarefa', label: 'Levantamento do terreno', route: 'tasks' } },
  { id: 'doc6', name: 'Render_Fachada_Norte.jpg', type: 'Imagem', size: '8,9 MB', ext: 'JPG', color: '#9b59f5', ver: 'v2', who: PEOPLE.sofia, when: 'há 4 dias', folder: 'Arquitetura', code: 'PY-118', project: 'Edifício Marquês', link: { type: 'Projeto', label: 'Edifício Marquês', route: 'projects' } },
];

const INVOICES = [
  { num: 'FT 2026/041', project: 'Edifício Marquês', milestone: 'Entrega Lic. Arquitetura', amount: 37200, status: 'Pago', tag: 'b-green', issued: '12 Mai 2026', due: '26 Mai 2026' },
  { num: 'FT 2026/047', project: 'Sede Nova — Vértice', milestone: 'Projeto de Execução 50%', amount: 61500, status: 'Pago', tag: 'b-green', issued: '20 Mai 2026', due: '03 Jun 2026' },
  { num: 'FT 2026/052', project: 'Edifício Marquês', milestone: 'Especialidades — 1ª fase', amount: 24800, status: 'Pendente', tag: 'b-amber', issued: '02 Jun 2026', due: '16 Jun 2026' },
  { num: 'FT 2026/039', project: 'Quinta do Lago — V4', milestone: 'Estudo Prévio', amount: 12900, status: 'Vencido', tag: 'b-red', issued: '08 Abr 2026', due: '22 Abr 2026' },
  { num: 'FT 2026/055', project: 'Mercado do Bolhão', milestone: 'Projeto Base', amount: 18600, status: 'Pendente', tag: 'b-amber', issued: '05 Jun 2026', due: '19 Jun 2026' },
];

const MILESTONES = [
  { name: 'Estudo Prévio aprovado', project: 'Edifício Marquês', pct: 15, amount: 37200, status: 'Faturado', tag: 'b-green', trigger: 'Aprovação de fase' },
  { name: 'Licenciamento submetido', project: 'Edifício Marquês', pct: 10, amount: 24800, status: 'Atingido', tag: 'b-blue', trigger: 'Entrega de entregável' },
  { name: 'Projeto de Execução 100%', project: 'Edifício Marquês', pct: 40, amount: 99200, status: 'Por atingir', tag: 'b-gray', trigger: 'Conclusão de fase' },
  { name: 'Assistência Técnica', project: 'Edifício Marquês', pct: 35, amount: 86800, status: 'Por atingir', tag: 'b-gray', trigger: 'Marco temporal' },
];

/* ---------- Ligação por projeto (separadores do detalhe) ----------
   Os ecrãs globais de Tarefas/Entregáveis são do projeto Marquês (PY-118);
   os restantes projetos ganham os seus próprios itens para o detalhe. */
KANBAN.tasks.forEach(t => { if (!t.pid) t.pid = 'PY-118'; });
KANBAN.tasks.push(
  { id: 't20', pid: 'PY-117', col: 'todo', title: 'Compatibilização Arq./Estabilidade', phase: 'Licenciamento', prio: 'Alta', due: '20 Jun', assignee: PEOPLE.tiago, checklist: [0, 3], comments: 1, attach: 0, tags: ['Coordenação'] },
  { id: 't21', pid: 'PY-117', col: 'doing', title: 'Pedido de elementos à Câmara', phase: 'Licenciamento', prio: 'Alta', due: '11 Jun', assignee: PEOPLE.sofia, checklist: [1, 2], comments: 2, attach: 1, tags: ['Licenciamento'], overdue: true },
  { id: 't22', pid: 'PY-117', col: 'doing', title: 'Projeto de águas e esgotos', phase: 'Especialidades', prio: 'Média', due: '24 Jun', assignee: PEOPLE.tiago, checklist: [2, 5], comments: 0, attach: 2, tags: ['Especialidades'] },
  { id: 't23', pid: 'PY-117', col: 'done', title: 'Levantamento do terreno', phase: 'Projeto Base', prio: 'Média', due: '02 Jun', assignee: PEOPLE.rui, checklist: [3, 3], comments: 1, attach: 1, tags: ['Topografia'] },
  { id: 't24', pid: 'PY-115', col: 'todo', title: 'Mapa de acabamentos — pisos técnicos', phase: 'Assistência Técnica', prio: 'Média', due: '18 Jun', assignee: PEOPLE.joana, checklist: [0, 4], comments: 0, attach: 0, tags: ['Interiores'] },
  { id: 't25', pid: 'PY-115', col: 'doing', title: 'Apoio a obra — fachada ventilada', phase: 'Obra', prio: 'Alta', due: '12 Jun', assignee: PEOPLE.miguel, checklist: [2, 4], comments: 3, attach: 2, tags: ['Obra'] },
  { id: 't26', pid: 'PY-115', col: 'review', title: 'Telas finais — instalações', phase: 'Assistência Técnica', prio: 'Média', due: '09 Jun', assignee: PEOPLE.tiago, checklist: [4, 4], comments: 1, attach: 5, tags: ['Documento'] },
  { id: 't27', pid: 'PY-112', col: 'todo', title: 'Revisão do Projeto Base — quiosques', phase: 'Projeto Base', prio: 'Alta', due: '15 Jun', assignee: PEOPLE.pedro, checklist: [0, 5], comments: 2, attach: 0, tags: ['Arquitetura'] },
  { id: 't28', pid: 'PY-112', col: 'doing', title: 'Resposta a parecer camarário', phase: 'Licenciamento', prio: 'Alta', due: '07 Jun', assignee: PEOPLE.sofia, checklist: [1, 3], comments: 6, attach: 1, tags: ['Licenciamento'], overdue: true },
  { id: 't29', pid: 'PY-112', col: 'doing', title: 'Plano de acessibilidades', phase: 'Projeto Base', prio: 'Média', due: '21 Jun', assignee: PEOPLE.rui, checklist: [2, 4], comments: 0, attach: 0, tags: ['Regulamentar'] },
  { id: 't30', pid: 'PY-112', col: 'review', title: 'Estimativa orçamental revista', phase: 'Gestão', prio: 'Alta', due: '06 Jun', assignee: PEOPLE.sofia, checklist: [3, 3], comments: 4, attach: 2, tags: ['Orçamento'], overdue: true },
  { id: 't31', pid: 'PY-120', col: 'todo', title: 'Preparar proposta técnica', phase: 'Gestão', prio: 'Alta', due: '28 Jun', assignee: PEOPLE.ana, checklist: [1, 4], comments: 1, attach: 0, tags: ['Proposta'] },
  { id: 't32', pid: 'PY-120', col: 'doing', title: 'Estudo de implantação preliminar', phase: 'Estudo Prévio', prio: 'Média', due: '30 Jun', assignee: PEOPLE.miguel, checklist: [0, 3], comments: 0, attach: 1, tags: ['Estudo'] },
);

DELIVERABLES.forEach(d => { if (!d.code) d.code = 'PY-118'; });
DELIVERABLES.push(
  { id: 'd10', code: 'PY-117', name: 'Projeto de Arquitetura — Licenciamento', phase: 'Licenciamento', type: 'Conjunto de peças', version: 'v2', status: 'Em revisão', statusTag: 'b-blue', due: '24 Jun 2026', owner: PEOPLE.rui, files: 7, required: true },
  { id: 'd11', code: 'PY-117', name: 'Projeto de Águas e Esgotos', phase: 'Especialidades', type: 'Especialidade', version: 'v1', status: 'Rascunho', statusTag: 'b-gray', due: '02 Jul 2026', owner: PEOPLE.tiago, files: 2, required: true },
  { id: 'd12', code: 'PY-115', name: 'Telas Finais — Arquitetura', phase: 'Assistência Técnica', type: 'Conjunto de peças', version: 'v1', status: 'Em aprovação', statusTag: 'b-amber', due: '16 Jun 2026', owner: PEOPLE.joana, files: 9, required: true },
  { id: 'd13', code: 'PY-115', name: 'Mapa de Acabamentos', phase: 'Execução', type: 'Documento', version: 'v3', status: 'Aprovado', statusTag: 'b-green', due: '30 Mai 2026', owner: PEOPLE.tiago, files: 4, required: false },
  { id: 'd14', code: 'PY-112', name: 'Projeto Base — Quiosques', phase: 'Projeto Base', type: 'Conjunto de peças', version: 'v2', status: 'Precisa revisão', statusTag: 'b-red', due: '12 Jun 2026', owner: PEOPLE.pedro, files: 5, required: true },
  { id: 'd15', code: 'PY-112', name: 'Estimativa Orçamental', phase: 'Gestão', type: 'Documento', version: 'v1', status: 'Em revisão', statusTag: 'b-blue', due: '19 Jun 2026', owner: PEOPLE.sofia, files: 1, required: false },
  { id: 'd16', code: 'PY-120', name: 'Proposta Técnica', phase: 'Proposta', type: 'Documento', version: 'v1', status: 'Rascunho', statusTag: 'b-gray', due: '30 Jun 2026', owner: PEOPLE.ana, files: 1, required: true },
);

MILESTONES.forEach(m => { if (!m.code) m.code = 'PY-118'; });
const INV_CODE = { 'Edifício Marquês': 'PY-118', 'Sede Nova — Vértice': 'PY-115', 'Quinta do Lago — V4': 'PY-117', 'Mercado do Bolhão': 'PY-112' };
INVOICES.forEach(i => { if (!i.code) i.code = INV_CODE[i.project] || ''; });

const LIFECYCLE = ['Estudo Prévio', 'Projeto Base', 'Licenciamento', 'Projeto de Execução', 'Assistência Técnica'];
const PROJECT_PHASES = {
  'PY-118': [
    { name: 'Estudo Prévio', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto Base', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Licenciamento', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto de Execução', status: 'Em curso', tag: 'b-blue', pct: 45 },
    { name: 'Assistência Técnica', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
  ],
  'PY-117': [
    { name: 'Estudo Prévio', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto Base', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Licenciamento', status: 'Em curso', tag: 'b-blue', pct: 55 },
    { name: 'Projeto de Execução', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Assistência Técnica', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
  ],
  'PY-115': [
    { name: 'Estudo Prévio', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto Base', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Licenciamento', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto de Execução', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Assistência Técnica', status: 'Em curso', tag: 'b-blue', pct: 60 },
  ],
  'PY-112': [
    { name: 'Estudo Prévio', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto Base', status: 'Em curso', tag: 'b-amber', pct: 45 },
    { name: 'Licenciamento', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Projeto de Execução', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Assistência Técnica', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
  ],
  'PY-109': [
    { name: 'Estudo Prévio', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto Base', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Licenciamento', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Projeto de Execução', status: 'Concluída', tag: 'b-green', pct: 100 },
    { name: 'Assistência Técnica', status: 'Concluída', tag: 'b-green', pct: 100 },
  ],
  'PY-120': [
    { name: 'Estudo Prévio', status: 'Em curso', tag: 'b-blue', pct: 12 },
    { name: 'Projeto Base', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Licenciamento', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Projeto de Execução', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
    { name: 'Assistência Técnica', status: 'Por iniciar', tag: 'b-gray', pct: 0 },
  ],
};
const projectPhases = (p) => PROJECT_PHASES[p.code] || LIFECYCLE.map(n => ({ name: n, status: 'Por iniciar', tag: 'b-gray', pct: 0 }));

const ACTIVITY = [
  { who: PEOPLE.joana, action: 'submeteu', target: 'Projeto de Estabilidade v2', meta: 'para aprovação', time: 'há 18 min', icon: 'upload', on: true },
  { who: PEOPLE.rui, action: 'aprovou', target: 'Projeto de Arquitetura — Licenciamento', meta: '', time: 'há 2 horas', icon: 'check', on: true },
  { who: PEOPLE.ana, action: 'criou a fatura', target: 'FT 2026/052', meta: '24.800 €', time: 'há 3 horas', icon: 'euro', on: false },
  { who: PEOPLE.miguel, action: 'carregou', target: 'Modelo_BIM_Coordenacao.ifc', meta: 'v7', time: 'há 5 horas', icon: 'paperclip', on: false },
  { who: PEOPLE.sofia, action: 'comentou em', target: 'Mapa de acabamentos interiores', meta: '', time: 'ontem', icon: 'message', on: false },
  { who: PEOPLE.tiago, action: 'respondeu por SMS', target: 'aprovação de orçamento', meta: '"APROVO"', time: 'ontem', icon: 'sms', on: false },
];

const APPROVALS = [
  { title: 'Projeto de Estabilidade v2', project: 'Edifício Marquês', type: 'Entregável', who: PEOPLE.joana, time: 'há 18 min', step: '1 de 2' },
  { title: 'Orçamento adicional — sondagens', project: 'Quinta do Lago — V4', type: 'Change Request', who: PEOPLE.rui, time: 'há 1 dia', step: '1 de 1' },
  { title: 'Pagamento milestone — Execução 50%', project: 'Sede Nova — Vértice', type: 'Pagamento', who: PEOPLE.ana, time: 'há 2 dias', step: '2 de 2' },
];

const REVENUE = [
  { m: 'Jan', v: 42 }, { m: 'Fev', v: 38 }, { m: 'Mar', v: 55 }, { m: 'Abr', v: 49 },
  { m: 'Mai', v: 71 }, { m: 'Jun', v: 63 }, { m: 'Jul', v: 80 }, { m: 'Ago', v: 58 },
];

const TENANTS = [
  { name: 'Atelier Norte', slug: 'atelier-norte', plan: 'Pro', initials: 'AN', color: '#6a5af9', trial: false, projetos: 24, membros: 8, faturado: 840000, estado: 'Ativo', owner: 'Ana Moreira' },
  { name: 'EngForma Lda', slug: 'engforma', plan: 'Trial', initials: 'EF', color: '#18b07b', trial: true, projetos: 6, membros: 4, faturado: 62000, estado: 'Trial', owner: 'Carlos Bento' },
  { name: 'Studio Praça', slug: 'studio-praca', plan: 'Enterprise', initials: 'SP', color: '#f5a524', trial: false, projetos: 51, membros: 22, faturado: 2140000, estado: 'Ativo', owner: 'Rita Salgado' },
  { name: 'Forma & Betão', slug: 'forma-betao', plan: 'Pro', initials: 'FB', color: '#e8526b', trial: false, projetos: 18, membros: 11, faturado: 610000, estado: 'Ativo', owner: 'João Vaz' },
  { name: 'Risco Studio', slug: 'risco-studio', plan: 'Starter', initials: 'RS', color: '#21a8c4', trial: false, projetos: 3, membros: 2, faturado: 48000, estado: 'Suspenso', owner: 'Marta Lima' },
];

/* ---------- Conformidade RGPD — Chat (Superadmin / DPO de plataforma) ----------
   Supervisão transversal das comunicações. Princípio da minimização de dados:
   por omissão só metadados (volume/atividade); o conteúdo é privado e cifrado.
   O acesso a conteúdo exige base legal + justificação e é registado em
   ChatComplianceAccessLog (trilho de auditoria imutável). */

// Encarregada de Proteção de Dados — co-responsável pelos acessos de conformidade
const DPO = { initials: 'HC', name: 'Helena Cruz', role: 'Encarregada de Proteção de Dados (DPO)', color: '#2a7fb8', platform: true };

// Bases legais admissíveis para aceder a conteúdo privado (RGPD)
const RGPD_BASES = [
  { id: 'titular', label: 'Pedido do titular dos dados', ref: 'RGPD Art. 15.º — direito de acesso' },
  { id: 'abuso', label: 'Investigação de abuso ou segurança', ref: 'Interesse legítimo · Art. 6.º/1-f' },
  { id: 'judicial', label: 'Ordem judicial / autoridade competente', ref: 'Obrigação legal · Art. 6.º/1-c' },
  { id: 'litigio', label: 'Resolução de litígio contratual', ref: 'Interesse legítimo · Art. 6.º/1-f' },
  { id: 'auditoria', label: 'Auditoria de conformidade', ref: 'Obrigação legal · Art. 6.º/1-c' },
];

// Colaboradores de outros workspaces — nome/papel são metadados de adesão (visíveis);
// o conteúdo das mensagens é que está protegido.
function cp(initials, name, role, color) { return { initials, name, role, color }; }
const TPEOPLE = {
  rita: cp('RS', 'Rita Salgado', 'Sócia-gerente', '#f5a524'),
  bruno: cp('BM', 'Bruno Matos', 'Arquiteto', '#6a5af9'),
  ines: cp('IC', 'Inês Carvalho', 'Eng.ª Civil', '#18b07b'),
  joaoV: cp('JV', 'João Vaz', 'Diretor técnico', '#e8526b'),
  paula: cp('PR', 'Paula Reis', 'Arquiteta', '#21a8c4'),
  nuno: cp('NF', 'Nuno Freitas', 'Encarregado de obra', '#9b59f5'),
  carlos: cp('CB', 'Carlos Bento', 'Gerente', '#18b07b'),
  diana: cp('DM', 'Diana Melo', 'Projetista', '#ef7d54'),
  marta: cp('ML', 'Marta Lima', 'Fundadora', '#21a8c4'),
};

/* Metadados das conversas em toda a plataforma — SEM conteúdo.
   count = nº total de participantes · participants = amostra para avatares.
   hold = retenção suspensa por litígio/preservação de prova. */
const COMPLIANCE_CONVOS = [
  { id: 'cc1', tenant: 'Studio Praça', tslug: 'studio-praca', tcolor: '#f5a524', tinit: 'SP',
    type: 'channel', name: 'torre-oriente-geral', project: 'Torre Oriente', color: '#f5a524',
    participants: [TPEOPLE.rita, TPEOPLE.bruno, TPEOPLE.ines], count: 9,
    msgs30: 412, attachments: 34, lastActivity: 'há 12 min', activitySort: 12, retention: '24 meses', hold: false, flagged: false,
    topic: 'coordenação geral da Torre Oriente' },
  { id: 'cc2', tenant: 'Studio Praça', tslug: 'studio-praca', tcolor: '#f5a524', tinit: 'SP',
    type: 'direct', name: 'Conversa direta', participants: [TPEOPLE.rita, TPEOPLE.bruno], count: 2,
    msgs30: 86, attachments: 4, lastActivity: 'há 1 h', activitySort: 60, retention: 'Suspensa', hold: true, flagged: false,
    topic: 'negociação de honorários adicionais' },
  { id: 'cc3', tenant: 'Atelier Norte', tslug: 'atelier-norte', tcolor: '#6a5af9', tinit: 'AN',
    type: 'channel', name: 'marques-geral', project: 'Edifício Marquês', color: '#6a5af9',
    participants: [PEOPLE.ana, PEOPLE.rui, PEOPLE.joana, PEOPLE.miguel, PEOPLE.pedro], count: 5,
    msgs30: 318, attachments: 21, lastActivity: 'há 8 min', activitySort: 8, retention: '12 meses', hold: false, flagged: false,
    topic: 'projeto de execução do Edifício Marquês' },
  { id: 'cc4', tenant: 'Atelier Norte', tslug: 'atelier-norte', tcolor: '#6a5af9', tinit: 'AN',
    type: 'direct', name: 'Conversa direta', participants: [PEOPLE.ana, PEOPLE.joana], count: 2,
    msgs30: 142, attachments: 6, lastActivity: 'há 26 min', activitySort: 26, retention: '12 meses', hold: false, flagged: false,
    topic: 'revisão do cálculo de estabilidade' },
  { id: 'cc5', tenant: 'Forma & Betão', tslug: 'forma-betao', tcolor: '#e8526b', tinit: 'FB',
    type: 'channel', name: 'obra-ribeira', project: 'Reabilitação Ribeira', color: '#e8526b',
    participants: [TPEOPLE.joaoV, TPEOPLE.paula, TPEOPLE.nuno], count: 7,
    msgs30: 256, attachments: 18, lastActivity: 'há 2 h', activitySort: 120, retention: '12 meses', hold: false, flagged: false,
    topic: 'acompanhamento de obra na Ribeira' },
  { id: 'cc6', tenant: 'Forma & Betão', tslug: 'forma-betao', tcolor: '#e8526b', tinit: 'FB',
    type: 'direct', name: 'Conversa direta', participants: [TPEOPLE.joaoV, TPEOPLE.nuno], count: 2,
    msgs30: 64, attachments: 2, lastActivity: 'ontem', activitySort: 1440, retention: 'Suspensa', hold: true, flagged: true,
    topic: 'denúncia interna em apreciação' },
  { id: 'cc7', tenant: 'EngForma Lda', tslug: 'engforma', tcolor: '#18b07b', tinit: 'EF',
    type: 'channel', name: 'licenciamento', project: 'Lote 14 — Gaia', color: '#18b07b',
    participants: [TPEOPLE.carlos, TPEOPLE.diana], count: 4,
    msgs30: 98, attachments: 9, lastActivity: 'há 3 h', activitySort: 180, retention: '6 meses', hold: false, flagged: false,
    topic: 'processo de licenciamento do Lote 14' },
  { id: 'cc8', tenant: 'EngForma Lda', tslug: 'engforma', tcolor: '#18b07b', tinit: 'EF',
    type: 'direct', name: 'Conversa direta', participants: [TPEOPLE.carlos, TPEOPLE.diana], count: 2,
    msgs30: 31, attachments: 1, lastActivity: 'ontem', activitySort: 1500, retention: '6 meses', hold: false, flagged: false,
    topic: 'distribuição de tarefas da semana' },
  { id: 'cc9', tenant: 'Risco Studio', tslug: 'risco-studio', tcolor: '#21a8c4', tinit: 'RS',
    type: 'channel', name: 'geral', project: '—', color: '#21a8c4',
    participants: [TPEOPLE.marta], count: 2,
    msgs30: 12, attachments: 0, lastActivity: 'há 6 dias', activitySort: 8640, retention: 'Indefinida', hold: false, flagged: false,
    topic: 'conversas gerais do atelier' },
];

/* ChatComplianceAccessLog — trilho de auditoria de acessos a conteúdo já efetuados.
   Imutável: cada linha regista quem, quando, qual conversa, base legal e justificação. */
const COMPLIANCE_LOG = [
  { id: 'l1', ref: 'CCAL-2026-0048', when: '08 Jun 2026 · 14:32', admin: DPO, tenant: 'Forma & Betão',
    target: 'Conversa direta · 2 participantes', base: 'Investigação de abuso ou segurança', baseRef: 'Interesse legítimo · Art. 6.º/1-f',
    reason: 'Denúncia interna de conduta imprópria. Acesso restrito ao período 1–5 Jun, conforme âmbito autorizado pela DPO.', scope: 'Conteúdo · 28 mensagens', state: 'Concluído' },
  { id: 'l2', ref: 'CCAL-2026-0041', when: '04 Jun 2026 · 09:10', admin: OWNER, tenant: 'Studio Praça',
    target: '#torre-oriente-geral', base: 'Ordem judicial / autoridade competente', baseRef: 'Obrigação legal · Art. 6.º/1-c',
    reason: 'Pedido de preservação de prova — Proc. 142/26.4. Retenção colocada em suspensão (legal hold).', scope: 'Conteúdo · preservação integral', state: 'Ativo' },
  { id: 'l3', ref: 'CCAL-2026-0037', when: '28 Mai 2026 · 16:48', admin: DPO, tenant: 'Atelier Norte',
    target: 'Conversa direta · 2 participantes', base: 'Pedido do titular dos dados', baseRef: 'RGPD Art. 15.º — direito de acesso',
    reason: 'Exercício do direito de acesso pelo titular. Exportação fornecida ao próprio em formato legível.', scope: 'Conteúdo · 54 mensagens', state: 'Concluído' },
  { id: 'l4', ref: 'CCAL-2026-0033', when: '19 Mai 2026 · 11:20', admin: OWNER, tenant: 'EngForma Lda',
    target: '#licenciamento', base: 'Auditoria de conformidade', baseRef: 'Obrigação legal · Art. 6.º/1-c',
    reason: 'Auditoria trimestral de retenção de dados. Amostragem de conformidade sem extração de conteúdo.', scope: 'Metadados + amostra', state: 'Concluído' },
];

const fmt = (n) => n.toLocaleString('pt-PT');
const eur = (n) => n.toLocaleString('pt-PT') + ' €';
// €840k / €12,9k — inteiro acima de 100k, 1 casa abaixo
const kk = (n) => '€' + (n >= 100000 ? Math.round(n / 1000) : (n / 1000).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })) + 'k';

/* ---------- KPIs financeiros — fonte única (Dashboard + Financeiro) ----------
   Coerência garantida: faturado = recebido + a receber · a receber = pendente + vencido */
const KPIS = (() => {
  const faturadoAno = 840000, recebido = 697000, pendente = 130100, vencido = 12900;
  const aReceber = pendente + vencido;            // 143.000
  const pct = (n) => Math.round(n / faturadoAno * 100);
  return {
    projetosAtivos: 24, projetosTrend: '+3', emRisco: 4, aIniciar: 2,
    faturadoAno, faturadoTrend: '+18%', recebido, pendente, vencido, aReceber,
    faturasEmitidas: 42, faturasAbertas: 3,
    pagoPct: pct(recebido), pendentePct: pct(pendente), vencidoPct: pct(vencido),
  };
})();
const fmtH = (n) => (n ? n.toLocaleString('pt-PT', { minimumFractionDigits: n % 1 ? 1 : 0 }) : '');

/* ---------- Tabelas de lookup (geridas por admin/superadmin) ---------- */
const LK_PRIORIDADES = ['Alta', 'Média', 'Baixa'];
const LK_FASES = ['Estudo Prévio', 'Projeto Base', 'Licenciamento', 'Projeto de Execução', 'Especialidades', 'Estruturas', 'Arquitetura', 'Coordenação BIM', 'Execução', 'Assistência Técnica', 'Obra', 'Fecho', 'Gestão'];
const MESES_ABR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const fmtDue = (d) => { if (!d) return '—'; const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); return m ? parseInt(m[3], 10) + ' ' + MESES_ABR[parseInt(m[2], 10) - 1] : d; };
// Semáforo de produtividade/prazo — limiares da folha "Config" do cliente (≥95% verde, ≥85% amarelo)
const semaforo = (ratio) => (ratio >= 0.95 ? 'green' : ratio >= 0.85 ? 'amber' : 'red');
const SEM_COL = { green: 'var(--success)', amber: 'var(--warning)', red: 'var(--danger)' };

/* ---------- Registo de horas / Timesheets ---------- */
// Three weeks demonstrate the three states: approved (past), draft (current), empty (future)
const TS_WEEKS = [
  { id: -1, label: '1 – 7 Jun', range: '1 – 7 Junho 2026', dates: [1, 2, 3, 4, 5, 6, 7], todayIdx: -1, status: 'Aprovada', state: 'approved' },
  { id: 0, label: '8 – 14 Jun', range: '8 – 14 Junho 2026', dates: [8, 9, 10, 11, 12, 13, 14], todayIdx: 0, status: 'Rascunho', state: 'draft' },
  { id: 1, label: '15 – 21 Jun', range: '15 – 21 Junho 2026', dates: [15, 16, 17, 18, 19, 20, 21], todayIdx: -1, status: 'Por preencher', state: 'empty' },
];
const TS_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const TS_WEEKEND = [5, 6];
const TS_CAPACITY = 40;

const TS_ROWS = [
  { id: 'tr1', code: 'PY-118', project: 'Edifício Marquês', phase: 'Projeto de Execução', tipo: 'Produção', color: '#6a5af9', billable: true, hours: [2, 3, 2, 3, 1, 0, 0] },
  { id: 'tr2', code: 'PY-118', project: 'Edifício Marquês', phase: 'Coordenação BIM/MEP', tipo: 'Coordenação', color: '#6a5af9', billable: true, hours: [1, 1, 0.5, 1, 1, 0, 0] },
  { id: 'tr3', code: 'PY-115', project: 'Sede Nova — Vértice', phase: 'Assistência Técnica', tipo: 'Assistência', color: '#2a7fb8', billable: true, hours: [2, 1, 2, 0, 1, 0, 0] },
  { id: 'tr4', code: 'PY-117', project: 'Quinta do Lago — V4', phase: 'Licenciamento', tipo: 'Licenciamento', color: '#e0922a', billable: true, hours: [0, 1.5, 1, 1.5, 0, 0, 0] },
  { id: 'tr5', code: 'PY-112', project: 'Mercado do Bolhão', phase: 'Projeto Base', tipo: 'Produção', color: '#d65151', billable: true, hours: [1, 0, 1.5, 0, 2, 0, 0] },
  { id: 'tr6', code: '—', project: 'Interno', phase: 'Gestão & reuniões', tipo: 'Reunião', color: '#8a949e', billable: false, hours: [1.5, 0.5, 1, 0.5, 1, 0, 0] },
];

// Segunda-feira (8 Jun) — agenda do dia, blocos posicionados (09:00–18:00)
const TS_DAY = [
  { start: '09:00', end: '09:30', dur: 0.5, code: '—', project: 'Interno', phase: 'Stand-up de equipa', tipo: 'Reunião', color: '#8a949e', billable: false },
  { start: '09:30', end: '11:30', dur: 2, code: 'PY-118', project: 'Edifício Marquês', phase: 'Pormenores de cobertura', tipo: 'Produção', color: '#6a5af9', billable: true },
  { start: '11:30', end: '12:30', dur: 1, code: 'PY-115', project: 'Sede Nova — Vértice', phase: 'Preparação de visita de obra', tipo: 'Coordenação', color: '#2a7fb8', billable: true },
  { start: '14:00', end: '15:30', dur: 1.5, code: '—', project: 'Interno', phase: 'Reunião de coordenação', tipo: 'Reunião', color: '#8a949e', billable: false },
  { start: '15:30', end: '16:30', dur: 1, code: 'PY-118', project: 'Edifício Marquês', phase: 'Coordenação BIM/MEP', tipo: 'Coordenação', color: '#6a5af9', billable: true },
  { start: '16:30', end: '18:00', dur: 1.5, code: 'PY-112', project: 'Mercado do Bolhão', phase: 'Revisão do Projeto Base', tipo: 'Produção', color: '#d65151', billable: true },
];

// Burn de horas por projeto — Horas Prev. vs Horas Reais + Prazo % (folha "Resumo_Projetos")
const TS_PROJ = [
  { code: 'PY-118', name: 'Edifício Marquês', color: '#6a5af9', week: 15.5, prev: 2400, real: 1520, prazo: 64, billable: true },
  { code: 'PY-115', name: 'Sede Nova — Vértice', color: '#2a7fb8', week: 6, prev: 3600, real: 2810, prazo: 78, billable: true },
  { code: 'PY-112', name: 'Mercado do Bolhão', color: '#d65151', week: 4.5, prev: 1400, real: 1505, prazo: 28, billable: true },
  { code: 'PY-117', name: 'Quinta do Lago — V4', color: '#e0922a', week: 4, prev: 900, real: 612, prazo: 41, billable: true },
  { code: '—', name: 'Interno · não faturável', color: '#8a949e', week: 4.5, prev: 0, real: 0, prazo: 0, billable: false },
];

// Utilização da equipa nesta semana (capacidade 40h) + horas previstas → produtividade
const TS_TEAM = [
  { p: PEOPLE.ana, logged: 34.5, billable: 30, prev: 36, status: 'normal' },
  { p: PEOPLE.rui, logged: 38, billable: 34, prev: 38, status: 'normal' },
  { p: PEOPLE.joana, logged: 43, billable: 39, prev: 38, status: 'over' },
  { p: PEOPLE.sofia, logged: 28.5, billable: 22, prev: 34, status: 'low' },
  { p: PEOPLE.tiago, logged: 36, billable: 31, prev: 36, status: 'normal' },
  { p: PEOPLE.miguel, logged: 40, billable: 35, prev: 38, status: 'normal' },
  { p: PEOPLE.pedro, logged: 32, billable: 27, prev: 34, status: 'normal' },
];

/* ---------- Relatórios (cruza horas · custo · faturação) ---------- */
// Resumo por projeto — base da folha "Resumo_Projetos" do cliente
// produtividade = horas esperadas (prev × prazo%) ÷ horas reais  →  ≥1 dentro do plano
const REPORT_PROJ = [
  { code: 'PY-118', name: 'Edifício Marquês', client: 'Imobiliária Atlântico', color: '#6a5af9', pm: PEOPLE.ana, status: 'Em curso', tag: 'b-violet', horasPrev: 2400, horasReais: 1520, honorarios: 248000, faturado: 62000, recebido: 37200, prazo: 64 },
  { code: 'PY-115', name: 'Sede Nova — Vértice', client: 'Grupo Vértice SA', color: '#2a7fb8', pm: PEOPLE.ana, status: 'Em curso', tag: 'b-blue', horasPrev: 3600, horasReais: 2810, honorarios: 410000, faturado: 187000, recebido: 187000, prazo: 78 },
  { code: 'PY-117', name: 'Quinta do Lago — V4', client: 'Família Albuquerque', color: '#e0922a', pm: PEOPLE.rui, status: 'Em curso', tag: 'b-amber', horasPrev: 900, horasReais: 612, honorarios: 86000, faturado: 12900, recebido: 0, prazo: 41 },
  { code: 'PY-112', name: 'Mercado do Bolhão', client: 'Câmara Municipal', color: '#d65151', pm: PEOPLE.sofia, status: 'Em risco', tag: 'b-red', horasPrev: 1400, horasReais: 1505, honorarios: 134000, faturado: 18600, recebido: 0, prazo: 28 },
  { code: 'PY-109', name: 'Loja Flagship — Avenida', client: 'Nordeste Retail', color: '#1f9d6b', pm: PEOPLE.rui, status: 'Concluído', tag: 'b-green', horasPrev: 640, horasReais: 598, honorarios: 58000, faturado: 58000, recebido: 58000, prazo: 100 },
];

// Resumo por colaborador — base da folha "Resumo_Colaboradores"
// produtividade = horas previstas ÷ horas reais (acumulado do ano)
const REPORT_COL = [
  { p: PEOPLE.ana, projetos: 4, fases: 9, prev: 1180, real: 1142, billablePct: 86 },
  { p: PEOPLE.rui, projetos: 3, fases: 7, prev: 1320, real: 1408, billablePct: 88 },
  { p: PEOPLE.joana, projetos: 2, fases: 5, prev: 880, real: 951, billablePct: 91 },
  { p: PEOPLE.sofia, projetos: 3, fases: 6, prev: 760, real: 712, billablePct: 78 },
  { p: PEOPLE.tiago, projetos: 2, fases: 4, prev: 690, real: 705, billablePct: 84 },
  { p: PEOPLE.miguel, projetos: 2, fases: 5, prev: 940, real: 1020, billablePct: 90 },
  { p: PEOPLE.pedro, projetos: 3, fases: 6, prev: 820, real: 868, billablePct: 82 },
];
// Custo/hora médio do gabinete (blended) para estimativas de custo de produção
const TS_BLENDED = 33;

/* ---------- Controlo de custos (Financeiro › Custos) ----------
   Edifício Marquês — orçamento de custos €192.000 · gasto €121.400 (= spent do projeto) */
const COSTS = {
  project: 'Edifício Marquês — Reabilitação', code: 'PY-118', contract: 248000, budget: 192000, spent: 121400,
  phases: [
    { name: 'Arquitetura', tipo: 'Interno', tag: 'b-violet', prev: 68000, real: 41200 },
    { name: 'Estabilidade', tipo: 'Subcontratado', tag: 'b-blue', prev: 32000, real: 28800 },
    { name: 'Especialidades MEP', tipo: 'Subcontratado', tag: 'b-blue', prev: 28000, real: 19400 },
    { name: 'Coordenação BIM', tipo: 'Interno', tag: 'b-violet', prev: 22000, real: 14200 },
    { name: 'Topografia e sondagens', tipo: 'Subcontratado', tag: 'b-blue', prev: 18000, real: 6200 },
    { name: 'Licenciamento e taxas', tipo: 'Externo', tag: 'b-gray', prev: 12000, real: 11600 },
    { name: 'Imprevistos', tipo: 'Reserva', tag: 'b-gray', prev: 12000, real: 0 },
  ],
  suppliers: [
    { name: 'EngForma Lda', spec: 'Projeto de Estabilidade', contratado: 28000, faturado: 24800, status: 'Em curso', tag: 'b-amber' },
    { name: 'TermoAr Engenharia', spec: 'Especialidades MEP', contratado: 22000, faturado: 14000, status: 'Em curso', tag: 'b-amber' },
    { name: 'GeoSolos', spec: 'Sondagens geotécnicas', contratado: 9500, faturado: 6200, status: 'Em curso', tag: 'b-amber' },
    { name: 'TopoNorte', spec: 'Levantamento topográfico', contratado: 4800, faturado: 4800, status: 'Concluído', tag: 'b-green' },
    { name: 'Acústica Plus', spec: 'Projeto acústico', contratado: 6500, faturado: 0, status: 'Por iniciar', tag: 'b-gray' },
  ],
};

/* ---------- Cronograma Global (portfólio · previsto vs real) ----------
   Base da folha "Cronograma_Global": Projeto · Fase · Responsável · Crítica ·
   Início/Fim Previsto vs Real · Prazo %. Coordenadas ABSOLUTAS em meses sobre
   o intervalo years[]: 0 = Jan do primeiro ano … 12 = Jan do ano seguinte.
   Projetos podem atravessar anos (ex.: PY-115 2025→2026, PY-120 2026→2027). */
const GANTT_GLOBAL = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  years: [2025, 2026, 2027],
  today: 17.25, // ~8 Jun 2026  (12 + 5.25)
  projects: [
    {
      code: 'PY-118', name: 'Edifício Marquês', color: '#6a5af9', pm: PEOPLE.ana, health: 'green', prazo: 64,
      phases: [
        { name: 'Estudo Prévio', who: PEOPLE.rui, critica: false, prev: [12.2, 13.6], real: [12.2, 13.7], prazo: 100, estado: 'Concluída' },
        { name: 'Licenciamento', who: PEOPLE.ana, critica: true, prev: [13.5, 15.6], real: [13.6, 16.0], prazo: 100, estado: 'Concluída' },
        { name: 'Projeto de Execução', who: PEOPLE.pedro, critica: true, prev: [15.8, 18.8], real: [16.0, 17.25], prazo: 64, estado: 'Em curso' },
        { name: 'Assistência Técnica', who: PEOPLE.rui, critica: false, prev: [18.6, 21.8], real: null, prazo: 0, estado: 'Por iniciar' },
      ],
    },
    {
      code: 'PY-115', name: 'Sede Nova — Vértice', color: '#2a7fb8', pm: PEOPLE.ana, health: 'green', prazo: 78,
      phases: [
        { name: 'Estudo Prévio', who: PEOPLE.rui, critica: false, prev: [10.0, 11.3], real: [10.0, 11.4], prazo: 100, estado: 'Concluída' },
        { name: 'Projeto Base', who: PEOPLE.joana, critica: true, prev: [11.2, 13.0], real: [11.2, 13.1], prazo: 100, estado: 'Concluída' },
        { name: 'Projeto de Execução', who: PEOPLE.tiago, critica: true, prev: [12.9, 16.5], real: [13.0, 17.25], prazo: 88, estado: 'Em curso' },
        { name: 'Assistência Técnica', who: PEOPLE.ana, critica: false, prev: [16.5, 20.0], real: null, prazo: 0, estado: 'Por iniciar' },
      ],
    },
    {
      code: 'PY-117', name: 'Quinta do Lago — V4', color: '#e0922a', pm: PEOPLE.rui, health: 'amber', prazo: 41,
      phases: [
        { name: 'Estudo Prévio', who: PEOPLE.rui, critica: false, prev: [13.0, 14.4], real: [13.1, 14.6], prazo: 100, estado: 'Concluída' },
        { name: 'Licenciamento', who: PEOPLE.sofia, critica: true, prev: [14.3, 16.5], real: [14.6, 17.25], prazo: 70, estado: 'Em curso' },
        { name: 'Projeto de Execução', who: PEOPLE.tiago, critica: false, prev: [16.5, 20.0], real: null, prazo: 0, estado: 'Por iniciar' },
      ],
    },
    {
      code: 'PY-112', name: 'Mercado do Bolhão', color: '#d65151', pm: PEOPLE.sofia, health: 'red', prazo: 28,
      phases: [
        { name: 'Estudo Prévio', who: PEOPLE.sofia, critica: false, prev: [12.8, 14.2], real: [13.0, 14.8], prazo: 100, estado: 'Concluída' },
        { name: 'Projeto Base', who: PEOPLE.pedro, critica: true, prev: [14.2, 16.0], real: [14.8, 17.25], prazo: 55, estado: 'Em curso' },
        { name: 'Licenciamento', who: PEOPLE.sofia, critica: true, prev: [16.0, 18.5], real: null, prazo: 0, estado: 'Por iniciar' },
      ],
    },
    {
      code: 'PY-120', name: 'Parque Logístico — Maia', color: '#1f9d6b', pm: PEOPLE.ana, health: 'amber', prazo: 0,
      phases: [
        { name: 'Estudo Prévio', who: PEOPLE.ana, critica: false, prev: [21.0, 23.0], real: null, prazo: 0, estado: 'Por iniciar' },
        { name: 'Projeto Base', who: PEOPLE.miguel, critica: true, prev: [23.0, 26.0], real: null, prazo: 0, estado: 'Por iniciar' },
        { name: 'Licenciamento', who: PEOPLE.ana, critica: true, prev: [26.0, 30.0], real: null, prazo: 0, estado: 'Por iniciar' },
      ],
    },
  ],
};

/* ===== MERGE — campos do modelo do cliente (ADITIVO · não substitui nada) =====
   Acrescenta às estruturas existentes os campos que faltavam face às tabelas do
   ficheiro do cliente. Os totais por fase são distribuídos a partir dos totais
   por projeto (REPORT_PROJ) e reconciliam com eles. */
const FASES_PROJETOS = [];
{
  // --- Colaboradores: Email · Telefone · Ativo (Função e Custo Hora já existiam) ---
  const CONTACT = {
    ana:    { email: 'ana.moreira@atelier.pt',  phone: '+351 91 200 3040', ativo: true },
    rui:    { email: 'rui.cardoso@atelier.pt',  phone: '+351 93 110 2210', ativo: true },
    joana:  { email: 'joana.faria@atelier.pt',  phone: '+351 96 330 7788', ativo: true },
    sofia:  { email: 'sofia.lemos@atelier.pt',  phone: '+351 92 540 1190', ativo: true },
    tiago:  { email: 'tiago.pinto@atelier.pt',  phone: '+351 91 770 6610', ativo: true },
    miguel: { email: 'miguel.nunes@atelier.pt', phone: '+351 93 880 4455', ativo: true },
    pedro:  { email: 'pedro.dias@atelier.pt',   phone: '+351 96 120 9933', ativo: false },
  };
  Object.keys(CONTACT).forEach(k => { if (PEOPLE[k]) Object.assign(PEOPLE[k], CONTACT[k]); });

  // --- Projetos: Prioridade · Início/Fim Real · Desvio Prazo (dias) · Observações ---
  const PROJ_EXTRA = {
    'PY-118': { prioridade: 'Alta',  startReal: '12 Jan 2026', endReal: '—',           desvioDias: 6,  observacoes: 'Execução a recuperar atraso da platibanda.' },
    'PY-117': { prioridade: 'Média', startReal: '05 Mar 2026', endReal: '—',           desvioDias: 18, observacoes: 'Licenciamento dependente de elementos da Câmara.' },
    'PY-115': { prioridade: 'Alta',  startReal: '10 Set 2025', endReal: '—',           desvioDias: 2,  observacoes: 'Dentro do prazo; Assistência Técnica por iniciar.' },
    'PY-112': { prioridade: 'Alta',  startReal: '25 Out 2025', endReal: '—',           desvioDias: 34, observacoes: 'Em risco — parecer camarário e derrapagem de custos.' },
    'PY-109': { prioridade: 'Baixa', startReal: '02 Jun 2025', endReal: '18 Dez 2025', desvioDias: 0,  observacoes: 'Concluído e encerrado.' },
    'PY-120': { prioridade: 'Média', startReal: '—',           endReal: '—',           desvioDias: 0,  observacoes: 'Proposta enviada; aguarda adjudicação.' },
  };
  PROJECTS.forEach(p => { if (PROJ_EXTRA[p.code]) Object.assign(p, PROJ_EXTRA[p.code]); });

  // --- Registo de horas: Colaborador · Descrição · Custo (€) (Código Fase = projeto) ---
  const TS_DESC = {
    tr1: 'Pormenores de execução — cobertura', tr2: 'Coordenação do modelo federado',
    tr3: 'Apoio a obra e telas finais', tr4: 'Instrução do processo camarário',
    tr5: 'Revisão do Projeto Base', tr6: 'Reuniões internas e gestão',
  };
  if (typeof TS_ROWS !== 'undefined') TS_ROWS.forEach(r => {
    const tot = (r.hours || []).reduce((a, b) => a + b, 0);
    r.colaborador = ME.name;
    r.codigoFase = r.code && r.code !== '—' ? r.code : '—';
    r.descricao = TS_DESC[r.id] || '';
    r.custo = Math.round(tot * (ME.rate || 45));
  });
  if (typeof TS_DAY !== 'undefined') TS_DAY.forEach(b => {
    b.colaborador = ME.name;
    b.descricao = b.phase;
    b.custo = Math.round((b.dur || 0) * (ME.rate || 45));
  });

  // --- Fases_Projetos: detalhe POR FASE (merge nas fases do Cronograma + tabela plana) ---
  const tipoFase = (n) => /licenc/i.test(n) ? 'Licenciamento' : /estudo/i.test(n) ? 'Estudo Prévio'
    : /execu/i.test(n) ? 'Produção' : /base/i.test(n) ? 'Produção' : /assist/i.test(n) ? 'Assistência' : 'Produção';
  GANTT_GLOBAL.projects.forEach(p => {
    const rp = (typeof REPORT_PROJ !== 'undefined') ? REPORT_PROJ.find(r => r.code === p.code) : null;
    const tot = rp || { horasPrev: 0, horasReais: 0, honorarios: 0, faturado: 0, recebido: 0 };
    const durs = p.phases.map(f => Math.max(0.1, f.prev[1] - f.prev[0]));
    const sumD = durs.reduce((a, b) => a + b, 0) || 1;
    const w = durs.map(d => d / sumD);
    const actW = p.phases.map((f, i) => (f.estado === 'Concluída' ? 1 : f.estado === 'Em curso' ? (f.prazo / 100) : 0) * w[i]);
    const sumAct = actW.reduce((a, b) => a + b, 0) || 1;
    let remFat = tot.faturado, remRec = tot.recebido;
    p.phases.forEach((f, i) => {
      const codigoFase = p.code + '.' + (i + 1);
      const horasPrev = Math.round(tot.horasPrev * w[i]);
      const horasReais = Math.round(tot.horasReais * (actW[i] / sumAct));
      const honorarios = Math.round(tot.honorarios * w[i]);
      const pctConclusao = f.estado === 'Concluída' ? 100 : f.estado === 'Em curso' ? f.prazo : 0;
      let faturado = 0, recebido = 0;
      if (f.estado !== 'Por iniciar') { faturado = Math.min(honorarios, remFat); remFat -= faturado; recebido = Math.min(faturado, remRec); remRec -= recebido; }
      const observacoes = f.estado === 'Concluída' ? 'Fase concluída e validada.' : f.estado === 'Em curso' ? ('Em execução · ' + f.prazo + '% concluído.') : 'Por iniciar.';
      const tipo = tipoFase(f.name);
      // MERGE: enriquece a própria fase do Cronograma (mantém prev/real/critica/etc.)
      Object.assign(f, { codigoFase, horasPrev, horasReais, honorarios, faturado, recebido, pctConclusao, observacoes, tipo });
      FASES_PROJETOS.push({ codigoFase, code: p.code, projeto: p.name, fase: f.name, responsavel: f.who, estado: f.estado, critica: f.critica, prev: f.prev, real: f.real, prazo: f.prazo, horasPrev, horasReais, honorarios, faturado, recebido, pctConclusao, observacoes, tipo });
    });
  });
}

/* ---------- Approvals queue ---------- */
const APPROVAL_QUEUE = [
  { id: 'ap1', title: 'Projeto de Estabilidade v2', project: 'Edifício Marquês', code: 'PY-118', type: 'Entregável', tag: 'b-violet', who: PEOPLE.joana, time: 'há 18 min', amount: null, prio: 'Alta',
    steps: [{ who: PEOPLE.joana, role: 'Submissão', state: 'done', when: 'há 18 min' }, { who: PEOPLE.miguel, role: 'Revisão técnica', state: 'current', when: 'a aguardar' }, { who: PEOPLE.ana, role: 'Aprovação final', state: 'pending', when: '' }],
    note: 'Revisão do cálculo dos pisos 2 e 3 após parecer da fiscalização. Inclui memória atualizada e mapa de armaduras.' },
  { id: 'ap2', title: 'Orçamento adicional — sondagens geotécnicas', project: 'Quinta do Lago — V4', code: 'PY-117', type: 'Change Request', tag: 'b-amber', who: PEOPLE.rui, time: 'há 1 dia', amount: 4800, prio: 'Média',
    steps: [{ who: PEOPLE.rui, role: 'Pedido', state: 'done', when: 'há 1 dia' }, { who: PEOPLE.ana, role: 'Aprovação do cliente', state: 'current', when: 'a aguardar' }],
    note: 'Necessárias 3 sondagens adicionais a 12 m após análise do relatório preliminar. Custo estimado €4.800 + IVA.' },
  { id: 'ap3', title: 'Pagamento milestone — Execução 50%', project: 'Sede Nova — Vértice', code: 'PY-115', type: 'Pagamento', tag: 'b-green', who: PEOPLE.ana, time: 'há 2 dias', amount: 61500, prio: 'Alta',
    steps: [{ who: PEOPLE.ana, role: 'Emissão', state: 'done', when: 'há 2 dias' }, { who: PEOPLE.rui, role: 'Validação', state: 'done', when: 'há 1 dia' }, { who: { initials: 'GV', name: 'Grupo Vértice', color: '#2a7fb8', role: 'Cliente' }, role: 'Confirmação cliente', state: 'current', when: 'a aguardar' }],
    note: 'Faturação do milestone de 50% do Projeto de Execução, conforme plano de pagamentos contratado (€61.500).' },
  { id: 'ap4', title: 'Mapa de Quantidades v2', project: 'Edifício Marquês', code: 'PY-118', type: 'Entregável', tag: 'b-violet', who: PEOPLE.pedro, time: 'há 3 dias', amount: null, prio: 'Baixa',
    steps: [{ who: PEOPLE.pedro, role: 'Submissão', state: 'done', when: 'há 3 dias' }, { who: PEOPLE.ana, role: 'Aprovação final', state: 'current', when: 'a aguardar' }],
    note: 'Atualização de quantidades de betão e aço após alterações no projeto de execução.' },
];

/* ---------- SMS threads ---------- */
const SMS_THREADS = [
  { id: 's1', name: 'Grupo Vértice SA', initials: 'GV', color: '#2a7fb8', phone: '+351 91 234 5678', project: 'Sede Nova', unread: 0, last: 'APROVO',
    msgs: [
      { dir: 'out', text: 'Olá. O entregável "Projeto de Execução 50%" aguarda a vossa aprovação. Responda APROVO ou REJEITO. — ProjectYard', time: '09:12', auto: true },
      { dir: 'in', text: 'APROVO', time: '09:41' },
      { dir: 'out', text: 'Obrigado! Aprovação registada às 09:41. O milestone de pagamento foi desbloqueado.', time: '09:41', auto: true },
    ] },
  { id: 's2', name: 'Família Albuquerque', initials: 'FA', color: '#1f9d6b', phone: '+351 96 555 1212', project: 'Quinta do Lago', unread: 2, last: 'Podemos falar amanhã de manhã?',
    msgs: [
      { dir: 'out', text: 'Bom dia. Lembrete: reunião de acompanhamento da moradia V4 marcada para 6ª às 15h.', time: 'Ontem 14:02', auto: true },
      { dir: 'in', text: 'Bom dia. Surgiu um imprevisto.', time: '08:30' },
      { dir: 'in', text: 'Podemos falar amanhã de manhã?', time: '08:31' },
    ] },
  { id: 's3', name: 'Imobiliária Atlântico', initials: 'IA', color: '#6a5af9', phone: '+351 93 888 4040', project: 'Edifício Marquês', unread: 0, last: 'Recebido, obrigado.',
    msgs: [
      { dir: 'out', text: 'A fatura FT 2026/041 (€37.200) foi emitida. Vencimento a 26 Mai.', time: '12 Mai 10:00', auto: true },
      { dir: 'in', text: 'Recebido, obrigado.', time: '12 Mai 10:18' },
    ] },
  { id: 's4', name: 'Câmara Municipal', initials: 'CM', color: '#e0922a', phone: '+351 22 339 0000', project: 'Mercado do Bolhão', unread: 0, last: 'Processo em análise.',
    msgs: [
      { dir: 'out', text: 'Submissão do Projeto Base do lote de quiosques efetuada. Aguardamos parecer.', time: '2 Jun 16:20', auto: false },
      { dir: 'in', text: 'Processo em análise.', time: '3 Jun 09:05' },
    ] },
];
const SMS_TEMPLATES = [
  { name: 'Pedido de aprovação', body: 'O entregável "{entregavel}" aguarda aprovação. Responda APROVO ou REJEITO.' },
  { name: 'Lembrete de reunião', body: 'Lembrete: reunião de {projeto} marcada para {data} às {hora}.' },
  { name: 'Fatura emitida', body: 'A fatura {numero} ({valor}) foi emitida. Vencimento a {vencimento}.' },
  { name: 'Aviso de prazo', body: 'O prazo do entregável "{entregavel}" termina a {data}.' },
];

/* ---------- Risk register ---------- */
const RISKS = [
  { id: 'r1', title: 'Atraso na aprovação camarária', project: 'Mercado do Bolhão', code: 'PY-112', cat: 'Licenciamento', prob: 4, impact: 5, owner: PEOPLE.sofia, status: 'Aberto', statusTag: 'b-red', mitig: 'Reuniões quinzenais com a autarquia e submissão antecipada de elementos.' },
  { id: 'r2', title: 'Sondagens geotécnicas em falta', project: 'Quinta do Lago — V4', code: 'PY-117', cat: 'Técnico', prob: 3, impact: 4, owner: PEOPLE.tiago, status: 'Aberto', statusTag: 'b-amber', mitig: 'Contratação de empresa de sondagens; orçamento adicional em aprovação.' },
  { id: 'r3', title: 'Derrapagem de custos — estruturas', project: 'Mercado do Bolhão', code: 'PY-112', cat: 'Financeiro', prob: 3, impact: 5, owner: PEOPLE.ana, status: 'Aberto', statusTag: 'b-red', mitig: 'Revisão do mapa de quantidades e renegociação com fornecedores.' },
  { id: 'r4', title: 'Indisponibilidade do coordenador BIM', project: 'Edifício Marquês', code: 'PY-118', cat: 'Recursos', prob: 2, impact: 4, owner: PEOPLE.ana, status: 'Mitigado', statusTag: 'b-green', mitig: 'Segundo modelador formado e com acesso ao modelo central.' },
  { id: 'r5', title: 'Alterações de programa pelo cliente', project: 'Sede Nova — Vértice', code: 'PY-115', cat: 'Âmbito', prob: 3, impact: 3, owner: PEOPLE.rui, status: 'Aberto', statusTag: 'b-amber', mitig: 'Registo formal de change requests com impacto em prazo e custo.' },
  { id: 'r6', title: 'Conflitos de compatibilização MEP', project: 'Edifício Marquês', code: 'PY-118', cat: 'Técnico', prob: 2, impact: 3, owner: PEOPLE.miguel, status: 'Monitorizado', statusTag: 'b-blue', mitig: 'Deteção de colisões semanal no modelo federado.' },
];

/* ---------- Gantt / cronograma (months 0=Jan … 11=Dez, 2026) ---------- */
const GANTT = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  today: 5.25, // ~8 Jun
  rows: [
    { type: 'phase', name: 'Estudo Prévio', start: 0.2, end: 1.6, progress: 100, color: '#1f9d6b' },
    { type: 'task', name: 'Levantamento e programa', start: 0.2, end: 0.9, progress: 100, who: PEOPLE.pedro },
    { type: 'task', name: 'Estudo de soluções', start: 0.8, end: 1.6, progress: 100, who: PEOPLE.rui },
    { type: 'phase', name: 'Projeto Base', start: 1.5, end: 3.6, progress: 100, color: '#2a7fb8' },
    { type: 'task', name: 'Plantas de implantação', start: 1.5, end: 2.4, progress: 100, who: PEOPLE.sofia },
    { type: 'task', name: 'Memória descritiva', start: 2.3, end: 3.6, progress: 100, who: PEOPLE.rui },
    { type: 'milestone', name: 'Projeto Base aprovado', at: 3.6, who: PEOPLE.ana },
    { type: 'phase', name: 'Licenciamento', start: 3.5, end: 6.6, progress: 72, color: '#6a5af9' },
    { type: 'task', name: 'Submissão à Câmara', start: 3.5, end: 4.3, progress: 100, who: PEOPLE.ana },
    { type: 'task', name: 'Projeto de estabilidade', start: 4.2, end: 5.8, progress: 65, who: PEOPLE.joana },
    { type: 'task', name: 'Especialidades MEP', start: 4.8, end: 6.6, progress: 40, who: PEOPLE.tiago },
    { type: 'milestone', name: 'Licença emitida', at: 6.6, who: PEOPLE.ana },
    { type: 'phase', name: 'Projeto de Execução', start: 5.0, end: 8.8, progress: 38, color: '#d9a32a' },
    { type: 'task', name: 'Pormenorização construtiva', start: 5.0, end: 7.2, progress: 55, who: PEOPLE.pedro },
    { type: 'task', name: 'Coordenação BIM / MEP', start: 6.0, end: 8.0, progress: 30, who: PEOPLE.miguel },
    { type: 'task', name: 'Mapa de quantidades e CE', start: 7.0, end: 8.8, progress: 10, who: PEOPLE.ana },
    { type: 'phase', name: 'Assistência Técnica', start: 8.6, end: 11.6, progress: 0, color: '#8a949e' },
    { type: 'task', name: 'Apoio a obra', start: 8.6, end: 11.6, progress: 0, who: PEOPLE.rui },
  ],
};

Object.assign(window, {
  I, PEOPLE, ME, OWNER, PROJECTS, KANBAN, DELIVERABLES, DOCS, INVOICES, MILESTONES,
  ACTIVITY, APPROVALS, REVENUE, TENANTS, fmt, eur, kk, KPIS,
  APPROVAL_QUEUE, SMS_THREADS, SMS_TEMPLATES, RISKS, GANTT,
  TS_WEEKS, TS_ROWS, TS_DAY, TS_PROJ, TS_TEAM, fmtH, TS_DAYS, TS_WEEKEND, TS_CAPACITY, semaforo, SEM_COL,
  LK_PRIORIDADES, LK_FASES, fmtDue,
  REPORT_PROJ, REPORT_COL, TS_BLENDED, GANTT_GLOBAL, COSTS,
  PROJECT_PHASES, projectPhases, LIFECYCLE,
});
