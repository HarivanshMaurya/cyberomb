import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://cyberomb.lovable.app";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  // Fetch published pages
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("is_published", true);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, created_at");

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/articles", priority: "0.9", changefreq: "daily" },
    { loc: "/wellness", priority: "0.8", changefreq: "weekly" },
    { loc: "/travel", priority: "0.8", changefreq: "weekly" },
    { loc: "/creativity", priority: "0.8", changefreq: "weekly" },
    { loc: "/growth", priority: "0.8", changefreq: "weekly" },
    { loc: "/about", priority: "0.6", changefreq: "monthly" },
    { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static pages
  for (const p of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  }

  // Articles
  for (const a of articles || []) {
    xml += `  <url>
    <loc>${SITE_URL}/blog/${a.slug}</loc>
    <lastmod>${new Date(a.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Dynamic pages
  for (const p of pages || []) {
    xml += `  <url>
    <loc>${SITE_URL}/page/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
  }

  // Categories
  for (const c of categories || []) {
    xml += `  <url>
    <loc>${SITE_URL}/category/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
