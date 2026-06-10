/* ProjectYard — App root, routing, tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d9a32a",
  "sidebar": "Escuro",
  "radius": 14,
  "tsLayout": "Grelha semanal"
}/*EDITMODE-END*/;

function applyAccent(hex) {
  const root = document.documentElement;
  const mix = (pct, other) => `color-mix(in srgb, ${hex} ${pct}%, ${other})`;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-600', mix(82, 'black'));
  root.style.setProperty('--accent-700', mix(68, 'black'));
  root.style.setProperty('--accent-soft', mix(14, 'white'));
  root.style.setProperty('--accent-soft2', mix(26, 'white'));
  root.style.setProperty('--grad-gold', `linear-gradient(135deg, ${mix(88, 'white')}, ${mix(90, 'black')})`);
}

function Placeholder({ icon, title, desc, go }) {
  return (
    <div className="content">
      <PageHead title={title} sub={desc} />
      <div className="card card-pad" style={{ minHeight: 360, display: 'grid', placeItems: 'center' }}>
        <div className="empty" style={{ maxWidth: 420 }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><Icon name={icon} size={34} /></div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{title}</div>
          <div style={{ marginTop: 6, lineHeight: 1.6 }}>{desc}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
            <button className="btn btn-primary btn-sm" onClick={() => go('dashboard')}><Icon name="grid" size={15} /> Voltar ao dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [logged, setLogged] = useState(false);
  const [route, setRoute] = useState(ME.platform ? 'workspaces' : 'dashboard');
  const [payload, setPayload] = useState(null);
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [modal, setModal] = useState(null); // 'cmdk' | 'novo'
  const [prefill, setPrefill] = useState(null);
  const [toast, setToast] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('py-collapsed') === '1');
  const [theme, setTheme] = useState(() => localStorage.getItem('py-theme') || 'auto');

  useEffect(() => { applyAccent(t.accent); }, [t.accent]);
  useEffect(() => { document.documentElement.style.setProperty('--r', t.radius + 'px'); document.documentElement.style.setProperty('--r-sm', (t.radius - 4) + 'px'); }, [t.radius]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.setAttribute('data-theme', theme === 'auto' ? (mq.matches ? 'dark' : 'light') : (theme === 'noite' ? 'dark' : 'light'));
    apply(); localStorage.setItem('py-theme', theme);
    mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => { localStorage.setItem('py-collapsed', collapsed ? '1' : '0'); }, [collapsed]);

  // Toast global + atalho ⌘K
  useEffect(() => {
    window.PYToast = (msg) => { setToast(msg); window.clearTimeout(window.__ptt); window.__ptt = window.setTimeout(() => setToast(null), 2800); };
    window.PYNewProject = (pf) => { setPrefill(pf || null); setModal('novo'); };
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setModal(m => m === 'cmdk' ? null : 'cmdk'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const go = (r, p = null) => { setRoute(r); setPayload(p); setNavOpen(false); window.scrollTo({ top: 0 }); };
  const dark = t.sidebar === 'Escuro';

  if (!logged) {
    return (
      <React.Fragment>
        <Login onEnter={() => { setLogged(true); go(ME.platform ? 'workspaces' : 'dashboard'); }}
          theme={theme} onCycleTheme={() => setTheme(p => p === 'auto' ? 'dia' : p === 'dia' ? 'noite' : 'auto')} />
        <TweaksUI t={t} setTweak={setTweak} />
      </React.Fragment>
    );
  }

  const titles = {
    dashboard: 'Dashboard', projects: 'Projetos', tasks: 'Tarefas', timesheets: 'Registo de horas', deliverables: 'Entregáveis',
    payments: 'Financeiro', documents: 'Documentos', reports: 'Relatórios', cronoglobal: 'Cronograma global', approvals: 'Aprovações', sms: 'SMS', risks: 'Riscos', settings: 'Definições', workspaces: 'Workspaces', compliance: 'Conformidade RGPD',
  };

  let screen;
  switch (route) {
    case 'dashboard': screen = <Dashboard go={go} />; break;
    case 'projects': screen = <Projects go={go} />; break;
    case 'project': screen = <ProjectDetail p={payload} go={go} />; break;
    case 'tasks': screen = <Tasks go={go} />; break;
    case 'timesheets': screen = <Timesheets go={go} layout={t.tsLayout} />; break;
    case 'gantt': screen = <Gantt go={go} />; break;
    case 'calendar': screen = <Calendar go={go} />; break;
    case 'clients': screen = <Clients go={go} />; break;
    case 'chat': screen = <Chat go={go} />; break;
    case 'email': screen = <Email go={go} />; break;
    case 'deliverables': screen = <Deliverables go={go} />; break;
    case 'documents': screen = <Documents go={go} />; break;
    case 'payments': screen = <Payments go={go} />; break;
    case 'approvals': screen = <Approvals go={go} />; break;
    case 'sms': screen = <SMSScreen go={go} />; break;
    case 'risks': screen = <Risks go={go} />; break;
    case 'reports': screen = <Reports go={go} />; break;
    case 'cronoglobal': screen = <CronogramaGlobal go={go} />; break;
    case 'settings': screen = <SettingsScreen go={go} />; break;
    case 'workspaces': screen = <PlatformConsole go={go} onOpen={(t2) => { setTenant(t2); go('dashboard'); }} />; break;
    case 'compliance': screen = <ChatCompliance go={go} />; break;
    default: screen = <Dashboard go={go} />;
  }

  const navActive = route === 'project' ? 'projects' : route;
  const platformMode = ME.platform && route !== 'workspaces';

  return (
    <div className={'app' + (collapsed ? ' nav-collapsed' : '')}>
      <Sidebar route={navActive} go={go} dark={dark} tenant={tenant} mobileOpen={navOpen} onClose={() => setNavOpen(false)}
        collapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)}
        onPickTenant={(t2) => { setTenant(t2); go('dashboard'); }} onConsole={() => go('workspaces')} />
      <div className="main">
        <Topbar title={titles[route]} onLogout={() => { setLogged(false); }}
          onCmdK={() => setModal('cmdk')} onNovo={() => setModal('novo')} onMenu={() => setNavOpen(true)}
          theme={theme} onCycleTheme={() => setTheme(p => p === 'auto' ? 'dia' : p === 'dia' ? 'noite' : 'auto')}
          onBell={() => { if (window.PYToast) window.PYToast('Sem notificações novas'); }} />
        {platformMode && (
          <div className="platform-bar">
            <Icon name="shield" size={15} />
            <span>Modo plataforma · a ver <b>{tenant.name}</b></span>
            <button onClick={() => go('workspaces')}><Icon name="chevL" size={14} /> Voltar à consola</button>
          </div>
        )}
        {screen}
      </div>
      <CommandPalette open={modal === 'cmdk'} onClose={() => setModal(null)} go={(r, p) => { setModal(null); go(r, p); }} onNovo={() => setModal('novo')} />
      <NovoProjetoModal open={modal === 'novo'} onClose={() => { setModal(null); setPrefill(null); }} prefill={prefill} go={go} />
      <Toast msg={toast} />
      <TweaksUI t={t} setTweak={setTweak} />
    </div>
  );
}

function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Marca" />
      <TweakColor label="Cor de acento" value={t.accent}
        options={['#d9a32a', '#c1683a', '#2f8f6b', '#2a6f9e', '#7a5ad0']}
        onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Aparência" />
      <TweakRadio label="Barra lateral" value={t.sidebar} options={['Escuro', 'Claro']}
        onChange={(v) => setTweak('sidebar', v)} />
      <TweakSlider label="Cantos" value={t.radius} min={6} max={22} step={2} unit="px"
        onChange={(v) => setTweak('radius', v)} />
      <TweakSection label="Registo de horas" />
      <TweakRadio label="Vista por omissão" value={t.tsLayout} options={['Grelha semanal', 'Diário', 'Por projeto']}
        onChange={(v) => setTweak('tsLayout', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
