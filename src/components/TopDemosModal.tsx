import { X, Target, Star, ExternalLink, Zap, Phone, Bot, Sparkles } from 'lucide-react';
import AuditModal from './AuditModal';
import { useState } from 'react';

const getSocialInfo = (url: string | undefined | null) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes('facebook.com') || l.includes('fb.me')) return { type: 'facebook', name: 'Facebook' };
  if (l.includes('instagram.com') || l.includes('instagr.am')) return { type: 'instagram', name: 'Instagram' };
  if (l.includes('tiktok.com')) return { type: 'tiktok', name: 'TikTok' };
  return null;
};

const scoreLeads = (leads: any[]) => {
  const scored = leads.map(lead => {
    let score = 0;
    let reasons: string[] = [];
    
    // Filtro estricto
    if (!lead.phone) return { lead, score: -1, reasons: ['Sin teléfono'] };
    if (lead.status === 'GANADO') return { lead, score: -1, reasons: ['Ya es cliente'] };

    const socialInfo = getSocialInfo(lead.website);
    const hasNoWeb = !lead.website;
    const hasSocialOnly = !!socialInfo;

    // Necesidad Web
    if (hasNoWeb) {
      score += 50;
      reasons.push('No tienen sitio web propio');
    } else if (hasSocialOnly) {
      score += 30;
      reasons.push(`Solo dependen de ${socialInfo.name}`);
    } else {
      score -= 20; // Ya tienen web real
    }

    // Tracción y Presupuesto (basado en reseñas)
    if (lead.user_ratings_total > 50) {
      const extra = Math.min(50, Math.floor(lead.user_ratings_total / 10)); // Hasta 50 puntos extra
      score += extra;
      reasons.push(`Negocio con alta tracción (${lead.user_ratings_total} reseñas)`);
    } else if (lead.user_ratings_total < 5) {
      score -= 30; // Muy nuevo, riesgo de poco presupuesto
    }

    // Calidad del servicio
    if (lead.rating >= 4.5) {
      score += 20;
      reasons.push(`Excelente reputación (${lead.rating} estrellas)`);
    }

    return { lead, score, reasons };
  });

  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
};

export default function TopDemosModal({ leads, onClose }: { leads: any[], onClose: () => void }) {
  const topCandidates = scoreLeads(leads);
  const [selectedAuditLead, setSelectedAuditLead] = useState<any | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});

  const generateAISuggestion = (lead: any) => {
    let strategy = "";
    const cat = (lead.category || '').toLowerCase();
    
    if (cat.includes('restaurante') || cat.includes('pizza') || cat.includes('taquería') || cat.includes('café')) {
      strategy = "📌 Debilidad: Dependen de plataformas externas (Rappi/UberEats) que cobran comisiones altas o atienden pedidos por WhatsApp de forma manual y lenta.\n\n💡 Solución propuesta: Crear una Web App ligera con 3 secciones (Inicio, Menú interactivo, Ubicación) e integrar un Asistente de WhatsApp IA para automatizar la toma de pedidos y reservas 24/7.";
    } else if (cat.includes('hotel') || cat.includes('spa') || cat.includes('clínica')) {
      strategy = "📌 Debilidad: Pagan comisiones altísimas a terceros (Booking/Doctoralia) o sufren de 'no-shows' por falta de recordatorios automáticos.\n\n💡 Solución propuesta: Landing Page premium con motor de reservas directas, pasarela de pagos y un Bot que envíe recordatorios automáticos por WhatsApp un día antes de la cita.";
    } else {
      strategy = "📌 Debilidad: Poca credibilidad institucional y pérdida de clientes frente a la competencia al no aparecer en búsquedas locales de Google.\n\n💡 Solución propuesta: Sitio web corporativo (Inicio, Servicios, Testimonios, Contacto) optimizado para SEO local, con un embudo directo a WhatsApp para agendar visitas o cotizaciones al instante.";
    }
    
    setAiSuggestions(prev => ({ ...prev, [lead.id]: strategy }));
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px'
      }}>
        <div className="glass-panel animate-fade-in" style={{ 
          width: '100%', maxWidth: '900px', maxHeight: '90vh', 
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'var(--bg-dark)', border: '1px solid rgba(234, 179, 8, 0.3)',
          boxShadow: '0 0 40px rgba(234, 179, 8, 0.1)'
        }}>
          
          {/* Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.1) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(234, 179, 8, 0.2)', padding: '12px', borderRadius: '12px', color: '#eab308' }}>
                <Target size={28} />
              </div>
              <div>
                <h2 className="h2" style={{ color: '#eab308', margin: 0 }}>Smart Match: Top Demos</h2>
                <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>Los mejores candidatos para invertir tiempo en una Demo (Basado en IA y estadística local)</p>
              </div>
            </div>
            <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-secondary)" />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {topCandidates.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No se encontraron candidatos ideales con el algoritmo actual. Intenta buscar más negocios.
              </div>
            ) : (
              topCandidates.map((candidate, idx) => {
                const { lead, reasons, score } = candidate;
                
                return (
                  <div key={idx} style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', 
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'visible',
                    flexShrink: 0
                  }}>
                    {/* Rank Badge */}
                    <div style={{ position: 'absolute', top: 0, right: 0, background: '#eab308', color: 'black', padding: '4px 16px', borderBottomLeftRadius: '16px', fontWeight: 800, fontSize: '0.9rem' }}>
                      #{idx + 1} MATCH
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{lead.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{lead.category} • {lead.address?.split(',')[0]}</p>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: 600 }}>
                          <Zap size={16} fill="#eab308" /> Score: {score}
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '24px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontWeight: 600 }}>{lead.rating}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({lead.user_ratings_total} reseñas)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <Phone size={16} color="var(--accent-secondary)" />
                        <span style={{ fontWeight: 500 }}>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Por qué es un candidato ideal:</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {reasons.map((reason, i) => (
                          <span key={i} style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => generateAISuggestion(lead)}
                        className="btn"
                        disabled={!!aiSuggestions[lead.id]}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: 'white', padding: '8px 16px', fontWeight: 600, border: 'none', opacity: aiSuggestions[lead.id] ? 0.6 : 1 }}
                      >
                        <Bot size={16} /> {aiSuggestions[lead.id] ? 'Estrategia Generada' : 'Estrategia IA'}
                      </button>
                      <button 
                        onClick={() => setSelectedAuditLead(lead)}
                        className="btn" 
                        style={{ background: 'white', color: 'black', padding: '8px 24px', fontWeight: 600, border: 'none' }}
                      >
                        Abrir Auditoría & Pitch
                      </button>
                    </div>

                    {/* AI Suggestion Box */}
                    {aiSuggestions[lead.id] && (
                      <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#c084fc', fontWeight: 600, fontSize: '0.9rem' }}>
                          <Sparkles size={16} /> Análisis del Agente IA
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {aiSuggestions[lead.id]}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selectedAuditLead && (
        <AuditModal lead={selectedAuditLead} onClose={() => setSelectedAuditLead(null)} />
      )}
    </>
  );
}
