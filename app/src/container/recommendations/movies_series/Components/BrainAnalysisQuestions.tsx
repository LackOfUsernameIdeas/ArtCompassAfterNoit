import { FC } from "react";
// import { BrainAnalysisQuestionsProps } from "../../../types_common";

// export const BrainAnalysisQuestions: FC<BrainAnalysisQuestionsProps> = ({
export const BrainAnalysisQuestions = () => {
  return (
    <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
      <h2 className="text-xl font-semibold break-words">question</h2>

      <p className="text-sm text-gray-500 mt-2">description</p>
    </div>
  );
};
