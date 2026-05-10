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
    const { formula } = await req.json();

    if (!formula || typeof formula !== "string" || formula.length > 100) {
      return new Response(
        JSON.stringify({ error: "صيغة غير صالحة" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `أنت خبير كيمياء عضوية. لدي الصيغة العضوية: ${formula}

حلل الصيغة وحدد المجموعات الوظيفية الموجودة فقط من القائمة التالية:
- مجموعة الهيدروكسيل (-OH)
- مجموعة حمض الكربوكسيل (-COOH)
- مجموعة الكربونيل (C=O)
- مجموعة الأمين (-NH2)
- رابطة مزدوجة ألكين (C=C)

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي:
{
  "groups": [
    {
      "name": "اسم المجموعة بالعربية",
      "symbol": "-OH",
      "explanation": "شرح كيميائي مبسط للمجموعة",
      "effects": "تأثير المجموعة على خصائص الجزيء (القطبية، الحموضة، التفاعلية، الروابط الهيدروجينية)"
    }
  ],
  "summary": "ملخص قصير عن الجزيء وطبيعته"
}

إذا لم توجد أي مجموعة وظيفية من القائمة، أرجع groups كقائمة فارغة مع توضيح في summary.
اجعل الشرح مناسباً لطلاب المرحلة الثانوية: واضح ومباشر.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت خبير كيمياء عضوية. ترد دائماً بصيغة JSON صحيحة فقط." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse JSON:", e, content);
      result = { groups: [], summary: content };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in detect-functional-groups:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
