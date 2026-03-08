import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langName = targetLang === "hi" ? "Hindi (हिन्दी)" : "English";

    // Translate chapters one by one to avoid token limits
    const translatedChapters = [];

    for (const chapter of chapters) {
      const prompt = `Translate the following chapter to ${langName}. 
Keep ALL HTML tags exactly as they are. Only translate the visible text inside tags.
Do NOT add any extra commentary or explanation.

Chapter Title: ${chapter.title}
Chapter Content:
${chapter.content}

Return a valid JSON object with two keys: "title" (translated title) and "content" (translated content with HTML preserved).`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "You are an expert translator. Respond with valid JSON only, no markdown fences. Ensure all strings are properly escaped for JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errText = await response.text();
        console.error("AI Gateway error for chapter:", chapter.title, errText);
        // Keep original if translation fails for this chapter
        translatedChapters.push(chapter);
        continue;
      }

      const data = await response.json();
      let raw = data.choices?.[0]?.message?.content || "";

      // Clean markdown fences
      raw = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

      try {
        // Fix unescaped newlines inside JSON strings
        let sanitized = "";
        let inStr = false;
        let escaped = false;
        for (let i = 0; i < raw.length; i++) {
          const ch = raw[i];
          if (escaped) { sanitized += ch; escaped = false; continue; }
          if (ch === "\\") { sanitized += ch; escaped = true; continue; }
          if (ch === '"') { inStr = !inStr; sanitized += ch; continue; }
          if (inStr && ch === "\n") { sanitized += "\\n"; continue; }
          if (inStr && ch === "\r") { sanitized += "\\r"; continue; }
          if (inStr && ch === "\t") { sanitized += "\\t"; continue; }
          sanitized += ch;
        }

        const parsed = JSON.parse(sanitized);
        translatedChapters.push({
          title: parsed.title || chapter.title,
          content: parsed.content || chapter.content,
        });
      } catch (parseErr) {
        console.error("Parse error for chapter:", chapter.title, (parseErr as Error).message);
        translatedChapters.push(chapter);
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
