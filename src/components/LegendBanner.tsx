import { Info } from 'lucide-react';

export default function LegendBanner() {
  return (
    <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(99, 102, 241, 0.05)", borderLeft: "4px solid var(--accent-primary)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-primary)" }}>
        <Info size={18} />
        <h3 className="h3" style={{ fontSize: "1rem" }}>Guía de Calificación Inteligente</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ minWidth: "12px", height: "12px", borderRadius: "50%", background: "var(--status-high)", marginTop: "4px" }}></div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--status-high)", marginBottom: "2px" }}>Alto Potencial (Verde)</p>
            <p className="text-xs text-secondary">Negocios activos <strong>sin sitio web</strong> y de menor escala. ¡Son leads ideales para ofrecerles digitalización rápida!</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ minWidth: "12px", height: "12px", borderRadius: "50%", background: "var(--status-medium)", marginTop: "4px" }}></div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--status-medium)", marginBottom: "2px" }}>Potencial Medio (Amarillo)</p>
            <p className="text-xs text-secondary">Negocios <strong>sin web</strong> pero muy establecidos (difícil de vender), o negocios <strong>con web</strong> pero muy bajas reseñas (necesitan ayuda).</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ minWidth: "12px", height: "12px", borderRadius: "50%", background: "var(--status-low)", marginTop: "4px" }}></div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--status-low)", marginBottom: "2px" }}>Poco Interés (Rojo)</p>
            <p className="text-xs text-secondary">Empresas que ya tienen un buen sitio web y muchas buenas reseñas. Suelen tener su digitalización resuelta.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
