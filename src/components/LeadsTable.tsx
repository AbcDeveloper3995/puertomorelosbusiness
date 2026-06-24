import { useState } from 'react';
import { ExternalLink, Star, Search } from 'lucide-react';
import AuditModal from './AuditModal';

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filterPotential, setFilterPotential] = useState<string>('ALL');
  const [filterPhone, setFilterPhone] = useState<string>('ALL');
  const [filterWebsite, setFilterWebsite] = useState<string>('ALL');

  if (leads.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        No se encontraron prospectos. Ejecuta un escaneo para descubrir negocios.
      </div>
    );
  }

  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'HIGH': return 'badge badge-high';
      case 'MEDIUM': return 'badge badge-medium';
      case 'LOW': return 'badge badge-low';
      default: return 'badge badge-low';
    }
  };

  const filteredLeads = leads.filter(lead => {
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
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Reseñas</th>
            <th style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No hay resultados con estos filtros.
              </td>
            </tr>
          ) : (
            filteredLeads.map((lead, idx) => (
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
              <td style={{ padding: "12px 16px", color: lead.website ? "var(--accent-primary)" : "var(--status-low)" }}>
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Visitar <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Sin Sitio Web</span>
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
                <div style={{ display: 'flex', gap: '8px' }}>
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
            ))
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
