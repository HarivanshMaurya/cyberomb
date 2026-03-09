import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Free Google Translate API (unofficial but widely used, no API key needed).
 * Translates text while reasonably preserving HTML structure.
 */
async function translateChunk(text: string, targetLang: string): Promise<string> {
  if (!text.trim()) return text;

  const url = "https://translate.googleapis.com/translate_a/single";
  const params = new URLSearchParams({
    client: "gtx",
    sl: "auto",
    tl: targetLang,
    dt: "t",
    q: text,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Translate error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  // Response: [[["translated text","original",null,null,N], ...], ...]
  if (!data || !Array.isArray(data[0])) {
    throw new Error("Unexpected Google Translate response format");
  }

  return data[0].map((seg: any) => seg[0] || "").join("");
}

/**
 * Split HTML into tag parts and text parts.
 * Tags are preserved as-is, only text parts get translated.
 */
function splitHtml(html: string): { parts: string[]; textIndices: number[] } {
  // Split by HTML tags, keeping the tags
  const regex = /(<[^>]*>)/g;
  const parts = html.split(regex);
  const textIndices: number[] = [];

  parts.forEach((part, i) => {
    // Not a tag and has actual translatable text
    if (!part.startsWith("<") && part.trim().length > 0) {
      textIndices.push(i);
    }
  });

  return { parts, textIndices };
}

/**
 * Translate HTML content by extracting text nodes, batch translating, and reinserting.
 * Uses a separator to batch multiple text nodes into fewer API calls.
 */
async function translateHtml(html: string, targetLang: string): Promise<string> {
  const { parts, textIndices } = splitHtml(html);

  if (textIndices.length === 0) return html;

  // Collect all text segments
  const textSegments = textIndices.map((i) => parts[i]);

  // Use a unique separator that won't be translated/modified
  const SEPARATOR = " \n[•SEP•]\n ";
  const joinedText = textSegments.join(SEPARATOR);

  // Split into chunks of ~4000 chars to stay within limits
  const MAX_CHUNK = 4000;
  const chunks: string[] = [];

  if (joinedText.length <= MAX_CHUNK) {
    chunks.push(joinedText);
  } else {
    // Split at separator boundaries to keep segments intact
    let current = "";
    for (const segment of textSegments) {
      const withSep = current ? current + SEPARATOR + segment : segment;
      if (withSep.length > MAX_CHUNK && current) {
        chunks.push(current);
        current = segment;
      } else {
        current = withSep;
      }
    }
    if (current) chunks.push(current);
  }

  // Translate each chunk with a small delay between to avoid rate limits
  const translatedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 300));

    let translated = "";
    // Retry up to 3 times per chunk
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        translated = await translateChunk(chunks[i], targetLang);
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        console.log(`Retry chunk ${i}, attempt ${attempt + 1}`);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    translatedChunks.push(translated);
  }

  // Rejoin and split back by separator
  const fullTranslated = translatedChunks.join(SEPARATOR);
  // Google may alter spacing/format of separator, so be flexible
  const translatedSegments = fullTranslated.split(/\s*\[•SEP•\]\s*/);

  // Reinsert translated text into HTML parts
  for (let i = 0; i < textIndices.length; i++) {
    const idx = textIndices[i];
    if (i < translatedSegments.length) {
      parts[idx] = translatedSegments[i];
    }
  }

  return parts.join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chapters, targetLang } = await req.json();

    if (!chapters || !Array.isArray(chapters) || !targetLang) {
      return new Response(
        JSON.stringify({ error: "Missing chapters array or targetLang" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const translatedChapters: { title: string; content: string }[] = [];

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];

      // Translate title (plain text)
      const translatedTitle = await translateChunk(ch.title || "", targetLang);

      // Small delay
      await new Promise((r) => setTimeout(r, 200));

      // Translate content (HTML)
      const translatedContent = await translateHtml(ch.content || "", targetLang);

      translatedChapters.push({
        title: translatedTitle,
        content: translatedContent,
      });

      // Delay between chapters
      if (i < chapters.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return new Response(
      JSON.stringify({ chapters: translatedChapters }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translate ebook error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
