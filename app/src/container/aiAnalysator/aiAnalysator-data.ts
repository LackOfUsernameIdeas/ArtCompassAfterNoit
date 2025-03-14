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

export const sampleData: SecondaryMetricData[] = [
  {
    fpr_exact: 0.7724550898203593,
    fpr_fixed: 0.77,
    fpr_percentage: 77.25,
    irrelevant_user_recommendations_count: 258,
    user_recommendations_count: 350,
    irrelevant_platform_recommendations_count: 334,
    total_platform_recommendations_count: 439
  },
  {
    fnr_exact: 0.1238095238095238,
    fnr_fixed: 0.12,
    fnr_percentage: 12.38,
    relevant_non_given_recommendations_count: 13,
    relevant_user_recommendations_count: 92,
    user_recommendations_count: 350,
    relevant_platform_recommendations_count: 105,
    total_platform_recommendations_count: 439
  },
  {
    specificity_exact: 0.2275449101796407,
    specificity_fixed: 0.23,
    specificity_percentage: 22.75,
    irrelevant_non_given_recommendations_count: 76,
    non_given_recommendations_count: 89,
    irrelevant_user_recommendations_count: 258,
    user_recommendations_count: 350,
    irrelevant_platform_recommendations_count: 334,
    total_platform_recommendations_count: 439
  },
  {
    accuracy_exact: 0.3826879271070615,
    accuracy_fixed: 0.38,
    accuracy_percentage: 38.27,
    irrelevant_non_given_recommendations_count: 76,
    relevant_non_given_recommendations_count: 13,
    non_given_recommendations_count: 89,
    relevant_user_recommendations_count: 92,
    user_recommendations_count: 350,
    relevant_platform_recommendations_count: 105,
    total_platform_recommendations_count: 439
  }
];
