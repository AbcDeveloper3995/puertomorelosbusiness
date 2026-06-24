import { X, Star, MessageSquare } from 'lucide-react';

export default function ReviewsModal({ lead, onClose }: { lead: any, onClose: () => void }) {
  if (!lead) return null;

  let reviews: any[] = [];
  try {
    if (lead.reviews_json) {
      reviews = JSON.parse(lead.reviews_json);
    }
  } catch (e) {
    console.error("Error parsing reviews", e);
  }

  // Group reviews by rating
  const groupedReviews: Record<number, any[]> = {
    5: [], 4: [], 3: [], 2: [], 1: []
  };

  reviews.forEach(r => {
    const rating = Math.floor(r.rating || 0);
    if (rating >= 1 && rating <= 5) {
      groupedReviews[rating].push(r);
    }
  });

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={14} color={i < count ? "#f59e0b" : "var(--border-color)"} fill={i < count ? "#f59e0b" : "transparent"} />
    ));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '600px', maxHeight: '90vh', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)' 
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="var(--accent-primary)" /> Reseñas Recientes
            </h2>
            <p className="text-secondary text-sm">{lead.name}</p>
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              Google no devolvió reseñas de texto recientes para este negocio.
            </div>
          ) : (
            [5, 4, 3, 2, 1].map(stars => {
              const items = groupedReviews[stars];
              if (items.length === 0) return null;

              return (
                <div key={stars}>
                  <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    {renderStars(stars)} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>({items.length})</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((r, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {r.authorAttribution?.displayName || 'Cliente Anónimo'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {r.relativePublishTimeDescription || ''}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {r.text?.text || 'Sin texto.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
