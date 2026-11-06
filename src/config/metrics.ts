import type { ModelMetrics } from '../types/complaint';

export const MODEL_EVALUATION_METRICS: Record<'distilbert' | 'logistic_regression', ModelMetrics> = {
  distilbert: {
    id: 'distilbert',
    name: 'Fine-tuned DistilBERT',
    type: 'Transformer-based Neural Architecture',
    checkpoint: 'distilbert-base-uncased',
    maxSeqLength: 64,
    accuracy: 99.85,
    macroPrecision: 99.85,
    macroRecall: 99.88,
    macroF1: 99.86,
    misclassifiedSamples: 4,
    trainingTimeSec: 193.30,
    description:
      'Fine-tuned transformer model with contextual bidirectional self-attention. Achieved the highest overall test accuracy and Macro F1 score on the validation split. Designated as the primary production router.',
    isRecommended: true,
    badge: 'Recommended Primary Model',
  },
  logistic_regression: {
    id: 'logistic_regression',
    name: 'TF-IDF + Logistic Regression',
    type: 'Linear Classification Baseline',
    vocabularySize: 5202,
    ngramRange: '(1, 2) Unigrams & Bigrams',
    accuracy: 99.74,
    macroPrecision: 99.86,
    macroRecall: 99.76,
    macroF1: 99.81,
    misclassifiedSamples: 7,
    trainingTimeSec: 5.65,
    description:
      'High-speed linear baseline utilizing sparse sublinear TF-IDF vectors (unigrams + bigrams). Extremely fast inference with negligible memory footprint, achieving 99.74% accuracy in 5.65 seconds of training.',
    isRecommended: false,
    badge: 'Lightweight Baseline',
  },
};

export const METRIC_DEFINITIONS = [
  {
    title: 'Test Accuracy',
    formula: '(TP + TN) / Total Samples',
    description:
      'The proportion of all test complaints that were assigned their exact ground-truth category across all 11 classes.',
  },
  {
    title: 'Macro Precision',
    formula: 'Mean of Precision across all 11 classes',
    description:
      'Measures the average purity of category assignments across all classes equally, penalizing false positives regardless of category frequency.',
  },
  {
    title: 'Macro Recall',
    formula: 'Mean of Recall across all 11 classes',
    description:
      'Measures the average coverage of true category samples detected across all classes equally, penalizing false negatives and missed complaints.',
  },
  {
    title: 'Macro F1-Score',
    formula: 'Harmonic mean of Macro Precision & Recall',
    description:
      'The primary benchmark selection metric in this research. Balanced score balancing precision and recall without being biased toward high-frequency categories.',
  },
  {
    title: 'Training Duration',
    formula: 'Elapsed Wall Clock Time',
    description:
      'Total GPU/CPU computation duration required to train/fine-tune the model to convergence during the Google Colab experimentation phase.',
  },
];
