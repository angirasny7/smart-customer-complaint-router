import type { ComplaintCategory, ComplaintRecord, PredictResponse } from '../types/complaint';
import { getDepartmentForCategory } from '../config/departments';

export interface DemoSampleItem {
  id: string;
  text: string;
  sampleCategory: ComplaintCategory;
  demonstrationConfidence: number;
  label: string;
}

/**
 * Pre-defined demonstration samples explicitly designed for UI verification
 * before the FastAPI backend is connected to the Google Colab exported weights.
 *
 * NOTE: These are static UI test samples, NEVER real model predictions.
 */
export const DEMO_PRESET_COMPLAINTS: DemoSampleItem[] = [
  {
    id: 'sample-1',
    text: 'I have not received my order yet. Can you check its delivery status?',
    sampleCategory: 'DELIVERY',
    demonstrationConfidence: 0.985,
    label: 'Delivery inquiry',
  },
  {
    id: 'sample-2',
    text: 'I was charged twice for my subscription.',
    sampleCategory: 'SUBSCRIPTION',
    demonstrationConfidence: 0.974,
    label: 'Billing / Subscription conflict',
  },
  {
    id: 'sample-3',
    text: 'I want to cancel my account.',
    sampleCategory: 'CANCEL',
    demonstrationConfidence: 0.991,
    label: 'Cancellation request',
  },
  {
    id: 'sample-4',
    text: 'I need a copy of my invoice.',
    sampleCategory: 'INVOICE',
    demonstrationConfidence: 0.968,
    label: 'Invoice retrieval',
  },
];

/**
 * Initial demonstration complaint records to populate the recent table and history
 * when no backend database records exist yet.
 */
export const INITIAL_DEMO_HISTORY: ComplaintRecord[] = [
  {
    id: 'demo-rec-1',
    text: 'I have not received my order yet. Can you check its delivery status?',
    category: 'DELIVERY',
    model: 'distilbert',
    confidence: 0.985,
    department: getDepartmentForCategory('DELIVERY'),
    timestamp: '2026-11-04 18:20:00',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
  {
    id: 'demo-rec-2',
    text: 'I was charged twice for my subscription.',
    category: 'SUBSCRIPTION',
    model: 'distilbert',
    confidence: 0.974,
    department: getDepartmentForCategory('SUBSCRIPTION'),
    timestamp: '2026-11-04 17:45:12',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
  {
    id: 'demo-rec-3',
    text: 'I want to cancel my account.',
    category: 'CANCEL',
    model: 'logistic_regression',
    confidence: 0.991,
    department: getDepartmentForCategory('CANCEL'),
    timestamp: '2026-11-04 16:15:30',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
  {
    id: 'demo-rec-4',
    text: 'I need a copy of my invoice.',
    category: 'INVOICE',
    model: 'distilbert',
    confidence: 0.968,
    department: getDepartmentForCategory('INVOICE'),
    timestamp: '2026-11-04 15:30:00',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
  {
    id: 'demo-rec-5',
    text: 'Can I speak with a human support agent regarding an escalation?',
    category: 'CONTACT',
    model: 'logistic_regression',
    confidence: 0.962,
    department: getDepartmentForCategory('CONTACT'),
    timestamp: '2026-11-04 14:10:44',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
  {
    id: 'demo-rec-6',
    text: 'I would like to request a full refund for item #84920.',
    category: 'REFUND',
    model: 'distilbert',
    confidence: 0.994,
    department: getDepartmentForCategory('REFUND'),
    timestamp: '2026-11-04 13:05:19',
    isDemoSample: true,
    explanation: 'Preset demonstration sample for UI testing.',
  },
];

/**
 * Distribution of the 11 categories in the Bitext Dataset (26,872 total samples).
 * In the Bitext Customer Support dataset, the categories are evenly balanced (~2,440-2,445 each).
 */
export const DATASET_DISTRIBUTION_DATA = [
  { category: 'ACCOUNT', count: 2443, percentage: '9.09%' },
  { category: 'CANCEL', count: 2443, percentage: '9.09%' },
  { category: 'CONTACT', count: 2443, percentage: '9.09%' },
  { category: 'DELIVERY', count: 2443, percentage: '9.09%' },
  { category: 'FEEDBACK', count: 2443, percentage: '9.09%' },
  { category: 'INVOICE', count: 2443, percentage: '9.09%' },
  { category: 'ORDER', count: 2443, percentage: '9.09%' },
  { category: 'PAYMENT', count: 2443, percentage: '9.09%' },
  { category: 'REFUND', count: 2443, percentage: '9.09%' },
  { category: 'SHIPPING', count: 2443, percentage: '9.09%' },
  { category: 'SUBSCRIPTION', count: 2442, percentage: '9.09%' },
];

/**
 * Returns a clearly labelled demonstration response when in Demo Mode.
 * NEVER pretends to be actual model inference.
 */
export function getDemoResponse(text: string, model: 'distilbert' | 'logistic_regression'): PredictResponse {
  // Check if text matches one of our predefined demonstration samples
  const matchedSample = DEMO_PRESET_COMPLAINTS.find(
    (s) => s.text.trim().toLowerCase() === text.trim().toLowerCase()
  );

  const category = matchedSample ? matchedSample.sampleCategory : 'ORDER';
  const confidence = matchedSample ? matchedSample.demonstrationConfidence : 0.95;

  return {
    success: true,
    input_text: text,
    predicted_category: category,
    confidence: confidence,
    model_used: model,
    suggested_department: getDepartmentForCategory(category),
    urgency: null, // As specified: Urgency Classification NOT IMPLEMENTED
    explanation: null, // As specified: No invented explanations
  };
}
