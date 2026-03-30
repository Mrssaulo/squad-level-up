import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IMCCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{ imc: number; label: string; color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || h <= 0) return;
    const imc = w / (h * h);
    let label: string, color: string;
    if (imc < 18.5) { label = "Abaixo do peso"; color = "text-highlight"; }
    else if (imc < 24.9) { label = "Peso ideal — Atleta em forma!"; color = "text-primary"; }
    else if (imc < 29.9) { label = "Acima do peso"; color = "text-highlight"; }
    else { label = "Obesidade — Procure orientação"; color = "text-destructive"; }
    setResult({ imc, label, color });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">Peso (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="75"
            className="bg-foreground/10 border-foreground/20 text-foreground placeholder:text-foreground/30 h-12 mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">Altura (m)</label>
          <Input
            type="number"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="1.78"
            className="bg-foreground/10 border-foreground/20 text-foreground placeholder:text-foreground/30 h-12 mt-1"
          />
        </div>
      </div>
      <Button
        onClick={calculate}
        className="w-full h-12 font-heading font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Calcular IMC
      </Button>
      {result && (
        <div className="mt-4 text-center animate-scale-in">
          <p className="text-4xl font-heading font-extrabold text-foreground">{result.imc.toFixed(1)}</p>
          <p className={`text-sm font-semibold mt-1 ${result.color}`}>{result.label}</p>
        </div>
      )}
    </div>
  );
};

export default IMCCalculator;
