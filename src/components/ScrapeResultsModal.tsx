import { X, Database, Mail, Code, Share2, Info, AlertTriangle } from 'lucide-react';

export default function ScrapeResultsModal({ results, leadName, onClose }: { results: any, leadName: string, onClose: () => void }) {
  if (!results) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '600px', maxHeight: '90vh', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)',
      }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
              <Database size={24} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 className="h3" style={{ margin: 0 }}>Resultados del Análisis Web</h2>
              <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>Extracción pública para: <strong style={{color: 'white'}}>{leadName}</strong></p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {results.error ? (
             <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
               <AlertTriangle size={20} color="#ef4444" />
               <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>No se pudo analizar el sitio. Es posible que tengan bloqueos de seguridad anti-bots o la página ya no exista.</p>
             </div>
          ) : (
            <>
              {/* Meta Info */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white', marginBottom: '12px' }}>
                  <Info size={16} color="var(--accent-secondary)" /> Información Principal (SEO)
                </h4>
                {results.meta?.title ? (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Título de la página</span>
                    <p style={{ fontSize: '0.9rem' }}>{results.meta.title}</p>
                  </div>
                ) : null}
                {results.meta?.description ? (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Descripción</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{results.meta.description}</p>
                  </div>
                ) : null}
                {!results.meta?.title && !results.meta?.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se encontraron etiquetas SEO básicas.</p>
                )}
              </div>

              {/* Emails */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white', marginBottom: '12px' }}>
                  <Mail size={16} color="#10b981" /> Correos Electrónicos
                </h4>
                {results.emails && results.emails.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.emails.map((email: string, i: number) => (
                      <li key={i} style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>{email}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se encontraron correos públicos en la página principal.</p>
                )}
              </div>

              {/* Tech Stack */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white', marginBottom: '12px' }}>
                  <Code size={16} color="#3b82f6" /> Tecnologías Detectadas
                </h4>
                {results.technologies && results.technologies.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {results.technologies.map((tech: string, i: number) => (
                      <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se detectaron CMS o Pixeles conocidos.</p>
                )}
              </div>

              {/* Socials */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white', marginBottom: '12px' }}>
                  <Share2 size={16} color="#f59e0b" /> Redes Sociales Vinculadas
                </h4>
                {results.socials && results.socials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.socials.map((link: string, i: number) => (
                      <li key={i} style={{ fontSize: '0.85rem' }}>
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se encontraron enlaces a redes sociales.</p>
                )}
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
}
