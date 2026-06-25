import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const targetUrlLower = targetUrl.toLowerCase();
    const isSocialMedia = ['facebook.com', 'instagram.com', 'tiktok.com', 'linkedin.com', 'twitter.com', 'x.com'].some(domain => targetUrlLower.includes(domain));

    if (isSocialMedia) {
      return NextResponse.json({
        emails: [],
        technologies: ['Plataforma de Red Social'],
        socials: [targetUrl],
        meta: {
          title: 'Perfil de Red Social (Protegido)',
          description: 'Facebook, Instagram y TikTok bloquean el análisis automático de sistemas para proteger la privacidad. Por favor, dale clic al enlace desde la tabla para abrir el perfil y revisar su correo o WhatsApp manualmente.'
        },
        success: true
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
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

    // 1. Extraer correos
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const allEmails = html.match(emailRegex) || [];
    const excludeList = ['sentry', 'wix', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'example'];
    const validEmails = Array.from(new Set(allEmails)).filter(email => {
      const lower = email.toLowerCase();
      return !excludeList.some(ex => lower.includes(ex));
    });

    // 2. Extraer tecnologías
    const techStack = [];
    if (html.includes('wp-content') || html.includes('wp-includes')) techStack.push('WordPress');
    if (html.includes('Shopify.theme') || html.includes('cdn.shopify.com')) techStack.push('Shopify');
    if (html.includes('wix.com') || html.includes('wixsite.com')) techStack.push('Wix');
    if (html.includes('fbq(') || html.includes('fbevents.js')) techStack.push('Facebook Pixel');
    if (html.includes('gtag(') || html.includes('google-analytics.com')) techStack.push('Google Analytics');
    if (html.includes('React') || html.includes('__NEXT_DATA__')) techStack.push('React/Next.js');

    // 3. Extraer Redes Sociales
    const socialLinks = new Set<string>();
    const socialDomains = ['facebook.com', 'instagram.com', 'tiktok.com', 'twitter.com', 'x.com', 'linkedin.com', 'youtube.com'];
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const link = match[1];
      if (socialDomains.some(domain => link.toLowerCase().includes(domain))) {
        socialLinks.add(link);
      }
    }

    // 4. Extraer Meta Title y Description
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || 
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
                      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    return NextResponse.json({ 
      emails: validEmails,
      technologies: techStack,
      socials: Array.from(socialLinks),
      meta: {
        title,
        description
      },
      success: true 
    });

  } catch (error: any) {
    console.error('Error in scraper:', error.message);
    return NextResponse.json({ 
      emails: [], 
      technologies: [],
      socials: [],
      meta: { title: '', description: '' },
      error: error.message,
      success: false 
    });
  }
}
