export type ComplaintCategory =
  | 'ACCOUNT'
  | 'CANCEL'
  | 'CONTACT'
  | 'DELIVERY'
  | 'FEEDBACK'
  | 'INVOICE'
  | 'ORDER'
  | 'PAYMENT'
  | 'REFUND'
  | 'SHIPPING'
  | 'SUBSCRIPTION';

export type ModelId = 'distilbert' | 'logistic_regression';

export interface PredictRequest {
  text: string;
  model: ModelId;
}

export interface PredictResponse {
  success: boolean;
  input_text: string;
  predicted_category: ComplaintCategory | string;
  confidence: number;
  model_used: ModelId | string;
  suggested_department: string;
  urgency: string | null;
  explanation: string | null;
}

export interface ComplaintRecord {
  id: string;
  text: string;
  category: ComplaintCategory | string;
  model: ModelId | string;
  confidence: number;
  department: string;
  timestamp: string;
  isDemoSample?: boolean;
  explanation?: string | null;
  urgency?: string | null;
}

export interface CategoryInfo {
  id: ComplaintCategory;
  name: string;
  description: string;
  department: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface ModelMetrics {
  name: string;
  id: ModelId;
  type: string;
  accuracy: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  misclassifiedSamples: number;
  trainingTimeSec: number;
  vocabularySize?: number;
  ngramRange?: string;
  checkpoint?: string;
  maxSeqLength?: number;
  description: string;
  isRecommended: boolean;
  badge: string;
}

export interface BackendHealthResponse {
  status: 'online' | 'offline' | 'degraded';
  version?: string;
  models_loaded?: string[];
  timestamp?: string;
  database?: string;
}
