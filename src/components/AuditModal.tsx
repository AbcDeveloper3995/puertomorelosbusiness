import { X, AlertCircle, Clock, MessageSquare, Zap, Monitor, Calendar, Globe, Bot, Phone, Cpu, Activity } from 'lucide-react';
import { generateAudit } from '@/lib/audit';

const IconMap: Record<string, any> = {
  monitor: Monitor,
  calendar: Calendar,
  globe: Globe,
  bot: Bot,
  zap: Zap,
  phone: Phone,
  cpu: Cpu,
  activity: Activity
};

export default function AuditModal({ lead, onClose }: { lead: any, onClose: () => void }) {
  if (!lead) return null;

  const audit = generateAudit(lead);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '700px', maxHeight: '90vh', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)' 
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="h2">{lead.name}</h2>
            <p className="text-secondary text-sm">Reporte de Auditoría Digital</p>
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section: Problems */}
          <div>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-low)', marginBottom: '12px' }}>
              <AlertCircle size={18} /> Problemas Detectados
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', borderLeft: '2px solid var(--status-low)' }}>
              {audit.problems.map((p, i) => (
                <li key={i} style={{ marginBottom: '8px', fontSize: '0.875rem' }}>• {p}</li>
              ))}
            </ul>
          </div>

          {/* Section: Manual Tasks */}
          <div>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-medium)', marginBottom: '12px' }}>
              <Clock size={18} /> Procesos Manuales
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', borderLeft: '2px solid var(--status-medium)' }}>
              {audit.manualTasks.map((t, i) => (
                <li key={i} style={{ marginBottom: '8px', fontSize: '0.875rem' }}>• {t}</li>
              ))}
            </ul>
          </div>

          {/* Section: Review Complaints */}
          <div>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px' }}>
              <MessageSquare size={18} /> Quejas de Clientes (Reseñas)
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)' }}>
              {audit.reviewComplaints.map((c, i) => (
                <li key={i} style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>• {c}</li>
              ))}
            </ul>
          </div>

          {/* Section: Solutions Pitch */}
          <div style={{ marginTop: '8px' }}>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <Zap size={18} /> Soluciones Propuestas (Pitch)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {audit.solutions.map((s, i) => {
                const IconComponent = IconMap[s.icon] || Zap;
                return (
                  <div key={i} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px' }}>
                    <div style={{ background: 'var(--accent-primary)', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.95rem' }}>{s.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
