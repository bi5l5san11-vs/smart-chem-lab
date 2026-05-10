import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChemicalCalculator } from "@/components/ChemicalCalculator";
import { LewisStructure } from "@/components/LewisStructure";
import { FunctionalGroups } from "@/components/FunctionalGroups";

type ActiveSection = "home" | "calculator" | "lewis" | "groups";

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[hsl(220,30%,8%)]">
      {/* العنوان الرئيسي */}
      <header className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-dahka text-6xl md:text-7xl mb-4 text-primary animate-in fade-in duration-1000" style={{ textShadow: 'var(--shadow-glow)' }}>
          الكيمياء الذكية
        </h1>
      </header>

      {/* قسم المشاريع */}
      {activeSection === "home" && (
        <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-dahka text-4xl text-primary text-center mb-8">
            المشاريع
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Card 
              className="p-8 bg-card hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary"
              onClick={() => setActiveSection("calculator")}
            >
              <Button 
                variant="ghost" 
                className="w-full h-auto py-6 text-2xl hover:bg-primary/10"
              >
                حاسبة التفاعلات الكيميائية
              </Button>
            </Card>

            <Card 
              className="p-8 bg-card hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary"
              onClick={() => setActiveSection("lewis")}
            >
              <Button 
                variant="ghost" 
                className="w-full h-auto py-6 text-2xl hover:bg-primary/10"
              >
                رسم تراكيب لويس
              </Button>
            </Card>

            <Card
              className="p-8 bg-card hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary"
              onClick={() => setActiveSection("groups")}
            >
              <Button
                variant="ghost"
                className="w-full h-auto py-6 text-2xl hover:bg-primary/10"
              >
                كاشف المجموعات الوظيفية
              </Button>
            </Card>
          </div>

          {/* قسم المنشئ */}
          <div className="text-center">
            <h3 className="font-dahka text-3xl text-primary mb-4">
              المنشئ
            </h3>
            <p className="text-2xl text-foreground/90">
              بيلسان عبدالله السلمي
            </p>
          </div>
        </div>
      )}

      {/* قسم حاسبة التفاعلات */}
      {activeSection === "calculator" && (
        <ChemicalCalculator onBack={() => setActiveSection("home")} />
      )}

      {/* قسم رسم تراكيب لويس */}
      {activeSection === "lewis" && (
        <LewisStructure onBack={() => setActiveSection("home")} />
      )}

      {activeSection === "groups" && (
        <FunctionalGroups onBack={() => setActiveSection("home")} />
      )}
    </div>
  );
};

export default Index;