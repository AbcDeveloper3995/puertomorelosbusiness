import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function MapArea({ leads }: { leads: any[] }) {
  // Center roughly on Puerto Morelos
  const center = { lat: 20.8459, lng: -86.8756 };

  const getPinColor = (level: string) => {
    switch (level) {
      case 'HIGH': return '#10b981'; // Green
      case 'MEDIUM': return '#f59e0b'; // Yellow
      case 'LOW': return '#ef4444'; // Red
      default: return '#6366f1';
    }
  };

  const getPinBorder = (level: string) => {
    switch (level) {
      case 'HIGH': return '#047857';
      case 'MEDIUM': return '#b45309';
      case 'LOW': return '#b91c1c';
      default: return '#4338ca';
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey || apiKey === 'INSERT_YOUR_API_KEY_HERE') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(0,0,0,0.4)' }}>
        <p style={{ color: 'var(--text-muted)' }}>La clave API del Mapa no está configurada en .env.local</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="puerto-morelos-map-id" // Required for AdvancedMarker
        style={{ width: '100%', height: '100%' }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {leads.map((lead, index) => {
          if (!lead.lat || !lead.lng) return null;
          return (
            <AdvancedMarker 
              key={lead.place_id || index} 
              position={{ lat: lead.lat, lng: lead.lng }}
              title={lead.name}
            >
              <Pin 
                background={getPinColor(lead.potential_level)} 
                borderColor={getPinBorder(lead.potential_level)} 
                glyphColor="#fff" 
                scale={lead.potential_level === 'HIGH' ? 1.2 : 1}
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
