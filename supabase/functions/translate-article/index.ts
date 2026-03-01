import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const prompt = `You are a professional translator. Translate the following blog article content from ${targetLang === "hi" ? "English to Hindi" : "Hindi to English"}.

IMPORTANT RULES:
- Keep ALL HTML tags exactly as they are. Only translate the text content inside them.
- Maintain the same formatting, paragraph structure, and HTML markup.
- Translate naturally, not word-by-word. Use proper ${langName} grammar and tone.
- Do NOT add any explanation or commentary. Return ONLY the translated content.

Return a JSON object with these fields:
- "title": translated title
- "content": translated HTML content  
- "excerpt": translated excerpt (if provided)

Article Title: ${title || ""}

Article Excerpt: ${excerpt || ""}

Article Content (HTML):
${content}`;

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
            content: "You are a translation assistant. Always respond with valid JSON only, no markdown code blocks.",
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

    // Strip markdown code fences if present
    raw = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

    const translated = JSON.parse(raw);

    return new Response(JSON.stringify(translated), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
