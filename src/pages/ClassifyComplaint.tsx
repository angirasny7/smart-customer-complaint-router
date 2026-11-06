import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { ComplaintForm } from '../components/classification/ComplaintForm';
import { ResultCard } from '../components/classification/ResultCard';
import { ExplanationCard } from '../components/classification/ExplanationCard';
import { UrgencyNotice } from '../components/common/UrgencyNotice';
import type { ModelId, PredictResponse } from '../types/complaint';
import { useApp } from '../context/AppContext';
import { predictComplaint } from '../services/api';
import { getDemoResponse } from '../services/demoData';

export const ClassifyComplaint: React.FC = () => {
  const { isDemoMode, addComplaintRecord } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<PredictResponse | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);

  const handleClassify = async (text: string, model: ModelId) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let result: PredictResponse;

      if (isDemoMode) {
        // Small delay to simulate inference processing
        await new Promise((resolve) => setTimeout(resolve, 400));
        result = getDemoResponse(text, model);
        setIsDemoResult(true);
      } else {
        // Invoke real FastAPI inference endpoint
        result = await predictComplaint({ text, model });
        setIsDemoResult(false);
      }

      setCurrentResult(result);

      // Record prediction in session audit history
      addComplaintRecord({
        id: `rec-${Date.now()}`,
        text: result.input_text,
        category: result.predicted_category,
        model: result.model_used,
        confidence: result.confidence,
        department: result.suggested_department,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isDemoSample: isDemoMode,
        explanation: result.explanation,
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to classify complaint. Please check your backend connection or switch to Demo Mode.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Heading: 28-32px, 700 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A35]">
          Classify a Complaint
        </h2>
        <p className="text-[15px] text-[#475467] mt-1">
          Input customer complaints to evaluate real-time intent classification and automated department routing.
        </p>
      </div>

      {/* Classification Workspace */}
      <Card
        title="Inference Workspace"
        subtitle="Select a model architecture and enter a customer complaint message."
      >
        <ComplaintForm
          onSubmit={handleClassify}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </Card>

      {/* Results View */}
      {currentResult && (
        <div className="space-y-4 animate-fadeIn">
          <ResultCard result={currentResult} isDemoResult={isDemoResult} />
          <ExplanationCard explanation={currentResult.explanation} />
        </div>
      )}

      {/* Urgency Classification Coming Soon Notice */}
      <UrgencyNotice compact />
    </div>
  );
};
