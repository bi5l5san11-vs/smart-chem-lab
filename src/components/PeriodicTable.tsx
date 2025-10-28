import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PeriodicTableProps {
  onElementClick: (symbol: string) => void;
  selectedElements: string[];
}

// العناصر الأساسية من الجدول الدوري
const elements = [
  // الصف الأول
  { symbol: "H", name: "هيدروجين", row: 1, col: 1 },
  { symbol: "He", name: "هيليوم", row: 1, col: 18 },
  
  // الصف الثاني
  { symbol: "Li", name: "ليثيوم", row: 2, col: 1 },
  { symbol: "Be", name: "بيريليوم", row: 2, col: 2 },
  { symbol: "B", name: "بورون", row: 2, col: 13 },
  { symbol: "C", name: "كربون", row: 2, col: 14 },
  { symbol: "N", name: "نيتروجين", row: 2, col: 15 },
  { symbol: "O", name: "أكسجين", row: 2, col: 16 },
  { symbol: "F", name: "فلور", row: 2, col: 17 },
  { symbol: "Ne", name: "نيون", row: 2, col: 18 },
  
  // الصف الثالث
  { symbol: "Na", name: "صوديوم", row: 3, col: 1 },
  { symbol: "Mg", name: "مغنيسيوم", row: 3, col: 2 },
  { symbol: "Al", name: "ألومنيوم", row: 3, col: 13 },
  { symbol: "Si", name: "سيليكون", row: 3, col: 14 },
  { symbol: "P", name: "فوسفور", row: 3, col: 15 },
  { symbol: "S", name: "كبريت", row: 3, col: 16 },
  { symbol: "Cl", name: "كلور", row: 3, col: 17 },
  { symbol: "Ar", name: "أرجون", row: 3, col: 18 },
  
  // الصف الرابع
  { symbol: "K", name: "بوتاسيوم", row: 4, col: 1 },
  { symbol: "Ca", name: "كالسيوم", row: 4, col: 2 },
  { symbol: "Sc", name: "سكانديوم", row: 4, col: 3 },
  { symbol: "Ti", name: "تيتانيوم", row: 4, col: 4 },
  { symbol: "V", name: "فاناديوم", row: 4, col: 5 },
  { symbol: "Cr", name: "كروم", row: 4, col: 6 },
  { symbol: "Mn", name: "منجنيز", row: 4, col: 7 },
  { symbol: "Fe", name: "حديد", row: 4, col: 8 },
  { symbol: "Co", name: "كوبالت", row: 4, col: 9 },
  { symbol: "Ni", name: "نيكل", row: 4, col: 10 },
  { symbol: "Cu", name: "نحاس", row: 4, col: 11 },
  { symbol: "Zn", name: "زنك", row: 4, col: 12 },
  { symbol: "Ga", name: "جاليوم", row: 4, col: 13 },
  { symbol: "Ge", name: "جرمانيوم", row: 4, col: 14 },
  { symbol: "As", name: "زرنيخ", row: 4, col: 15 },
  { symbol: "Se", name: "سيلينيوم", row: 4, col: 16 },
  { symbol: "Br", name: "بروم", row: 4, col: 17 },
  { symbol: "Kr", name: "كريبتون", row: 4, col: 18 },
  
  // الصف الخامس (العناصر الأساسية)
  { symbol: "Rb", name: "روبيديوم", row: 5, col: 1 },
  { symbol: "Sr", name: "سترونتيوم", row: 5, col: 2 },
  { symbol: "Y", name: "إتريوم", row: 5, col: 3 },
  { symbol: "Zr", name: "زركونيوم", row: 5, col: 4 },
  { symbol: "Nb", name: "نيوبيوم", row: 5, col: 5 },
  { symbol: "Mo", name: "موليبدنوم", row: 5, col: 6 },
  { symbol: "Ag", name: "فضة", row: 5, col: 11 },
  { symbol: "I", name: "يود", row: 5, col: 17 },
  { symbol: "Xe", name: "زينون", row: 5, col: 18 },
  
  // الصف السادس (العناصر الأساسية)
  { symbol: "Cs", name: "سيزيوم", row: 6, col: 1 },
  { symbol: "Ba", name: "باريوم", row: 6, col: 2 },
  { symbol: "Au", name: "ذهب", row: 6, col: 11 },
  { symbol: "Hg", name: "زئبق", row: 6, col: 12 },
  { symbol: "Pb", name: "رصاص", row: 6, col: 14 },
  { symbol: "Rn", name: "رادون", row: 6, col: 18 },
  
  // الصف السابع (العناصر الأساسية)
  { symbol: "Fr", name: "فرنسيوم", row: 7, col: 1 },
  { symbol: "Ra", name: "راديوم", row: 7, col: 2 },
];

export const PeriodicTable = ({ onElementClick, selectedElements }: PeriodicTableProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid gap-1" style={{ 
        gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))',
        gridTemplateRows: 'repeat(7, 60px)'
      }}>
        {elements.map((element) => (
          <Button
            key={element.symbol}
            onClick={() => onElementClick(element.symbol)}
            className={cn(
              "h-14 w-full flex flex-col items-center justify-center p-1 text-xs border border-primary/30 transition-all",
              selectedElements.includes(element.symbol)
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] scale-105 border-primary"
                : "bg-card hover:bg-primary/20 hover:scale-105 hover:shadow-[var(--shadow-card)]"
            )}
            style={{
              gridRow: element.row,
              gridColumn: element.col
            }}
            title={element.name}
          >
            <span className="font-bold text-base">{element.symbol}</span>
          </Button>
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        اضغط على العناصر لاختيارها
      </p>
    </div>
  );
};