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

    const langMap: Record<string, string> = {
      hi: "Hindi (हिन्दी)",
      mr: "Marathi (मराठी)",
      ta: "Tamil (தமிழ்)",
      bn: "Bengali (বাংলা)",
      en: "English",
    };
    const langName = langMap[targetLang] || "Hindi (हिन्दी)";

    const translatedChapters = [];

    for (const chapter of chapters) {
      const prompt = `Translate the following chapter to ${langName}. 
Keep ALL HTML tags exactly as they are. Only translate the visible text inside tags.
Do NOT add any extra commentary or explanation.

Chapter Title: ${chapter.title}
Chapter Content:
${chapter.content}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: "You are an expert translator. Use the provided tool to return the translated title and content.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          tools: [
            {
              type: "function",
              function: {
                name: "return_translation",
                description: "Return the translated chapter title and content",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Translated chapter title" },
                    content: { type: "string", description: "Translated chapter content with HTML preserved" },
                  },
                  required: ["title", "content"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_translation" } },
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
        translatedChapters.push(chapter);
        continue;
      }

      const data = await response.json();
      
      try {
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          const parsed = JSON.parse(toolCall.function.arguments);
          translatedChapters.push({
            title: parsed.title || chapter.title,
            content: parsed.content || chapter.content,
          });
        } else {
          // Fallback: try message content
          let raw = data.choices?.[0]?.message?.content || "";
          raw = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
          const parsed = JSON.parse(raw);
          translatedChapters.push({
            title: parsed.title || chapter.title,
            content: parsed.content || chapter.content,
          });
        }
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
