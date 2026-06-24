import { useState, useEffect } from 'react';
import { ExternalLink, Star, Search, Database } from 'lucide-react';
import AuditModal from './AuditModal';

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [localLeads, setLocalLeads] = useState<any[]>(leads);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filterPotential, setFilterPotential] = useState<string>('ALL');
  const [filterPhone, setFilterPhone] = useState<string>('ALL');
  const [filterWebsite, setFilterWebsite] = useState<string>('ALL');

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const handleNotesChange = async (id: number, newNotes: string) => {
    setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, notes: newNotes } : l));
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: newNotes })
    });
  };

  const handleScrape = async (lead: any) => {
    setLocalLeads(prev => prev.map(l => l.id === lead.id ? { ...l, isScraping: true } : l));
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: lead.website })
      });
      const data = await res.json();
      const techStr = data.technologies?.length > 0 ? `Tech: ${data.technologies.join(', ')}` : 'Tech: N/A';
      const emailStr = data.emails?.length > 0 ? `Emails: ${data.emails.join(', ')}` : 'Emails: N/A';
      const resultNotes = `${techStr} | ${emailStr}`;
      
      const newNotes = lead.notes ? `${lead.notes} | ${resultNotes}` : resultNotes;
      await handleNotesChange(lead.id, newNotes);
    } catch (e) {
      console.error(e);
    } finally {
      setLocalLeads(prev => prev.map(l => l.id === lead.id ? { ...l, isScraping: false } : l));
    }
  };

  if (localLeads.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        No se encontraron prospectos. Ejecuta un escaneo para descubrir negocios.
      </div>
    );
  }

  const getSocialInfo = (url: string | undefined | null) => {
    if (!url) return null;
    const l = url.toLowerCase();
    if (l.includes('facebook.com') || l.includes('fb.me')) return { type: 'facebook', name: 'Facebook' };
    if (l.includes('instagram.com') || l.includes('instagr.am')) return { type: 'instagram', name: 'Instagram' };
    if (l.includes('tiktok.com')) return { type: 'tiktok', name: 'TikTok' };
    return null;
  };

  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'HIGH': return 'badge badge-high';
      case 'MEDIUM': return 'badge badge-medium';
      case 'LOW': return 'badge badge-low';
      default: return 'badge badge-low';
    }
  };

  const filteredLeads = localLeads.filter(lead => {
    if (filterPotential !== 'ALL' && lead.potential_level !== filterPotential) return false;
    
    if (filterPhone === 'YES' && !lead.phone) return false;
    if (filterPhone === 'NO' && lead.phone) return false;

    if (filterWebsite === 'YES' && !lead.website) return false;
    if (filterWebsite === 'NO' && lead.website) return false;

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Filters Bar */}
      <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-color)", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Potencial:</span>
          <select 
            value={filterPotential} 
            onChange={(e) => setFilterPotential(e.target.value)}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem" }}
          >
            <option value="ALL">Todos</option>
            <option value="HIGH">Alto (Verde)</option>
            <option value="MEDIUM">Medio (Amarillo)</option>
            <option value="LOW">Bajo (Rojo)</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Teléfono:</span>
          <select 
            value={filterPhone} 
            onChange={(e) => setFilterPhone(e.target.value)}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem" }}
          >
            <option value="ALL">Todos</option>
            <option value="YES">Con Teléfono</option>
            <option value="NO">Sin Teléfono</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Sitio Web:</span>
          <select 
            value={filterWebsite} 
            onChange={(e) => setFilterWebsite(e.target.value)}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem" }}
          >
            <option value="ALL">Todos</option>
            <option value="YES">Con Web</option>
            <option value="NO">Sin Web</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto", flex: 1 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
        <thead style={{ background: "rgba(0,0,0,0.4)", position: "sticky", top: 0, zIndex: 10 }}>
          <tr>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Nombre / Dirección</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Potencial</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Contacto</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Sitio Web</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Red Social</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Reseñas</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>CRM</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No hay resultados con estos filtros.
              </td>
            </tr>
          ) : (
            filteredLeads.map((lead, idx) => {
              const socialInfo = getSocialInfo(lead.website);
              const hasRealWebsite = lead.website && !socialInfo;

              return (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ fontWeight: 500 }}>{lead.name}</div>
                <div className="text-xs text-muted" style={{ opacity: 0.7, marginTop: "4px" }}>{lead.address?.split(',')[0]}</div>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span className={getBadgeClass(lead.potential_level)}>{lead.potential_level}</span>
              </td>
              <td style={{ padding: "12px 16px", color: "var(--text-primary)" }}>
                {lead.phone ? (
                  <span style={{ fontSize: "0.875rem" }}>{lead.phone}</span>
                ) : (
                  <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>Sin teléfono</span>
                )}
              </td>
              <td style={{ padding: "12px 16px", color: hasRealWebsite ? "var(--accent-primary)" : "var(--status-low)" }}>
                {hasRealWebsite ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Visitar <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Sin Sitio Web</span>
                )}
              </td>
              <td style={{ padding: "12px 16px" }}>
                {socialInfo ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: socialInfo.type === 'facebook' ? '#1877F2' : socialInfo.type === 'instagram' ? '#E1306C' : 'var(--text-primary)' }}>
                    {socialInfo.type === 'facebook' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-10 4.5-10 10 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.66c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7a10 10 0 0 0 8.44-9.9c0-5.5-4.5-10-10-10z"/></svg>
                    )}
                    {socialInfo.type === 'instagram' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                    )}
                    {socialInfo.type === 'tiktok' && (
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                    )}
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{socialInfo.name}</span>
                  </a>
                ) : (
                  <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>-</span>
                )}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <span>{lead.rating || 'N/A'}</span>
                  <span className="text-xs text-secondary">({lead.user_ratings_total || 0})</span>
                </div>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <select 
                    value={lead.status || 'NO_CONTACTADO'} 
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}
                  >
                    <option value="NO_CONTACTADO">Sin contactar</option>
                    <option value="CONTACTADO">En contacto</option>
                    <option value="REUNION">Reunión</option>
                    <option value="GANADO">Cerrado</option>
                    <option value="PERDIDO">Rechazado</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Notas..."
                    defaultValue={lead.notes || ''}
                    onBlur={(e) => {
                      if(e.target.value !== (lead.notes || '')) handleNotesChange(lead.id, e.target.value);
                    }}
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", width: "100%", outline: 'none' }}
                  />
                </div>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {hasRealWebsite && (
                    <button 
                      onClick={() => handleScrape(lead)}
                      disabled={lead.isScraping}
                      className="btn btn-outline"
                      style={{ padding: "4px 8px", fontSize: "0.75rem", display: 'flex', alignItems: 'center', gap: '4px', opacity: lead.isScraping ? 0.5 : 1 }}
                    >
                      <Database size={12} /> {lead.isScraping ? 'Analizando...' : 'Analizar Web'}
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedLead(lead)}
                    className="btn btn-primary"
                    style={{ padding: "4px 8px", fontSize: "0.75rem", background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", border: 'none' }}
                  >
                    <Search size={12} style={{ marginRight: '4px' }} /> Auditoría
                  </button>
                  <a 
                    href={lead.google_maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                  >
                    Ver Mapa
                  </a>
                </div>
              </td>
            </tr>
              );
            })
          )}
        </tbody>
      </table>
      </div>
      
      {selectedLead && (
        <AuditModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
