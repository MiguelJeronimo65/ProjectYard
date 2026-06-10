/* ProjectYard — Login / Onboarding (single improved screen) */

function Login({ onEnter, theme, onCycleTheme }) {
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [recover, setRecover] = useState(false);
  const [sso, setSso] = useState(false);

  return (
    <div className="login">
      <button className="icon-btn login__theme" title={'Tema: ' + (theme === 'dia' ? 'Dia' : theme === 'noite' ? 'Noite' : 'Automático')} onClick={onCycleTheme}><Icon name={theme === 'dia' ? 'sun' : theme === 'noite' ? 'moon' : 'monitor'} size={18} /></button>
      {/* ===== Left — brand panel ===== */}
      <div className="login__brand">
        <div className="login__glow"></div>

        <div className="login__brandtop">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,.25)' }}>
              <img src="assets/projectyard-icon.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="display" style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>ProjectYard</span>
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.7 }}>projectyard.app</span>
        </div>

        <div className="login__brandmid">
          <div className="login__logocard">
            <img src="assets/projectyard-logo.png" alt="ProjectYard — Plan. Build. Deliver." />
          </div>
          <p className="login__lead">
            A plataforma de controlo de entrega para gabinetes de arquitetura, engenharia e consultoras.
          </p>
          <div className="login__stats">
            {[['24', 'Projetos ativos'], ['1.2k', 'Entregáveis controlados'], ['€840k', 'Faturado este ano']].map((s, i) => (
              <div key={i} className="login__stat">
                <div className="display num">{s[0]}</div>
                <div className="login__statlabel">{s[1]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="login__brandfoot">
          <span><Icon name="shield" size={15} /> Multi-tenant seguro</span>
          <span><Icon name="spark" size={15} /> Trial de 30 dias</span>
          <span><Icon name="check" size={15} /> RGPD</span>
        </div>
      </div>

      {/* ===== Right — sign in ===== */}
      <div className="login__auth">
        <div className="login__form rise">
          <h1 className="display login__title">Que bom ver-te de novo</h1>
          <p className="muted login__sub">Inicia sessão para continuar a gerir os teus projetos.</p>

          {/* Workspace selector */}
          <div className="login__wslabel">Workspace</div>
          <div className="login__ws">
            <button className="login__wsbtn" onClick={() => setOpen(o => !o)}>
              <Avatar p={{ initials: tenant.initials, color: tenant.color }} size={38} sq />
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{tenant.name}</div>
                <div className="muted-3" style={{ fontSize: 12.5, fontWeight: 600 }}>projectyard.app/{tenant.slug}</div>
              </div>
              {tenant.trial && <Badge tag="b-amber">Trial</Badge>}
              <Icon name="chevD" size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--text-3)' }} />
            </button>
            {open && (
              <div className="login__wsmenu">
                {TENANTS.map(t => (
                  <button key={t.slug} className={'login__wsopt' + (t.slug === tenant.slug ? ' on' : '')} onClick={() => { setTenant(t); setOpen(false); }}>
                    <Avatar p={{ initials: t.initials, color: t.color }} size={32} sq />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.name}</div>
                      <div className="muted-3" style={{ fontSize: 12, fontWeight: 600 }}>projectyard.app/{t.slug}</div>
                    </div>
                    {t.slug === tenant.slug && <Icon name="check" size={17} style={{ color: 'var(--accent-700)' }} />}
                  </button>
                ))}
                <div className="login__wsnew"><Icon name="plus" size={15} /> Criar novo workspace</div>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
            <div className="fld">
              <label>Email</label>
              <div className="fld__box">
                <Icon name="mail" size={18} />
                <input type="email" defaultValue={ME.email} />
              </div>
            </div>
            <div className="fld">
              <div className="fld__top"><label>Palavra-passe</label><a className="fld__link" style={{ cursor: 'pointer' }} onClick={() => setRecover(true)}>Esqueceste-te?</a></div>
              <div className="fld__box">
                <Icon name="lock" size={18} />
                <input type={show ? 'text' : 'password'} defaultValue="ProjectYard#2026" />
                <button type="button" className="fld__eye" onClick={() => setShow(s => !s)}><Icon name={show ? 'eye' : 'eye'} size={18} /></button>
              </div>
              {recover && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 10, padding: '11px 13px', background: 'var(--success-soft)', borderRadius: 'var(--r-sm)', fontSize: 12.5, fontWeight: 600, color: 'var(--success)', lineHeight: 1.5 }}>
                  <Icon name="check" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>Enviámos um link de recuperação para o teu email. Verifica a caixa de entrada.</span>
                </div>
              )}
            </div>

            <label className="login__remember">
              <input type="checkbox" defaultChecked /> Manter sessão iniciada
            </label>

            <button type="submit" className="btn btn-primary login__submit">Iniciar sessão <Icon name="arrowRight" size={17} /></button>
          </form>

          <div className="login__or"><span>ou</span></div>
          <button className="btn btn-ghost login__sso" disabled={sso} onClick={() => { setSso(true); setTimeout(onEnter, 1300); }}>
            {sso ? <React.Fragment><span className="spin"></span> A redirecionar para o fornecedor de identidade…</React.Fragment> : <React.Fragment><Icon name="shield" size={17} /> Entrar com SSO da empresa</React.Fragment>}
          </button>

          <div className="login__sms"><Icon name="sms" size={16} /> Verificação por SMS ativa neste workspace</div>

          <p className="login__signup">Sem conta? <a>Criar workspace — trial de 30 dias</a></p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Login });
