import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article } = await supabase
      .from("articles")
      .select("title, excerpt, category, author_name, featured_image, published_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!article) {
      return new Response("Article not found", { status: 404 });
    }

    const title = article.title || "Cyberom";
    const excerpt = article.excerpt || "";
    const category = article.category || "";
    const author = article.author_name || "Cyberom";
    const date = article.published_at
      ? new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";
    const bgImage = article.featured_image || "";

    // Truncate title & excerpt for display
    const displayTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
    const displayExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + "..." : excerpt;

    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#2d2418"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c8a97e"/>
      <stop offset="100%" stop-color="#e8d5b5"/>
    </linearGradient>
    <clipPath id="imgClip">
      <rect x="750" y="80" width="380" height="470" rx="24"/>
    </clipPath>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle pattern -->
  <circle cx="1100" cy="100" r="300" fill="#c8a97e" opacity="0.03"/>
  <circle cx="100" cy="530" r="200" fill="#c8a97e" opacity="0.03"/>
  
  <!-- Featured image area -->
  ${bgImage ? `
  <g clip-path="url(#imgClip)">
    <image href="${bgImage}" x="750" y="80" width="380" height="470" preserveAspectRatio="xMidYMid slice"/>
    <rect x="750" y="80" width="380" height="470" fill="rgba(0,0,0,0.15)"/>
  </g>
  <rect x="750" y="80" width="380" height="470" rx="24" fill="none" stroke="#c8a97e" stroke-width="1" opacity="0.3"/>
  ` : `
  <rect x="750" y="80" width="380" height="470" rx="24" fill="#2a2318" stroke="#c8a97e" stroke-width="1" opacity="0.3"/>
  <text x="940" y="320" font-family="Georgia,serif" font-size="48" fill="#c8a97e" opacity="0.2" text-anchor="middle">ॐ</text>
  `}
  
  <!-- Top bar -->
  <rect x="70" y="80" width="6" height="60" rx="3" fill="url(#accent)"/>
  <text x="90" y="115" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#c8a97e" letter-spacing="3" text-transform="uppercase">CYBEROM</text>
  
  <!-- Category badge -->
  <rect x="70" y="160" width="${category.length * 11 + 32}" height="36" rx="18" fill="#c8a97e" opacity="0.15"/>
  <text x="86" y="183" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#c8a97e">${escapeXml(category.toUpperCase())}</text>
  
  <!-- Title -->
  <text x="70" y="250" font-family="Georgia,serif" font-size="42" font-weight="bold" fill="#f5f0eb" width="640">
    ${wrapText(displayTitle, 28).map((line, i) => `<tspan x="70" dy="${i === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`).join("")}
  </text>
  
  <!-- Excerpt -->
  <text x="70" y="${250 + wrapText(displayTitle, 28).length * 52 + 30}" font-family="Arial,sans-serif" font-size="18" fill="#a89882" width="640">
    ${wrapText(displayExcerpt, 45).slice(0, 2).map((line, i) => `<tspan x="70" dy="${i === 0 ? 0 : 26}">${escapeXml(line)}</tspan>`).join("")}
  </text>
  
  <!-- Bottom bar: author & date -->
  <line x1="70" y1="530" x2="660" y2="530" stroke="#c8a97e" stroke-width="1" opacity="0.2"/>
  <circle cx="90" cy="565" r="16" fill="#c8a97e" opacity="0.2"/>
  <text x="90" y="571" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#c8a97e" text-anchor="middle">${escapeXml(author.charAt(0))}</text>
  <text x="116" y="570" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#f5f0eb">${escapeXml(author)}</text>
  <text x="660" y="570" font-family="Arial,sans-serif" font-size="14" fill="#a89882" text-anchor="end">${escapeXml(date)}</text>
</svg>`;

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}
