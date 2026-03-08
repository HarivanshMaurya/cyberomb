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
    const { chapters, targetLang, langName: providedLangName } = await req.json();

    if (!chapters || !Array.isArray(chapters) || !targetLang) {
      return new Response(
        JSON.stringify({ error: "Missing chapters array or targetLang" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langName = providedLangName || targetLang;

    // Translate each chapter individually for maximum reliability
    const translatedChapters: { title: string; content: string }[] = [];

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      
      const prompt = `Translate this chapter to ${langName}.
Keep ALL HTML tags exactly as they are. Only translate the visible text inside tags.
Do NOT translate content inside <pre> or <code> tags.
Do NOT skip any content. Translate EVERYTHING.

TITLE: ${ch.title}

CONTENT:
${ch.content}`;

      let lastError = "";
      let translated = false;
      
      // Retry up to 3 times per chapter
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) {
          // Wait before retry: 2s, 4s
          await new Promise(r => setTimeout(r, attempt * 2000));
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are an expert translator. Translate the chapter to ${langName}. Preserve ALL HTML tags exactly. Do not skip any content. Return the complete translated chapter using the provided tool.`,
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
            tools: [
              {
                type: "function",
                function: {
                  name: "return_translation",
                  description: "Return the translated chapter",
                  parameters: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Translated chapter title" },
                      content: { type: "string", description: "Translated chapter content with ALL HTML preserved" },
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

        if (response.status === 429) {
          lastError = "Rate limited";
          console.log(`Rate limited on chapter ${i}, attempt ${attempt + 1}, retrying...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add credits.", translatedSoFar: translatedChapters }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!response.ok) {
          lastError = `API error: ${response.status}`;
          const errText = await response.text();
          console.error(`AI error chapter ${i}:`, errText);
          continue;
        }

        const data = await response.json();
        
        try {
          const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const parsed = JSON.parse(toolCall.function.arguments);
            if (parsed.title && parsed.content) {
              translatedChapters.push({
                title: parsed.title,
                content: parsed.content,
              });
              translated = true;
              break;
            }
          }
          lastError = "Invalid AI response structure";
        } catch (parseErr) {
          lastError = `Parse error: ${(parseErr as Error).message}`;
          console.error(`Parse error chapter ${i}:`, lastError);
        }
      }

      if (!translated) {
        console.error(`Failed to translate chapter ${i} after 3 attempts: ${lastError}`);
        return new Response(
          JSON.stringify({ 
            error: `Failed to translate chapter ${i + 1} ("${ch.title}") after 3 attempts: ${lastError}`,
            translatedSoFar: translatedChapters,
            failedAtChapter: i,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Small delay between chapters to avoid rate limiting
      if (i < chapters.length - 1) {
        await new Promise(r => setTimeout(r, 500));
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
