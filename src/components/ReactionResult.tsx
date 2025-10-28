import { Card } from "@/components/ui/card";

interface ReactionResultProps {
  result: {
    compound_name: string;
    formula: string;
    reaction_type: string;
    usage: string;
  };
}

export const ReactionResult = ({ result }: ReactionResultProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="p-8 bg-card border-2 border-primary/30 shadow-[var(--shadow-card)]">
        <h3 className="font-dahka text-3xl text-primary mb-6 text-center">
          نتيجة التفاعل
        </h3>
        
        <div className="space-y-4">
          <div className="border-r-4 border-primary pr-4">
            <h4 className="text-sm text-muted-foreground mb-1">اسم المركب</h4>
            <p className="text-2xl font-semibold text-foreground">{result.compound_name}</p>
          </div>
          
          <div className="border-r-4 border-primary pr-4">
            <h4 className="text-sm text-muted-foreground mb-1">الصيغة الكيميائية</h4>
            <p className="text-3xl font-bold text-primary" dir="ltr">{result.formula}</p>
          </div>
          
          <div className="border-r-4 border-primary pr-4">
            <h4 className="text-sm text-muted-foreground mb-1">نوع التفاعل</h4>
            <p className="text-xl text-foreground">{result.reaction_type}</p>
          </div>
          
          <div className="border-r-4 border-primary pr-4">
            <h4 className="text-sm text-muted-foreground mb-1">الاستخدام في الحياة اليومية</h4>
            <p className="text-foreground/90 leading-relaxed">{result.usage}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};