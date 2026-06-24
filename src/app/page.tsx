"use client";

import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import LeadsTable from "@/components/LeadsTable";
import MapArea from "@/components/MapArea";
import LegendBanner from "@/components/LegendBanner";
import { Search, MapPin, BarChart3, List, Download } from "lucide-react";
import Papa from "papaparse";

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Restaurantes");
  const [view, setView] = useState<"map" | "table">("map");

  const fetchLeads = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?category=${encodeURIComponent(category)}${forceRefresh ? '&refresh=true' : ''}`);
      const data = await res.json();
      if (data.data) {
        setLeads(data.data);
      } else if (data.error) {
        alert("Error al buscar prospectos: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Fallo al buscar prospectos");
    }
    setLoading(false);
  };

  const updateLead = (placeId: string, updatedData: any) => {
    setLeads(currentLeads => currentLeads.map(l => l.place_id === placeId ? updatedData : l));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const exportCSV = () => {
    if (leads.length === 0) return;
    const csv = Papa.unparse(leads.map(l => ({
      Name: l.name,
      Category: l.category,
      Potential: l.potential_level,
      Phone: l.phone,
      Address: l.address,
      Rating: l.rating,
      Reviews: l.user_ratings_total,
      Website: l.website,
      GoogleMapsURL: l.google_maps_url
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${category}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: "280px", margin: "16px", padding: "24px", display: "flex", flexDirection: "column", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={20} color="white" />
          </div>
          <h1 className="h3" style={{ lineHeight: 1.2 }}>Puerto Morelos<br/><span className="text-secondary text-sm">Inteligencia de Negocios</span></h1>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label className="text-xs text-secondary" style={{ display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Categoría Objetivo</label>
          <select 
            className="input-field" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%239ca3af\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPositionX: "96%", backgroundPositionY: "center" }}
          >
            <option value="Restaurantes">Restaurantes</option>
            <option value="Hoteles">Hoteles Pequeños</option>
            <option value="Tiendas">Tiendas Locales</option>
            <option value="Salones de belleza">Salones de Belleza</option>
            <option value="Clínicas">Clínicas y Salud</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => fetchLeads(true)} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Escaneando..." : <><Search size={16} /> Escanear Área</>}
        </button>

        <div style={{ marginTop: "auto" }}>
          <button className="btn btn-outline" onClick={exportCSV} style={{ width: "100%", justifyContent: "center" }}>
            <Download size={16} /> Exportar a CSV
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "16px 16px 16px 0", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        
        {/* Legend Banner */}
        <LegendBanner />

        {/* Top Header / Stats */}
        <section>
          <DashboardStats leads={leads} />
        </section>

        {/* View Toggle & Content Area */}
        <section className="glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px", position: "relative", minHeight: "400px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 className="h3">Oportunidades (Leads)</h2>
            <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "8px" }}>
              <button 
                className="btn" 
                style={{ padding: "6px 12px", background: view === "map" ? "var(--accent-primary)" : "transparent", color: view === "map" ? "white" : "var(--text-secondary)" }}
                onClick={() => setView("map")}
              >
                <MapPin size={16} /> Mapa
              </button>
              <button 
                className="btn" 
                style={{ padding: "6px 12px", background: view === "table" ? "var(--accent-primary)" : "transparent", color: view === "table" ? "white" : "var(--text-secondary)" }}
                onClick={() => setView("table")}
              >
                <List size={16} /> Tabla
              </button>
            </div>
          </div>

          <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.3)" }}>
            {view === "map" ? (
              <MapArea leads={leads} />
            ) : (
              <LeadsTable leads={leads} onUpdateLead={updateLead} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
