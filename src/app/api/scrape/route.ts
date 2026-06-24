import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Asegurarse de que la URL tiene http o https
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Realizar un fetch con un timeout razonable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
    
    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();

    // 1. Extraer correos usando regex básico
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const allEmails = html.match(emailRegex) || [];
    
    // Filtrar emails falsos comunes (imágenes, sentry, wix, etc.)
    const excludeList = ['sentry', 'wix', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'example'];
    const validEmails = Array.from(new Set(allEmails)).filter(email => {
      const lower = email.toLowerCase();
      return !excludeList.some(ex => lower.includes(ex));
    });

    // 2. Extraer tecnologías básicas
    const techStack = [];
    if (html.includes('wp-content') || html.includes('wp-includes')) techStack.push('WordPress');
    if (html.includes('Shopify.theme') || html.includes('cdn.shopify.com')) techStack.push('Shopify');
    if (html.includes('wix.com') || html.includes('wixsite.com')) techStack.push('Wix');
    if (html.includes('fbq(') || html.includes('fbevents.js')) techStack.push('Facebook Pixel');
    if (html.includes('gtag(') || html.includes('google-analytics.com')) techStack.push('Google Analytics');
    if (html.includes('React') || html.includes('__NEXT_DATA__')) techStack.push('React/Next.js');

    return NextResponse.json({ 
      emails: validEmails,
      technologies: techStack,
      success: true 
    });

  } catch (error: any) {
    console.error('Error in scraper:', error.message);
    return NextResponse.json({ 
      emails: [], 
      technologies: [],
      error: error.message,
      success: false 
    });
  }
}
