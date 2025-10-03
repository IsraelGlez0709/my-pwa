import React from "react";
import { FiCheckCircle, FiDollarSign, FiZap } from 'react-icons/fi';
import { canPromptInstall, promptInstall, isStandalone } from './install';

export default function App() {
  const [canInstall, setCanInstall] = React.useState(false);
  const [installed, setInstalled] = React.useState(isStandalone());
  const [installResult, setInstallResult] = React.useState<null | 'accepted' | 'dismissed'>(null);

  React.useEffect(() => {
    const onCanInstall = () => setCanInstall(true);
    const onInstalled = () => {
      setInstalled(true);
      setCanInstall(false);
    };

    document.addEventListener('pwa:can-install', onCanInstall);
    document.addEventListener('pwa:installed', onInstalled);

    if (canPromptInstall()) setCanInstall(true);

    return () => {
      document.removeEventListener('pwa:can-install', onCanInstall);
      document.removeEventListener('pwa:installed', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    try {
      const outcome = await promptInstall();
      setInstallResult(outcome);
      if (outcome === 'accepted') setCanInstall(false);
    } catch {
      setInstallResult('dismissed');
    }
  };

  return (
    <>
      <section className="hero section">
        <div className="container hero__inner">
          <div>
            <span className="badge">SaaS para citas y pagos</span>
            <h1>
              Agenda más, cobra fácil. <br />
              Todo desde <strong>Bookify Pro</strong>.
            </h1>
            <p>
              La landing PWA para tu sistema de reservas con pagos integrados.
              Rápida, instalable y lista para convertir.
            </p>

            <div className="hero__buttons">
              <a href="#cta" className="btn btn--primary btn--wide">
                Probar Bookify Pro
              </a>

              {!installed && canInstall && (
                <button onClick={handleInstall} className="btn btn--ghost btn--wide" aria-label="Instalar PWA">
                  Instalar PWA
                </button>
              )}
            </div>

            {installResult && (
              <p className="muted" style={{ marginTop: 10 }}>
                {installResult === 'accepted'
                  ? 'Instalación aceptada. ¡Gracias!'
                  : 'Instalación cancelada o no disponible.'}
              </p>
            )}
          </div>

          <div className="hero__card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="hero__logo">
                <img src="/logo.png" alt="Bookify Pro" />
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>BookifyPro</div>
                <div className="muted" style={{ fontSize: '.9rem' }}>
                  PWA instalable
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14 }} className="muted">
              • Instálala en tu pantalla de inicio • Funciona con mala conexión
              • Recibe pagos y confirma citas en minutos
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section section--light">
        <div className="container">
          <div className="center" style={{ marginBottom: 26 }}>
            <h2 style={{ margin: '0 0 8px' }}>Características</h2>
            <p className="muted">
              Todo lo que necesitas para operar sin fricciones
            </p>
          </div>

          <div className="features">
            <article className="card">
              <div className="icon"><FiCheckCircle /></div>
              <h3>Reservas en minutos</h3>
              <p className="muted">
                Calendario moderno y recordatorios automáticos por email/WhatsApp.
              </p>
            </article>

            <article className="card">
              <div className="icon"><FiDollarSign /></div>
              <h3>Pagos integrados</h3>
              <p className="muted">
                Cobros con tarjeta y efectivo; reportes claros y conciliación simple.
              </p>
            </article>

            <article className="card">
              <div className="icon"><FiZap /></div>
              <h3>PWA ultra rápida</h3>
              <p className="muted">
                Instalable, offline-friendly y con apertura instantánea gracias al App Shell.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 26 }}>
            <h2 style={{ margin: '0 0 8px' }}>Precios</h2>
            <p className="muted">Planes simples que escalan contigo</p>
          </div>

          <div className="pricing">
            <div className="price">
              <div className="price__title">Básico</div>
              <div className="price__value">$0</div>
              <ul className="muted">
                <li>Landing y agenda personal</li>
                <li>Confirmaciones por email</li>
                <li>Soporte comunitario</li>
              </ul>
              <button className="btn btn--dark">Empezar</button>
            </div>

            <div className="price price--pro">
              <span className="ribbon">Popular</span>
              <div className="price__title">Pro</div>
              <div className="price__value">$14/mes</div>
              <ul className="muted">
                <li>Pagos con tarjeta</li>
                <li>Recordatorios SMS/WhatsApp</li>
                <li>Reportes y exportación</li>
              </ul>
              <a href="#cta" className="btn btn--primary">Elegir Pro</a>
            </div>

            <div className="price">
              <div className="price__title">Empresarial</div>
              <div className="price__value">A medida</div>
              <ul className="muted">
                <li>Multi-sucursal y roles</li>
                <li>SLAs y soporte dedicado</li>
                <li>Integraciones avanzadas</li>
              </ul>
              <button className="btn btn--dark">Contactar</button>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="section section--light">
        <div className="container">
          <div className="cta center">
            <h3>¿Listo para agendar y cobrar mejor?</h3>
            <p className="muted">
              Instala la PWA o pruébala directo en tu navegador.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn btn--primary btn--wide" href="#pricing">
                Probar Bookify Pro
              </a>

              {!installed && canInstall && (
                <button onClick={handleInstall} className="btn btn--dark btn--wide" aria-label="Instalar PWA">
                  Instalar PWA
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container center muted">
          © {new Date().getFullYear()} Bookify Pro
        </div>
      </footer>
    </>
  );
}
