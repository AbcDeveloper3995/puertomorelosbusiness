import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target, AlertTriangle, MonitorX, TrendingUp } from 'lucide-react';

export default function DashboardStats({ leads }: { leads: any[] }) {
  const highPotential = leads.filter(l => l.potential_level === 'HIGH').length;
  const mediumPotential = leads.filter(l => l.potential_level === 'MEDIUM').length;
  const noWebsite = leads.filter(l => !l.website).length;
  
  const total = leads.length || 1; // prevent div by zero
  const noWebsitePercentage = Math.round((noWebsite / total) * 100) || 0;

  const pieData = [
    { name: 'Alto Potencial', value: highPotential, color: 'var(--status-high)' },
    { name: 'Potencial Medio', value: mediumPotential, color: 'var(--status-medium)' },
    { name: 'Poco Interés', value: leads.length - highPotential - mediumPotential, color: 'var(--status-low)' }
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p className="text-secondary text-sm" style={{ marginBottom: "8px", fontWeight: 500 }}>{title}</p>
        <h3 className="h1" style={{ marginBottom: "4px" }}>{value}</h3>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
      </div>
      <div style={{ background: color, padding: "12px", borderRadius: "12px", color: "white" }}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
      <StatCard 
        title="Total de Prospectos" 
        value={leads.length} 
        subtitle="en la categoría actual"
        icon={Target}
        color="linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
      />
      <StatCard 
        title="Prioridad Alta" 
        value={highPotential} 
        subtitle="Sin web, baja presencia digital"
        icon={TrendingUp}
        color="var(--status-high)"
      />
      <StatCard 
        title="Necesita Sitio Web" 
        value={`${noWebsitePercentage}%`} 
        subtitle={`${noWebsite} negocios sin web`}
        icon={MonitorX}
        color="var(--status-medium)"
      />
      
      {/* Chart Card */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", minHeight: "120px" }}>
        <p className="text-secondary text-sm" style={{ marginBottom: "8px", fontWeight: 500 }}>Desglose de Oportunidades</p>
        <div style={{ flex: 1, minHeight: "80px" }}>
          {leads.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <span className="text-xs">Sin datos para mostrar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
