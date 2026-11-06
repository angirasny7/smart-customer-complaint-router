import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import type {
  BackendHealthResponse,
  ComplaintRecord,
  ModelMetrics,
  PredictRequest,
  PredictResponse,
} from '../types/complaint';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  status?: number;
  isNetworkError: boolean;

  constructor(message: string, status?: number, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Handle API Axios errors uniformly.
 */
function handleAxiosError(error: unknown, defaultMsg: string): never {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: string; message?: string }>;
    if (!axiosErr.response) {
      throw new ApiError(
        `Unable to reach FastAPI backend at ${ENV.API_BASE_URL}. Ensure the backend service is running or toggle Demo Mode.`,
        undefined,
        true
      );
    }
    const message =
      axiosErr.response.data?.detail ||
      axiosErr.response.data?.message ||
      axiosErr.message ||
      defaultMsg;
    throw new ApiError(message, axiosErr.response.status, false);
  }
  throw new ApiError((error as Error)?.message || defaultMsg);
}

/**
 * Check backend health & model readiness.
 * GET /api/v1/health
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  try {
    const response = await apiClient.get<BackendHealthResponse>('/api/v1/health', {
      timeout: 5000,
    });
    return response.data;
  } catch {
    return {
      status: 'offline',
    };
  }
}

/**
 * Submit complaint to backend for model classification.
 * POST /api/v1/predict
 */
export async function predictComplaint(payload: PredictRequest): Promise<PredictResponse> {
  try {
    const response = await apiClient.post<PredictResponse>('/api/v1/predict', payload);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Failed to classify complaint with the selected model.');
  }
}

/**
 * Fetch persistent complaint history from backend database (Protected Admin Endpoint).
 * GET /api/v1/history
 */
export async function fetchComplaintHistory(adminKey?: string): Promise<ComplaintRecord[]> {
  try {
    const headers: Record<string, string> = {};
    if (adminKey) {
      headers['Authorization'] = `Bearer ${adminKey}`;
    }
    const response = await apiClient.get<ComplaintRecord[]>('/api/v1/history', {
      headers,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Failed to retrieve complaint history from backend.');
  }
}

/**
 * Optional endpoint: Fetch loaded model descriptors from backend.
 * GET /api/v1/models
 */
export async function fetchLoadedModels(): Promise<Record<string, ModelMetrics> | null> {
  try {
    const response = await apiClient.get<Record<string, ModelMetrics>>('/api/v1/models');
    return response.data;
  } catch {
    return null;
  }
}
