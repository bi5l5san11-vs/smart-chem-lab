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
    const { formula, stepByStep } = await req.json();
    
    if (!formula) {
      return new Response(
        JSON.stringify({ error: "الصيغة الكيميائية مطلوبة" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let prompt;
    if (stepByStep) {
      prompt = `أنت خبير كيميائي متخصص في رسم تراكيب لويس. لدي الصيغة الكيميائية: ${formula}

الرجاء تقديم الخطوات التفصيلية لرسم تركيب لويس بصيغة JSON كالتالي:
{
  "steps": [
    {
      "title": "الخطوة 1: حساب إجمالي إلكترونات التكافؤ",
      "description": "شرح الخطوة بالتفصيل",
      "diagram": "<svg width='300' height='200'>...</svg>"
    },
    ...
  ]
}

يجب أن تشمل الخطوات:
1. حساب إجمالي إلكترونات التكافؤ
2. تحديد الذرة المركزية
3. توزيع الإلكترونات لتشكيل الروابط
4. إكمال الثمانيات
5. التحقق من الشحنات الشكلية
6. التركيب النهائي

استخدم SVG بسيط لرسم كل خطوة. مثال:
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="150" cy="100" r="30" fill="none" stroke="#72A3F2" stroke-width="2"/>
  <text x="150" y="110" text-anchor="middle" fill="#72A3F2" font-size="20">O</text>
</svg>`;
    } else {
      prompt = `أنت خبير كيميائي متخصص في رسم تراكيب لويس. لدي الصيغة الكيميائية: ${formula}

الرجاء تقديم تركيب لويس النهائي بصيغة JSON:
{
  "diagram": "<svg width='400' height='300'>...</svg>",
  "description": "وصف مختصر للتركيب"
}

استخدم SVG لرسم التركيب النهائي بوضوح. اجعل الرسم جميلاً ومفصلاً مع:
- دوائر للذرات
- خطوط للروابط (خط واحد = رابطة أحادية، خطين = رابطة مزدوجة)
- نقاط للإلكترونات الحرة
- استخدم اللون #72A3F2 للتصميم`;
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
          { role: "system", content: "أنت خبير في رسم تراكيب لويس. تقدم رسومات SVG دقيقة وواضحة." },
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
    
    // استخراج JSON من الرد
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e, content);
      // قيم افتراضية
      result = stepByStep 
        ? {
            steps: [
              {
                title: "خطأ في التحليل",
                description: content,
                diagram: `<svg width="200" height="100"><text x="10" y="50" fill="#72A3F2">انظر الوصف</text></svg>`
              }
            ]
          }
        : {
            diagram: `<svg width="200" height="100"><text x="10" y="50" fill="#72A3F2">خطأ في الرسم</text></svg>`,
            description: content
          };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in draw-lewis:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});