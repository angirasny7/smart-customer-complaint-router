/**
 * Environment configuration for the Smart Customer Complaint Router frontend.
 */
export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000',
  APP_NAME: 'Smart Customer Complaint Router',
  APP_VERSION: '1.0.0',
  DATASET_NAME: 'Bitext Customer Support LLM Chatbot Training Dataset',
  DATASET_HUGGINGFACE_ID: 'bitext/Bitext-customer-support-llm-chatbot-training-dataset',
  DATASET_TOTAL_RECORDS: 26872,
  TOTAL_CATEGORIES: 11,
};
