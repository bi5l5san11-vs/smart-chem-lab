import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FunctionalGroupsProps {
  onBack: () => void;
}

interface GroupResult {
  name: string;
  symbol: string;
  explanation: string;
  effects: string;
}

export const FunctionalGroups = ({ onBack }: FunctionalGroupsProps) => {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<{ groups: GroupResult[]; summary: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetect = async () => {
    if (!formula.trim()) {
      toast.error("الرجاء إدخال صيغة المركب العضوي");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("detect-functional-groups", {
        body: { formula },
      });
      if (error) throw error;
      setResult(data);
      toast.success("تم تحليل المركب بنجاح");
    } catch (error) {
      console.error("Error detecting functional groups:", error);
      toast.error("حدث خطأ في تحليل المركب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Button onClick={onBack} variant="ghost" className="text-primary hover:bg-primary/10">
          <ArrowRight className="ml-2" />
          العودة للرئيسية
        </Button>
      </div>

      <h2 className="font-dahka text-4xl text-primary text-center mb-8">
        كاشف المجموعات الوظيفية
      </h2>

      <div className="max-w-2xl mx-auto mb-8">
        <Card className="p-6 bg-card">
          <label className="block text-sm mb-2 text-muted-foreground">
            أدخل صيغة المركب العضوي (مثال: CH3CH2OH, CH3COOH, CH3NH2)
          </label>
          <Input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="CH3CH2OH"
            className="mb-4 text-lg text-center bg-muted border-primary/30"
            dir="ltr"
            maxLength={100}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleDetect}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "جاري التحليل..." : "اكتشف المجموعات الوظيفية"}
            </Button>
          </div>
        </Card>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card border-2 border-primary/30">
            {result.summary && (
              <p className="text-foreground/90 text-center text-lg mb-6 leading-relaxed">
                {result.summary}
              </p>
            )}

            {result.groups && result.groups.length > 0 ? (
              <div className="space-y-6">
                <h3 className="font-dahka text-2xl text-primary mb-4 text-center">
                  المجموعات الوظيفية المكتشفة
                </h3>
                {result.groups.map((g, i) => (
                  <div key={i} className="border-r-4 border-primary pr-4">
                    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                      <h4 className="text-xl font-semibold text-primary">{g.name}</h4>
                      <span className="text-2xl font-bold text-primary" dir="ltr">{g.symbol}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">الشرح الكيميائي: </span>
                        <span className="text-foreground/90">{g.explanation}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">التأثير على الخصائص: </span>
                        <span className="text-foreground/90">{g.effects}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                لم يتم اكتشاف أي مجموعة وظيفية من القائمة المعروفة
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
