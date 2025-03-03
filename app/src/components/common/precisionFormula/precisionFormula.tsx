import React from "react";

interface PrecisionFormulaProps {
  relevantCount: number;
  totalCount: number;
  precisionValue: number;
  precisionPercentage: number;
}

const PrecisionFormula: React.FC<PrecisionFormulaProps> = ({
  relevantCount,
  totalCount,
  precisionValue,
  precisionPercentage
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full space-x-4">
        <div className="text-2xl font-serif italic font-semibold">
          Precision ={" "}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-serif">{relevantCount}</div>
          <div className="w-full border-t border-black/70 dark:border-defaultborder my-1"></div>
          <div className="text-2xl font-serif">{totalCount}</div>
        </div>
        <div className="text-2xl font-serif font-semibold">
          = {precisionValue.toFixed(4)}
        </div>
      </div>
      <div className="text-lg text-center">
        <div>където:</div>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <i className="ti ti-checklist text-2xl"></i>
          <span>
            <strong>{relevantCount}</strong> = Брой релевантни препоръки
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <i className="ti ti-list text-2xl"></i>
          <span>
            <strong>{totalCount}</strong> = Брой препоръки от генерирането
          </span>
        </div>
      </div>
      <div className="text-2xl text-primary font-semibold text-center">
        Precision = {precisionPercentage}%
      </div>
    </div>
  );
};

export default PrecisionFormula;
