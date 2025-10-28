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
    const { element1, element2 } = await req.json();
    
    if (!element1 || !element2) {
      return new Response(
        JSON.stringify({ error: "العنصران مطلوبان" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `أنت خبير كيميائي. لديك عنصران: ${element1} و ${element2}.
    
    الرجاء تقديم المعلومات التالية بصيغة JSON:
    {
      "compound_name": "اسم المركب الناتج بالعربية",
      "formula": "الصيغة الكيميائية",
      "reaction_type": "نوع التفاعل (أيوني، تساهمي، إلخ)",
      "usage": "شرح موجز عن استخدام المركب في الحياة اليومية (2-3 جمل)"
    }
    
    إذا لم يتفاعل العنصران، أذكر ذلك في compound_name.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت خبير في الكيمياء. تقدم إجابات دقيقة علمياً ومختصرة بالعربية." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // استخراج JSON من الرد
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch {
      // إذا فشل التحليل، استخدم قيم افتراضية
      result = {
        compound_name: "لا يمكن تحديد المركب",
        formula: `${element1}${element2}`,
        reaction_type: "غير محدد",
        usage: content || "لا توجد معلومات متوفرة"
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in calculate-reaction:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});