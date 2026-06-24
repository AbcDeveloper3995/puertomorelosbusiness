export interface AuditReport {
  whatWasAnalyzed: string;
  problems: string[];
  manualTasks: string[];
  actionPlan: {
    basic: { title: string; desc: string; icon: string };
    intermediate: { title: string; desc: string; icon: string };
    advanced: { title: string; desc: string; icon: string };
  };
}

export function generateAudit(lead: any): AuditReport {
  const hasWebsite = !!lead.website;
  const rating = lead.rating || 0;
  const reviews = lead.user_ratings_total || 0;
  const category = (lead.category || 'Negocio Local').toLowerCase();
  
  // 1. What was analyzed
  let analysisDesc = `Analizamos su perfil digital en Google Maps bajo la categoría "${lead.category || 'Negocio'}". `;
  analysisDesc += `Cuenta con ${reviews} reseñas y una calificación de ${rating} estrellas. `;
  analysisDesc += hasWebsite ? `Tiene un sitio web vinculado (${lead.website}).` : `No cuenta con sitio web vinculado, lo que indica baja madurez digital.`;

  const report: AuditReport = {
    whatWasAnalyzed: analysisDesc,
    problems: [],
    manualTasks: [],
    actionPlan: {
      basic: { title: "", desc: "", icon: "" },
      intermediate: { title: "", desc: "", icon: "" },
      advanced: { title: "", desc: "", icon: "" }
    }
  };

  // 2. Problems & Manual Tasks based on heuristics
  if (!hasWebsite) {
    report.problems.push("Falta de visibilidad orgánica en Google; pérdida de clientes ante la competencia.");
    report.problems.push("Poca autoridad o confianza digital al depender exclusivamente de redes sociales o Google Maps.");
    report.manualTasks.push("Atención al cliente 1 a 1 para responder preguntas básicas (horarios, ubicación, menú/servicios).");
  } else {
    report.problems.push("Es probable que el sitio web sea solo informativo (vitrina) y no esté captando o automatizando clientes.");
  }

  if (rating > 0 && rating <= 4.1) {
    report.problems.push(`La calificación de ${rating} estrellas reduce significativamente la tasa de conversión. Los clientes prefieren opciones de 4.5+ estrellas.`);
    report.manualTasks.push("Gestión reactiva de quejas y falta de filtros previos para evitar malas reseñas públicas.");
  }

  if (reviews < 20) {
    report.problems.push("Volumen muy bajo de reseñas; no genera suficiente prueba social (Social Proof) para atraer nuevos turistas o locales.");
    report.manualTasks.push("No existe un sistema automatizado para pedir reseñas a clientes satisfechos.");
  }

  // Fallbacks if perfectly healthy but still a prospect
  if (report.problems.length === 0) {
    report.problems.push("Dependencia de procesos operativos manuales a pesar de tener buena presencia digital.");
  }
  if (report.manualTasks.length === 0) {
    report.manualTasks.push("Procesos administrativos internos, agendamiento de citas o toma de pedidos manuales.");
  }

  // 3. Action Plan based on Category
  if (category.includes('restaurante') || category.includes('food') || category.includes('comida')) {
    report.manualTasks.push("Toma de pedidos por WhatsApp, enviando fotos del menú repetitivamente.");
    report.actionPlan = {
      basic: {
        title: "Menú Digital y Optimización",
        desc: "Creación de un menú interactivo en código QR y optimización del perfil de Google Maps para subir en búsquedas locales.",
        icon: "monitor"
      },
      intermediate: {
        title: "Sistema de Pedidos Web",
        desc: "Sitio web con carrito de compras integrado directo a WhatsApp para que el cliente arme su pedido sin interacción humana.",
        icon: "zap"
      },
      advanced: {
        title: "Agente IA Recepcionista",
        desc: "Chatbot con Inteligencia Artificial que atiende WhatsApp, responde dudas del menú, toma pedidos y agenda reservas en automático.",
        icon: "bot"
      }
    };
  } else if (category.includes('hotel') || category.includes('lodging') || category.includes('alojamiento')) {
    report.manualTasks.push("Agendamiento de reservas a mano, contestando disponibilidad fecha por fecha.");
    report.actionPlan = {
      basic: {
        title: "Landing Page Informativa",
        desc: "Página web profesional con galería de fotos, amenidades y formulario de contacto directo.",
        icon: "globe"
      },
      intermediate: {
        title: "Motor de Reservas Directas",
        desc: "Sistema web para captar reservas sin pagar el 15-20% de comisión a plataformas como Booking o Airbnb.",
        icon: "calendar"
      },
      advanced: {
        title: "Conserje Virtual 24/7 (IA)",
        desc: "Agente de IA que atiende a turistas en múltiples idiomas, gestiona el check-in y vende tours o servicios extra.",
        icon: "bot"
      }
    };
  } else {
    // Generic / Beauty Salons / Retail
    report.actionPlan = {
      basic: {
        title: "Identidad Digital y Presencia",
        desc: "Creación de sitio web corporativo o catálogo online y configuración profesional de Google Mi Negocio.",
        icon: "monitor"
      },
      intermediate: {
        title: "Automatización de Citas/Leads",
        desc: "Implementación de software para agendamiento automático (Calendly/Bookings) o CRM para seguimiento de clientes.",
        icon: "calendar"
      },
      advanced: {
        title: "Ecosistema de IA y Ventas",
        desc: "Asistente de Inteligencia Artificial omnicanal (WhatsApp/Web) para calificar prospectos y cerrar ventas sin intervención humana.",
        icon: "cpu"
      }
    };
  }

  return report;
}
