import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { PeriodicTable } from "./PeriodicTable";
import { ReactionResult } from "./ReactionResult";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChemicalCalculatorProps {
  onBack: () => void;
}

export const ChemicalCalculator = ({ onBack }: ChemicalCalculatorProps) => {
  const [element1, setElement1] = useState<string>("");
  const [element2, setElement2] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleElementClick = (symbol: string) => {
    if (!element1) {
      setElement1(symbol);
    } else if (!element2) {
      setElement2(symbol);
    } else {
      // إعادة التعيين والبدء من جديد
      setElement1(symbol);
      setElement2("");
      setResult(null);
    }
  };

  const handleClear = () => {
    setElement1("");
    setElement2("");
    setResult(null);
  };

  const handleCalculate = async () => {
    if (!element1 || !element2) {
      toast.error("الرجاء اختيار عنصرين");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-reaction', {
        body: { element1, element2 }
      });

      if (error) throw error;
      
      setResult(data);
      toast.success("تم حساب التفاعل بنجاح");
    } catch (error) {
      console.error('Error calculating reaction:', error);
      toast.error("حدث خطأ في حساب التفاعل");
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
        حاسبة التفاعلات الكيميائية
      </h2>

      {/* صناديق العناصر المختارة */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="p-6 bg-card">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <label className="block text-sm mb-2 text-muted-foreground">العنصر الأول</label>
              <div className="h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30">
                {element1 || "—"}
              </div>
            </div>
            <div className="text-center">
              <label className="block text-sm mb-2 text-muted-foreground">العنصر الثاني</label>
              <div className="h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30">
                {element2 || "—"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleCalculate}
              disabled={!element1 || !element2 || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "جاري الحساب..." : "احسب التفاعل"}
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              إعادة التعيين
            </Button>
          </div>
        </Card>
      </div>

      {/* نتيجة التفاعل */}
      {result && <ReactionResult result={result} />}

      {/* الجدول الدوري */}
      <PeriodicTable 
        onElementClick={handleElementClick}
        selectedElements={[element1, element2]}
      />
    </div>
  );
};