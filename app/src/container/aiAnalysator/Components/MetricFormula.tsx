import type React from "react";

interface MetricFormulaMathProps {
  formula: React.ReactNode;
  description?: string;
  className?: string;
}

export function MetricFormula({ formula }: MetricFormulaMathProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-lg font-medium text-center py-2 formula-container">
        {formula}
      </div>
    </div>
  );
}
