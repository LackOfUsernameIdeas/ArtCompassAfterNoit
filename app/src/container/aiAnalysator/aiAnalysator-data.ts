import { SecondaryMetricData } from "./aiAnalysator-types";

export const metricConfig = {
  fpr: {
    title: "FPR",
    description: "Процент на фалшиво положителни",
    tooltip:
      "Делът на нерелевантните препоръки сред всички препоръки на потребителя."
  },
  fnr: {
    title: "FNR",
    description: "Процент на фалшиво отрицателни",
    tooltip:
      "Делът на релевантните препоръки, които не са били дадени на потребителя."
  },
  accuracy: {
    title: "Accuracy",
    description: "Обща точност",
    tooltip:
      "Делът на правилните препоръки (както релевантни дадени, така и нерелевантни недадени)."
  },
  specificity: {
    title: "Specificity",
    description: "Процент на истински отрицателни",
    tooltip:
      "Делът на нерелевантните препоръки, които правилно не са били дадени на потребителя."
  }
};
