export interface AuditReport {
  problems: string[];
  manualTasks: string[];
  reviewComplaints: string[];
  solutions: { title: string; desc: string; icon: string }[];
}

export function generateAudit(lead: any): AuditReport {
  const report: AuditReport = {
    problems: [],
    manualTasks: [],
    reviewComplaints: [],
    solutions: []
  };

  const hasWebsite = !!lead.website;
  const rating = lead.rating || 0;
  const category = (lead.category || '').toLowerCase();
  
  // 1. Analyze Website Absence
  if (!hasWebsite) {
    report.problems.push("Falta de visibilidad online (Cero captación de clientes por Google Search).");
    report.problems.push("Pérdida de confianza ante turistas o nuevos clientes que buscan validar el negocio.");
    
    if (category.includes('restaurante') || category.includes('food')) {
      report.manualTasks.push("Toma de pedidos por teléfono o WhatsApp de forma manual.");
      report.manualTasks.push("Actualización de menú en PDF o fotos físicas (difícil de mantener).");
      report.solutions.push({
        title: "Menú Digital Interactivo",
        desc: "Sitio web rápido con menú en código QR, autogestionable y sistema de pedidos a WhatsApp.",
        icon: "monitor"
      });
    } else if (category.includes('hotel') || category.includes('lodging')) {
      report.manualTasks.push("Gestión de reservas a mano, propenso a overbooking o errores.");
      report.solutions.push({
        title: "Web de Reservas Directas",
        desc: "Página web para captar reservas sin pagar el 15% de comisión a OTAs (Booking, Expedia).",
        icon: "calendar"
      });
    } else {
      report.manualTasks.push("Respuestas repetitivas a preguntas sobre horarios, ubicación y precios.");
      report.solutions.push({
        title: "Sitio Web Corporativo y SEO Local",
        desc: "Un hub digital que atraiga tráfico local y responda preguntas 24/7.",
        icon: "globe"
      });
    }
  } else {
    // Has website, but might have other issues
    report.problems.push("Posible web desactualizada o sin automatizaciones conectadas.");
    report.solutions.push({
      title: "Auditoría de Conversión Web",
      desc: "Análisis del embudo actual del sitio para optimizar la captación de leads.",
      icon: "activity"
    });
  }

  // 2. Analyze Ratings & Inferred Workflow
  if (rating > 0 && rating < 4.0) {
    report.problems.push(`Calificación baja (${rating} estrellas) que aleja al 40% de los clientes potenciales.`);
    report.manualTasks.push("Manejo deficiente de atención al cliente en horas pico.");
    report.solutions.push({
      title: "Agente de IA para Atención al Cliente",
      desc: "Un chatbot entrenado con los datos del negocio para atender WhatsApp al instante y reducir fricciones.",
      icon: "bot"
    });
  }

  // 3. Extract Complaints from Reviews (if available)
  if (lead.reviews_json) {
    try {
      const reviews = JSON.parse(lead.reviews_json);
      const allText = reviews.map((r: any) => r.text?.text?.toLowerCase() || '').join(' ');
      
      const keywords = [
        { word: "espera", complaint: "Tiempos de espera largos reportados por clientes." },
        { word: "lento", complaint: "Servicio lento, posible falta de personal o desorganización." },
        { word: "sucio", complaint: "Problemas de higiene reportados." },
        { word: "caro", complaint: "Percepción de precios altos sin valor justificado." },
        { word: "atención", complaint: "Mala atención al cliente o personal grosero." },
        { word: "teléfono", complaint: "Nadie contesta el teléfono o es difícil comunicarse." }
      ];

      keywords.forEach(kw => {
        if (allText.includes(kw.word)) {
          report.reviewComplaints.push(kw.complaint);
          
          // Suggest solution based on complaint
          if (kw.word === "espera" || kw.word === "lento") {
            const solExists = report.solutions.find(s => s.title.includes("Agente") || s.title.includes("Turnos"));
            if (!solExists) {
              report.solutions.push({
                title: "Sistema de Pedidos / Turnos Automatizado",
                desc: "Plataforma para que el cliente pida desde su mesa o agende antes de llegar, reduciendo la fricción.",
                icon: "zap"
              });
            }
          }
          if (kw.word === "teléfono") {
            report.solutions.push({
              title: "Asistente de Voz IA (Recepcionista)",
              desc: "Un agente telefónico de IA que contesta llamadas 24/7 y agenda citas.",
              icon: "phone"
            });
          }
        }
      });

    } catch (e) {
      console.error("Error parsing reviews", e);
    }
  }

  // Fallbacks if lists are empty
  if (report.reviewComplaints.length === 0) {
    report.reviewComplaints.push("No hay quejas evidentes en las reseñas recientes o no hay suficientes reseñas.");
  }
  
  if (report.manualTasks.length === 0) {
    report.manualTasks.push("Posibles tareas administrativas en papel o Excel (Facturación, inventario).");
  }

  if (report.solutions.length === 0) {
    report.solutions.push({
      title: "Consultoría en Transformación Digital",
      desc: "Implementación de software CRM o ERP para centralizar las operaciones.",
      icon: "cpu"
    });
  }

  return report;
}
