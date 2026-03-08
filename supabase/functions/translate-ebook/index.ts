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

    // Use the language name provided by the client (from DB), no hardcoded map needed
    const langName = providedLangName || targetLang;

    const chaptersText = chapters.map((ch: any, i: number) =>
      `=== CHAPTER ${i} ===\nTITLE: ${ch.title}\nCONTENT: ${ch.content}\n=== END CHAPTER ${i} ===`
    ).join("\n\n");

    const prompt = `Translate ALL ${chapters.length} chapters below to ${langName}.
Keep ALL HTML tags exactly as they are. Only translate the visible text inside tags.
Do NOT translate content inside <pre> or <code> tags.

${chaptersText}`;

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
            content: `You are an expert translator. Translate all chapters to ${langName}. Preserve HTML tags exactly. Return all chapters using the provided tool.`,
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
                    items: {
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
                required: ["chapters"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_translations" } },
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
      console.error("AI Gateway error:", errText);
      return new Response(
        JSON.stringify({ chapters }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    try {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        const translatedChapters = parsed.chapters || [];
        
        const result = chapters.map((ch: any, i: number) => ({
          title: translatedChapters[i]?.title || ch.title,
          content: translatedChapters[i]?.content || ch.content,
        }));
        
        return new Response(
          JSON.stringify({ chapters: result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (parseErr) {
      console.error("Parse error:", (parseErr as Error).message);
    }

    return new Response(
      JSON.stringify({ chapters }),
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
