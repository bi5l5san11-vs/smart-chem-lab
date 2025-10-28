import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LewisStructureProps {
  onBack: () => void;
}

export const LewisStructure = ({ onBack }: LewisStructureProps) => {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDraw = async (stepByStep: boolean) => {
    if (!formula.trim()) {
      toast.error("الرجاء إدخال صيغة الجزيء");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('draw-lewis', {
        body: { formula, stepByStep }
      });

      if (error) throw error;
      
      setResult(data);
      toast.success("تم رسم التركيب بنجاح");
    } catch (error) {
      console.error('Error drawing Lewis structure:', error);
      toast.error("حدث خطأ في رسم التركيب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          className="text-primary hover:bg-primary/10"
        >
          <ArrowRight className="ml-2" />
          العودة للرئيسية
        </Button>
      </div>

      <h2 className="font-dahka text-4xl text-primary text-center mb-8">
        رسم تراكيب لويس
      </h2>

      {/* حقل الإدخال */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="p-6 bg-card">
          <label className="block text-sm mb-2 text-muted-foreground">
            أدخل صيغة الجزيء (مثال: H2O, CO2, NH3)
          </label>
          <Input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="H2O"
            className="mb-4 text-lg text-center bg-muted border-primary/30"
            dir="ltr"
          />
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Button 
              onClick={() => handleDraw(true)}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "جاري الرسم..." : "ارسم خطوة بخطوة"}
            </Button>
            <Button 
              onClick={() => handleDraw(false)}
              disabled={isLoading}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              {isLoading ? "جاري الرسم..." : "ارسم النهائي"}
            </Button>
          </div>
        </Card>
      </div>

      {/* عرض النتيجة */}
      {result && (
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card border-2 border-primary/30">
            {result.steps ? (
              <div className="space-y-6">
                <h3 className="font-dahka text-2xl text-primary mb-4">
                  الخطوات التفصيلية
                </h3>
                {result.steps.map((step: any, index: number) => (
                  <div key={index} className="border-r-4 border-primary pr-4">
                    <h4 className="text-xl font-semibold mb-2 text-primary">
                      {step.title}
                    </h4>
                    <p className="text-foreground/80 mb-3">{step.description}</p>
                    {step.diagram && (
                      <div 
                        className="bg-muted/50 p-6 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: step.diagram }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h3 className="font-dahka text-2xl text-primary mb-4 text-center">
                  تركيب لويس النهائي
                </h3>
                {result.diagram && (
                  <div 
                    className="bg-muted/50 p-8 rounded-lg flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: result.diagram }}
                  />
                )}
                {result.description && (
                  <p className="mt-6 text-foreground/80 text-center text-lg">
                    {result.description}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};