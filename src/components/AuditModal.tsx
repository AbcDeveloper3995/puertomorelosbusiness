import { X, AlertCircle, Clock, Zap, Monitor, Calendar, Globe, Bot, Cpu, TrendingUp, Info, MessageCircle, Copy, FileText } from 'lucide-react';
import { generateAudit } from '@/lib/audit';

const IconMap: Record<string, any> = {
  monitor: Monitor,
  calendar: Calendar,
  globe: Globe,
  bot: Bot,
  zap: Zap,
  cpu: Cpu
};

export default function AuditModal({ lead, onClose }: { lead: any, onClose: () => void }) {
  if (!lead) return null;

  const audit = generateAudit(lead);

  const hasSocialOnly = lead.website && (lead.website.includes('facebook') || lead.website.includes('instagram') || lead.website.includes('tiktok'));
  const hasNoWeb = !lead.website;

  let pitchMessage = `Hola equipo de ${lead.name}. Espero que estén teniendo un excelente día.\n\n`;
  if (hasNoWeb) {
    pitchMessage += `Vi que tienen excelentes reseñas${lead.rating ? ` (${lead.rating} estrellas)` : ''} en Google Maps, pero noté que no cuentan con una página web propia. Estoy ayudando a negocios de la zona a captar más clientes en automático y me encantaría proponerles una solución.\n\n¿Tienen 5 minutos esta semana para platicar?`;
  } else if (hasSocialOnly) {
    pitchMessage += `Me encanta lo que hacen. Vi que los buscan mucho, pero al depender solo de redes sociales están perdiendo clientes que buscan en Google o prefieren agendar directamente en un sitio web.\n\nEstoy ayudando a negocios como el suyo a profesionalizar su presencia digital. ¿Podemos platicar unos minutos esta semana?`;
  } else {
    pitchMessage += `Estuve revisando su sitio web y noté que tienen un gran potencial para captar aún más clientes si optimizamos un par de detalles y automatizamos la atención.\n\n¿Tendrían 5 minutos esta semana para mostrarles unas ideas sin compromiso?`;
  }

  const rawPhone = lead.phone ? lead.phone.replace(/\D/g, '') : '';
  const whatsappLink = rawPhone ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(pitchMessage)}` : null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-audit, #printable-audit * {
            visibility: visible;
          }
          #printable-audit {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            max-height: none !important;
            overflow: visible !important;
            background: #111 !important;
            color: white !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-overflow-visible {
            overflow: visible !important;
            max-height: none !important;
          }
        }
      `}</style>
      <div id="printable-audit" className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '800px', maxHeight: '90vh', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)' 
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="h2">{lead.name}</h2>
            <p className="text-secondary text-sm">Auditoría Estratégica & Plan de Acción</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }} className="no-print">
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'black', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              <FileText size={16} /> Generar PDF
            </button>
            <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-secondary)" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="print-overflow-visible" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section: Analysis Source */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px' }}>
            <Info size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>¿Qué analizamos para detectar esto?</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{audit.whatWasAnalyzed}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Section: Problems */}
            <div>
              <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-low)', marginBottom: '12px' }}>
                <AlertCircle size={18} /> Problemas Detectados
              </h3>
              <ul style={{ listStyle: 'none', paddingLeft: '12px', borderLeft: '2px solid var(--status-low)' }}>
                {audit.problems.map((p, i) => (
                  <li key={i} style={{ marginBottom: '12px', fontSize: '0.875rem', lineHeight: 1.4 }}>• {p}</li>
                ))}
              </ul>
            </div>

            {/* Section: Manual Tasks */}
            <div>
              <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-medium)', marginBottom: '12px' }}>
                <Clock size={18} /> Procesos que hacen manual
              </h3>
              <ul style={{ listStyle: 'none', paddingLeft: '12px', borderLeft: '2px solid var(--status-medium)' }}>
                {audit.manualTasks.map((t, i) => (
                  <li key={i} style={{ marginBottom: '12px', fontSize: '0.875rem', lineHeight: 1.4 }}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Scalable Action Plan */}
          <div style={{ marginTop: '8px' }}>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <TrendingUp size={18} /> Solución Digital (Plan de Escalabilidad)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', left: '20px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
              
              {Object.entries(audit.actionPlan).map(([level, step], index) => {
                const IconComponent = IconMap[step.icon] || Zap;
                const badges: Record<string, { color: string, label: string }> = {
                  basic: { color: 'var(--status-high)', label: 'Fase 1: Básico' },
                  intermediate: { color: 'var(--accent-secondary)', label: 'Fase 2: Intermedio' },
                  advanced: { color: 'var(--accent-primary)', label: 'Fase 3: IA Avanzada' }
                };
                const badge = badges[level];

                return (
                  <div key={level} style={{ display: 'flex', gap: '16px', zIndex: 1, position: 'relative' }}>
                    <div style={{ background: 'var(--bg-dark)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color, border: `2px solid ${badge.color}`, flexShrink: 0 }}>
                      <IconComponent size={20} />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{step.title}</h4>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: badge.color, background: `${badge.color}22`, padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{badge.label}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Auto-generated Pitch */}
          <div style={{ marginTop: '8px', background: 'rgba(37, 211, 102, 0.05)', border: '1px solid rgba(37, 211, 102, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', margin: 0 }}>
                <MessageCircle size={18} /> Pitch de Venta Sugerido
              </h3>
              {whatsappLink ? (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#25D366', color: 'black', padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, border: 'none', textDecoration: 'none' }}>
                  <MessageCircle size={14} color="black" /> Enviar por WhatsApp
                </a>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--status-low)', opacity: 0.8 }}>Sin teléfono registrado</span>
              )}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {pitchMessage}
              </p>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => navigator.clipboard.writeText(pitchMessage)} 
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Copy size={14} /> Copiar texto
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
