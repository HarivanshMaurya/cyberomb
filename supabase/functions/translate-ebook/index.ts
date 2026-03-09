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

    // Build a single combined prompt with all chapters marked by delimiters
    const chaptersPayload = chapters.map((ch: any, i: number) => 
      `===CHAPTER_${i + 1}_START===\nTITLE: ${ch.title}\nCONTENT:\n${ch.content}\n===CHAPTER_${i + 1}_END===`
    ).join("\n\n");

    const prompt = `Translate the following ${chapters.length} chapter(s) to ${langName}.
Keep ALL HTML tags exactly as they are. Only translate the visible text inside tags.
Do NOT translate content inside <pre> or <code> tags.
Do NOT skip any content. Translate EVERYTHING completely.
Each chapter is marked with ===CHAPTER_N_START=== and ===CHAPTER_N_END===.

${chaptersPayload}`;

    let lastError = "";

    // Retry up to 3 times
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
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
              content: `You are an expert translator. Translate ALL chapters to ${langName}. Preserve ALL HTML tags exactly. Do not skip any content. Return the complete translated chapters using the provided tool. You MUST return exactly ${chapters.length} chapter(s) in the chapters array.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          tools: [
            {
              type: "function",
              function: {
                name: "return_translations",
                description: "Return all translated chapters",
                parameters: {
                  type: "object",
                  properties: {
                    chapters: {
                      type: "array",
                      description: "Array of translated chapters",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string", description: "Translated chapter title" },
                          content: { type: "string", description: "Translated chapter content with ALL HTML preserved" },
                        },
                        required: ["title", "content"],
                      },
                    },
                  },
                  required: ["chapters"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_translations" } },
        }),
      });

      if (response.status === 429) {
        lastError = "Rate limited";
        console.log(`Rate limited, attempt ${attempt + 1}, retrying...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!response.ok) {
        lastError = `API error: ${response.status}`;
        const errText = await response.text();
        console.error(`AI error:`, errText);
        continue;
      }

      const data = await response.json();

      try {
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          const parsed = JSON.parse(toolCall.function.arguments);
          if (parsed.chapters && Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
            return new Response(
              JSON.stringify({ chapters: parsed.chapters }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
        lastError = "Invalid AI response structure";
      } catch (parseErr) {
        lastError = `Parse error: ${(parseErr as Error).message}`;
        console.error(`Parse error:`, lastError);
      }
    }

    return new Response(
      JSON.stringify({ error: `Failed to translate after 3 attempts: ${lastError}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translate ebook error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
