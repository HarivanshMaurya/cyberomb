import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function sanitizeJsonString(raw: string): string {
  // Strip markdown code fences
  raw = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
  
  // Remove control characters that break JSON.parse
  // Replace literal control chars inside string values (tabs, newlines, etc.)
  // but preserve the JSON structure
  raw = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  
  // Fix unescaped newlines inside JSON string values
  // Strategy: replace actual newlines that are inside strings with \\n
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      result += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString && ch === "\n") {
      result += "\\n";
      continue;
    }
    if (inString && ch === "\r") {
      result += "\\r";
      continue;
    }
    if (inString && ch === "\t") {
      result += "\\t";
      continue;
    }
    result += ch;
  }
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, excerpt, targetLang } = await req.json();

    if (!content || !targetLang) {
      return new Response(JSON.stringify({ error: "Missing content or targetLang" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langName = targetLang === "hi" ? "Hindi" : "English";

    const prompt = `Translate this content to ${langName}. Keep ALL HTML tags exactly as they are. Only translate the visible text content inside tags. Do NOT translate content inside <pre> or <code> tags - keep those exactly as-is.

Return a valid JSON object with these keys: "title", "content", "excerpt"
Make sure all strings are properly escaped for JSON (no raw newlines inside strings, use \\n instead).

Title: ${title || ""}
Excerpt: ${excerpt || ""}
Content: ${content}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a translation assistant. Always respond with valid JSON only, no markdown code blocks. Ensure all string values have properly escaped special characters (newlines as \\n, tabs as \\t). Never put raw newlines inside JSON string values.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      throw new Error("Translation service error");
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || "";

    // Sanitize and parse
    const sanitized = sanitizeJsonString(raw);
    
    let translated;
    try {
      translated = JSON.parse(sanitized);
    } catch (parseErr) {
      console.error("JSON parse failed after sanitization, raw length:", raw.length);
      console.error("Parse error:", (parseErr as Error).message);
      // Last resort: try to extract fields with regex
      const titleMatch = sanitized.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const contentMatch = sanitized.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
      const excerptMatch = sanitized.match(/"excerpt"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      
      if (contentMatch) {
        translated = {
          title: titleMatch ? titleMatch[1] : title,
          content: contentMatch[1],
          excerpt: excerptMatch ? excerptMatch[1] : excerpt,
        };
      } else {
        throw parseErr;
      }
    }

    return new Response(JSON.stringify(translated), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
