/* ProjectYard — Shared UI components */
const { useState, useEffect, useRef } = React;

/* ---------- Small primitives ---------- */
function Avatar({ p, size = 34, sq = false }) {
  return React.createElement('div', {
    className: 'avatar' + (sq ? ' sq' : ''),
    style: { width: size, height: size, background: p.color, fontSize: size * 0.4 }
  }, p.initials);
}

function AvStack({ people, max = 4, size = 30 }) {
  const shown = people.slice(0, max);
  const extra = people.length - max;
  return (
    <div className="av-stack">
      {shown.map((p, i) => <div key={i} title={p.name}><Avatar p={p} size={size} /></div>)}
      {extra > 0 && (
        <div className="avatar av-more" style={{ width: size, height: size, fontSize: size * 0.36, marginLeft: -9, border: '2px solid var(--surface)' }}>+{extra}</div>
      )}
    </div>
  );
}

function Badge({ tag, children, dot = true }) {
  return <span className={'badge ' + tag}>{dot && <span className="bdot"></span>}{children}</span>;
}

function Progress({ value, thin = false, color }) {
  return (
    <div className={'prog' + (thin ? ' thin' : '')}>
      <span style={{ width: value + '%', background: color || 'var(--grad)' }}></span>
    </div>
  );
}

function Ring({ value, size = 116, stroke = 11, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringg)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.7,.3,1)' }} />
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-700)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div className="num" style={{ fontSize: size * 0.26, fontWeight: 700, lineHeight: 1 }}>{value}%</div>
          {label && <div className="muted-3" style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

function Icon({ name, ...rest }) {
  const C = I[name];
  return C ? <C {...rest} /> : null;
}

/* ---------- Sortable table helpers ---------- */
function useSort(rows, accessors = {}, initialKey = null, initialDir = 'asc') {
  const [key, setKey] = useState(initialKey);
  const [dir, setDir] = useState(initialDir);
  const toggle = (k) => {
    if (key === k) { setDir(d => d === 'asc' ? 'desc' : 'asc'); }
    else { setKey(k); setDir('asc'); }
  };
  let sorted = rows;
  if (key) {
    const get = accessors[key] || ((r) => r[key]);
    sorted = [...rows].sort((a, b) => {
      const va = get(a), vb = get(b);
      let c;
      if (typeof va === 'number' && typeof vb === 'number') c = va - vb;
      else c = String(va).localeCompare(String(vb), 'pt', { numeric: true });
      return dir === 'asc' ? c : -c;
    });
  }
  return { sorted, key, dir, toggle };
}

function SortCaret({ dir }) {
  return (
    <span style={{ display: 'inline-grid', opacity: dir ? 0.9 : 0.3, transition: 'opacity .15s' }}>
      <Icon name="chevD" size={13} style={{ transform: dir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
    </span>
  );
}

function Th({ label, k, sort, align = 'left', style }) {
  const active = sort.key === k;
  return (
    <th onClick={() => sort.toggle(k)} style={{ cursor: 'pointer', userSelect: 'none', textAlign: align, ...style }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: active ? 'var(--text-2)' : undefined }}>{label}<SortCaret dir={active ? sort.dir : null} /></span>
    </th>
  );
}

/* ---------- Modal / Toast / Field ---------- */
function Modal({ open, onClose, title, sub, children, footer, width = 480, bare = false }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className={'modal-card' + (bare ? ' modal-card--bare' : '')} style={{ width }} onMouseDown={(e) => e.stopPropagation()}>
        {!bare && (
          <div className="modal-head">
            <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
            <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={onClose}><Icon name="x" size={18} /></button>
          </div>
        )}
        {bare ? children : <div className="modal-body">{children}</div>}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast"><Icon name="check" size={16} /> {msg}</div>;
}

function Field({ label, children, hint, half }) {
  return (
    <div className="fld" style={half ? { flex: 1, minWidth: 0 } : undefined}>
      <label>{label}</label>
      {children}
      {hint && <div className="muted-3" style={{ fontSize: 12, fontWeight: 600, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}
function TextInput(props) {
  return <div className="fld__box" style={{ height: 46 }}><input {...props} /></div>;
}
function SelectInput({ children, ...props }) {
  return <div className="fld__box" style={{ height: 46, paddingRight: 6 }}><select {...props} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, fontWeight: 600, color: 'var(--text)', appearance: 'none', cursor: 'pointer' }}>{children}</select><Icon name="chevD" size={16} /></div>;
}

/* ---------- Sidebar ---------- */
const NAV_GROUPS = [
  { label: 'Workspace', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'projects', label: 'Projetos', icon: 'folder' },
    { id: 'tasks', label: 'Tasks', icon: 'checkSquare', badge: KANBAN.tasks.filter(t => t.overdue).length + KANBAN.tasks.filter(t => t.col === 'review').length },
    { id: 'gantt', label: 'Cronograma', icon: 'gantt' },
    { id: 'calendar', label: 'Calendário', icon: 'calendar' },
    { id: 'timesheets', label: 'Registo de horas', icon: 'clock' },
  ] },
  { label: 'Comercial', items: [
    { id: 'clients', label: 'Clientes', icon: 'users' },
    { id: 'deliverables', label: 'Entregáveis', icon: 'layers', badge: 2 },
    { id: 'payments', label: 'Pagamentos', icon: 'card' },
  ] },
  { label: 'Comunicação', items: [
    { id: 'chat', label: 'Chat', icon: 'message', badge: 2 },
    { id: 'email', label: 'Correio', icon: 'mail', badge: 12 },
    { id: 'sms', label: 'SMS', icon: 'sms' },
  ] },
  { label: 'Controlo', items: [
    { id: 'reports', label: 'Relatórios', icon: 'trend' },
    { id: 'cronoglobal', label: 'Cronograma global', icon: 'gantt' },
    { id: 'approvals', label: 'Aprovações', icon: 'shield', badge: 3 },
    { id: 'documents', label: 'Documentos', icon: 'fileText' },
    { id: 'risks', label: 'Riscos', icon: 'alert' },
  ] },
];
const NAV = NAV_GROUPS[0].items;

function Sidebar({ route, go, dark, tenant, onSwitch, onPickTenant, onConsole, mobileOpen, onClose, collapsed, onToggleCollapse }) {
  const nav = (id) => { go(id); if (onClose) onClose(); };
  const [wsOpen, setWsOpen] = useState(false);
  return (
    <React.Fragment>
    {mobileOpen && <div className="side-backdrop" onClick={onClose}></div>}
    <aside className={'sidebar' + (dark ? ' side--dark' : '') + (mobileOpen ? ' open' : '')}>
      <div className="brand">
        <div className="brand__logo"><img src="assets/projectyard-icon.png" alt="ProjectYard" /></div>
        <div className="brand__name">ProjectYard<small>Plan · Build · Deliver</small></div>
        <button className="collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Expandir menu' : 'Encolher menu'} aria-label="Encolher menu"><Icon name={collapsed ? 'chevR' : 'chevL'} size={16} /></button>
      </div>

      <div className="ws-wrap">
        <button className="user-chip" onClick={() => setWsOpen(o => !o)} style={{ marginBottom: 8, width: '100%' }}>
          <Avatar p={{ initials: tenant.initials, color: tenant.color }} size={34} sq />
          <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tenant.name}</div>
            <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{ME.platform ? 'Acesso de plataforma' : 'Plano ' + tenant.plan}</div>
          </div>
          <Icon name="chevD" size={16} style={{ transform: wsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {wsOpen && (
          <React.Fragment>
            <div className="ws-backdrop" onClick={() => setWsOpen(false)}></div>
            <div className="ws-menu">
              <div className="ws-menu__lbl">{ME.platform ? 'Entrar num workspace' : 'Trocar workspace'}</div>
              {TENANTS.map(t => (
                <button key={t.slug} className={'ws-opt' + (t.slug === tenant.slug ? ' on' : '')} disabled={t.estado === 'Suspenso'}
                  onClick={() => { setWsOpen(false); if (onPickTenant) onPickTenant(t); }}>
                  <Avatar p={{ initials: t.initials, color: t.color }} size={30} sq />
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{t.plan}{t.estado !== 'Ativo' ? ' · ' + t.estado : ''}</div>
                  </div>
                  {t.slug === tenant.slug ? <Icon name="check" size={16} style={{ color: 'var(--accent-700)' }} /> : t.estado === 'Suspenso' ? <Icon name="lock" size={14} style={{ color: 'var(--text-3)' }} /> : null}
                </button>
              ))}
              {ME.platform && <button className="ws-opt ws-opt--foot" onClick={() => { setWsOpen(false); if (onConsole) onConsole(); }}><Icon name="building" size={16} /> Consola de workspaces</button>}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="side-scroll">
        {ME.platform && (
          <React.Fragment>
            <div className="nav-label">Plataforma</div>
            <button className={'nav-item' + (route === 'workspaces' ? ' active' : '')} onClick={() => nav('workspaces')} title="Workspaces">
              <Icon name="building" size={19} />
              <span>Workspaces</span>
            </button>
            <button className={'nav-item' + (route === 'compliance' ? ' active' : '')} onClick={() => nav('compliance')} title="Conformidade RGPD">
              <Icon name="shield" size={19} />
              <span>Conformidade RGPD</span>
            </button>
          </React.Fragment>
        )}
        {NAV_GROUPS.map(g => (
          <React.Fragment key={g.label}>
            <div className="nav-label">{g.label}</div>
            {g.items.map(n => (
              <button key={n.id} className={'nav-item' + (route === n.id ? ' active' : '')} onClick={() => nav(n.id)} title={n.label}>
                <Icon name={n.icon} size={19} />
                <span>{n.label}</span>
                {n.badge && <span className="badge-count">{n.badge}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="side-foot">
        <div className="trial-card">
          <div className="trial-card__title"><Icon name="spark" size={14} /> Trial — 18 dias</div>
          <div className="trial-bar"><span style={{ width: '40%' }}></span></div>
          <div className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>Plano Pro · 12 de 30 dias usados</div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Fazer upgrade</button>
        </div>
        <button className="nav-item" onClick={() => nav('settings')}><Icon name="settings" size={19} /><span>Definições</span></button>
      </div>
    </aside>
    </React.Fragment>
  );
}

/* ---------- Topbar ---------- */
function Topbar({ title, onLogout, onCmdK, onNovo, onBell, onMenu, theme, onCycleTheme }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Menu"><Icon name="menu" size={20} /></button>
      <button className="search" onClick={onCmdK} style={{ cursor: 'pointer', textAlign: 'left' }}>
        <Icon name="search" size={18} />
        <input placeholder="Procurar projetos, tarefas, documentos…" readOnly style={{ cursor: 'pointer' }} />
        <kbd style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px' }}>⌘K</kbd>
      </button>
      <div className="topbar__right">
        <button className="btn btn-primary btn-sm" style={{ height: 42 }} onClick={onNovo}><Icon name="plus" size={17} /> <span className="btn-label">Novo projeto</span></button>
        <button className="icon-btn" title={'Tema: ' + (theme === 'dia' ? 'Dia' : theme === 'noite' ? 'Noite' : 'Automático')} onClick={onCycleTheme}><Icon name={theme === 'dia' ? 'sun' : theme === 'noite' ? 'moon' : 'monitor'} size={19} /></button>
        <button className="icon-btn topbar-msg" onClick={onCmdK}><Icon name="message" size={19} /></button>
        <button className="icon-btn" onClick={onBell}><Icon name="bell" size={19} /><span className="dot"></span></button>
        <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }}></div>
        <button className="user-chip" onClick={onLogout} style={{ border: 'none', padding: '6px 8px' }}>
          <Avatar p={ME} size={36} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{ME.name}</div>
            {ME.role === 'Superadmin'
              ? <span className="badge b-navy" style={{ padding: '1px 7px', fontSize: 10, marginTop: 2 }}><Icon name="shield" size={10} /> Superadmin</span>
              : <div className="muted-3" style={{ fontSize: 11.5, fontWeight: 600 }}>{ME.role}</div>}
          </div>
        </button>
      </div>
    </header>
  );
}

/* ---------- Page scaffold ---------- */
function PageHead({ crumb, title, sub, actions }) {
  return (
    <div>
      {crumb && (
        <div className="breadcrumb">
          {crumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevR" size={13} />}
              <a>{c}</a>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {actions && <div className="page-head__actions">{actions}</div>}
      </div>
    </div>
  );
}

/* ---------- Stat card ---------- */
function Stat({ icon, iconBg, iconColor, value, label, trend, trendDir = 'up', foot, onClick }) {
  return (
    <div className={'card card-pad stat rise' + (onClick ? ' stat-link' : '')} onClick={onClick}>
      <div className="stat__top">
        <div className="stat__icon" style={{ background: iconBg, color: iconColor }}><Icon name={icon} size={23} /></div>
        {trend && <span className={'trend ' + trendDir}><Icon name={trendDir === 'up' ? 'arrowUp' : 'arrowUp'} size={13} style={{ transform: trendDir === 'down' ? 'rotate(180deg)' : 'none' }} />{trend}</span>}
        {onClick && !trend && <span className="stat__go"><Icon name="arrowRight" size={17} /></span>}
      </div>
      <div>
        <div className="stat__val">{value}</div>
        <div className="stat__label">{label}</div>
      </div>
      {foot && <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600, marginTop: -4 }}>{foot}</div>}
    </div>
  );
}

/* ---------- Mini charts ---------- */
function BarChart({ data, height = 150, accent }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div title={d.v + 'k €'} style={{
              width: '100%', height: (d.v / max * 100) + '%',
              background: i >= data.length - 2 ? 'var(--grad-gold)' : 'var(--accent-soft2)',
              borderRadius: '7px 7px 4px 4px', minHeight: 6, transition: 'height .6s'
            }}></div>
          </div>
          <span className="muted-3" style={{ fontSize: 11.5, fontWeight: 700 }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments, size = 132, stroke = 18 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, x) => s + x.v, 0);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
      {segments.map((s, i) => {
        const len = (s.v / total) * c;
        const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color}
          strokeWidth={stroke} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
        offset += len;
        return el;
      })}
    </svg>
  );
}

Object.assign(window, {
  Avatar, AvStack, Badge, Progress, Ring, Icon, Sidebar, Topbar,
  PageHead, Stat, BarChart, Donut, NAV, NAV_GROUPS,
  Modal, Toast, Field, TextInput, SelectInput,
  useSort, Th,
});
