# Smart Customer Complaint Router

**An End-to-End Machine Learning and NLP System for Automated Customer Complaint Classification**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6.svg)](https://www.typescriptlang.org/)
[![Machine Learning](https://img.shields.io/badge/Domain-Machine%20Learning-orange.svg)]()

## Overview

Smart Customer Complaint Router is a full-stack Machine Learning application that automatically classifies customer complaints into 11 predefined categories using Natural Language Processing (NLP).

Customer support teams receive complaints related to orders, payments, refunds, deliveries, subscriptions, account management, and other services. Manually identifying and categorizing every complaint can be time-consuming.

This project addresses that problem by developing an intelligent classification system that analyzes customer messages and predicts the most appropriate complaint category.

Two Machine Learning approaches are implemented and compared:

1. **DistilBERT** – A fine-tuned transformer-based deep learning model.
2. **TF-IDF + Logistic Regression** – A traditional Machine Learning classification model.

Both trained models are integrated into a web application using React and FastAPI. Users can submit a complaint, select a model, and receive a predicted category, confidence score, and suggested support department.

## Key Features

- Automated classification of customer complaint messages.
- 11 predefined complaint categories.
- Two selectable Machine Learning models.
- Comparison of traditional Machine Learning and transformer-based approaches.
- Confidence score for each prediction.
- Suggested department based on the predicted category.
- Interactive dashboard with model evaluation metrics.
- Complaint classification interface.
- Model information and performance comparison.
- Demo Mode for offline interface demonstrations.
- Live Mode for predictions using the actual trained models.
- Optional database integration for storing complaint history.

## System Architecture

The application follows a frontend-backend architecture.

```text
                    USER
                      |
                      v
          React + TypeScript Frontend
                      |
                      | REST API (JSON)
                      |
                      v
               FastAPI Backend
                      |
                      v
             Model Selection
                      |
             +--------+--------+
             |                 |
             v                 v
       Logistic Regression   DistilBERT
             |                 |
        TF-IDF Features    Tokenization
             |                 |
             v                 v
        Category Prediction
                      |
                      v
              Department Mapping
                      |
                      v
           Prediction Response
                      |
                      v
              Frontend Display
```

### Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn, PyTorch |
| NLP | Hugging Face Transformers |
| Traditional ML | TF-IDF, Logistic Regression |
| Deep Learning | DistilBERT |
| Model Storage | Joblib, Safetensors |
| API Communication | REST API, Axios |
| Database (Optional) | PostgreSQL, SQLAlchemy |
| Database Migrations | Alembic |
| Development | Google Colab, VS Code, Git, GitHub |

---

## Dataset Description

The models were trained and evaluated using the **[Bitext Customer Support LLM Chatbot Training Dataset](https://huggingface.co/datasets/bitext/Bitext-customer-support-llm-chatbot-training-dataset)** available on Hugging Face.

### Dataset Overview

| Property | Details |
|---|---|
| Total Records | 26,872 |
| Total Columns | 5 |
| Input Feature | Customer complaint text (`instruction`) |
| Target Variable | `category` |
| Number of Categories | 11 |
| Number of Intents | 27 |

### Dataset Columns

| Column | Description |
|---|---|
| `flags` | Linguistic characteristics associated with the message |
| `instruction` | Customer's message or request |
| `category` | Broad complaint category |
| `intent` | More specific customer intent |
| `response` | Corresponding customer-service response |

The `instruction` column is used as the model input, while `category` is used as the classification target.

The `response` column is not used as an input feature.

### Complaint Categories

The classification system predicts one of the following 11 categories:

| Category | Description |
|---|---|
| ACCOUNT | Account access and account-related issues |
| CANCEL | Cancellation requests |
| CONTACT | Contact and customer support inquiries |
| DELIVERY | Delivery-related problems |
| FEEDBACK | Customer feedback |
| INVOICE | Invoice and billing documentation |
| ORDER | Order-related issues |
| PAYMENT | Payment-related problems |
| REFUND | Refund requests |
| SHIPPING | Shipping-related problems |
| SUBSCRIPTION | Subscription-related issues |

---

## Data Preprocessing and Exploratory Data Analysis

Before training the models, exploratory data analysis and preprocessing were performed.

The major steps included:

1. Inspecting the dataset structure and feature columns.
2. Checking missing values and duplicate records.
3. Normalizing complaint text by converting it to lowercase and standardizing whitespace.
4. Analyzing category distribution.
5. Examining complaint message lengths.
6. Analyzing linguistic flags and message characteristics.
7. Preparing training, validation, and testing datasets.

### Dataset Statistics

- Total records: 26,872
- Unique normalized messages: 24,274
- Average complaint length: 8.69 words
- Median complaint length: 9 words
- Minimum complaint length: 1 word
- Maximum complaint length: 16 words

### Data Splitting and Leakage Prevention

A group-aware stratified splitting approach using `StratifiedGroupKFold` was used to prevent identical normalized complaint messages from appearing across different data splits.

This is important because duplicate messages across training and testing datasets can cause data leakage and lead to overly optimistic evaluation results.

The final dataset distribution was:

| Dataset Split | Records | Percentage |
|---|---:|---:|
| Training | 21,515 | 80.06% |
| Validation | 2,675 | 9.95% |
| Testing | 2,682 | 9.98% |
| **Total** | **26,872** | **100%** |

The test dataset was kept separate from training and model-selection activities and was used for final performance evaluation.

---

## Machine Learning Models

Two different classification approaches were implemented to compare traditional Machine Learning with transformer-based deep learning.

### 1. TF-IDF + Logistic Regression

The first model uses Term Frequency–Inverse Document Frequency (TF-IDF) for text representation and Logistic Regression for classification.

**TF-IDF**

TF-IDF converts text into numerical feature vectors by assigning importance scores to words based on their frequency in a document and across the document collection.

Configuration:

| Parameter | Value |
|---|---|
| Lowercase | True |
| N-gram Range | (1, 2) |
| Minimum Document Frequency | 2 |
| Maximum Features | 50,000 |
| Sublinear TF | True |
| Actual Vocabulary Size | 5,202 |

**Logistic Regression**

The numerical TF-IDF features are passed to a Logistic Regression classifier, which learns patterns associated with the 11 complaint categories.

Configuration:

| Parameter | Value |
|---|---|
| Maximum Iterations | 1,000 |
| Random State | 42 |

This model serves as the traditional Machine Learning baseline.

### 2. DistilBERT

The second model uses DistilBERT, a smaller and computationally more efficient version of BERT based on transformer architecture.

Unlike traditional text representations that primarily use word-frequency information, transformer models learn contextual representations of text.

The pretrained checkpoint `distilbert-base-uncased` was fine-tuned on the customer complaint dataset for the 11-category classification task.

**Training Configuration**

| Parameter | Value |
|---|---|
| Base Model | distilbert-base-uncased |
| Maximum Sequence Length | 64 |
| Epochs | 3 |
| Batch Size | 16 |
| Evaluation Batch Size | 32 |
| Learning Rate | 2e-5 |
| Weight Decay | 0.01 |
| Optimizer | AdamW |
| Random Seed | 42 |
| Training Environment | Google Colab |
| GPU | NVIDIA Tesla T4 |

DistilBERT uses contextual information from the input sentence to predict the appropriate complaint category.

---

## Model Evaluation and Performance Comparison

Both models were evaluated using the same held-out test dataset containing 2,682 complaint messages.

The following metrics were used:

- **Accuracy:** Overall percentage of correctly classified messages.
- **Precision:** Proportion of predicted category assignments that are correct.
- **Recall:** Proportion of actual category samples correctly identified.
- **F1-score:** Harmonic mean of precision and recall.
- **Macro Average:** Calculates the metric for every category independently and gives each category equal importance.

### Final Test Results

| Metric | DistilBERT | Logistic Regression |
|---|---:|---:|
| Accuracy | **99.85%** | 99.74% |
| Macro Precision | 99.85% | **99.86%** |
| Macro Recall | **99.88%** | 99.76% |
| Macro F1-score | **99.86%** | 99.81% |
| Misclassified Samples | **4** | 7 |
| Training Time | 193.30 sec | **5.65 sec** |

### Observations

1. Both models achieved very high classification performance on the held-out test dataset.
2. DistilBERT achieved slightly higher accuracy, macro recall, and macro F1-score.
3. Logistic Regression achieved marginally higher macro precision.
4. Logistic Regression required significantly less training time.
5. DistilBERT demonstrated a small improvement in overall test performance at a higher computational cost.

The difference in accuracy between the two models is 0.11 percentage points. Therefore, the results indicate that both approaches performed strongly on this dataset, rather than showing a dramatic performance advantage for one model.

---

## Category-to-Department Mapping

After predicting the complaint category, the application maps it to a suggested support department using a predefined mapping.

This mapping is application logic and is not a separate department classifier trained on the dataset.

| Predicted Category | Suggested Department |
|---|---|
| ACCOUNT | Account Support |
| CANCEL | Cancellation Support |
| CONTACT | Customer Relations |
| DELIVERY | Delivery Support |
| FEEDBACK | Customer Feedback Team |
| INVOICE | Billing Support |
| ORDER | Order Management |
| PAYMENT | Payment Support |
| REFUND | Refund Support |
| SHIPPING | Shipping Support |
| SUBSCRIPTION | Subscription Support |

The purpose of this mapping is to demonstrate how the predicted complaint category can support a practical customer-service workflow.

---

## Application Screens and Functionality

The web application provides the following interfaces:

### 1. Dashboard

Provides an overview of the project, model performance metrics, and complaint category distribution.

### 2. Classify Complaint

Allows users to:

- Enter a customer complaint.
- Select DistilBERT or Logistic Regression.
- Submit the complaint for classification.
- View the predicted category.
- View the model confidence score.
- View the suggested support department.

### 3. Complaint History

Provides an interface for viewing previously recorded complaint predictions when database functionality is configured.

### 4. Model Information

Displays information about the two implemented models, their architectures, evaluation metrics, and comparison.

### 5. About Project

Provides an overview of the project, its objectives, technologies, and dataset.

### Demo Mode and Live Mode

The application supports two operating modes.

**Live Mode**

- Sends actual HTTP requests to the FastAPI backend.
- Uses the saved trained Logistic Regression or DistilBERT model.
- Returns model predictions and confidence scores.

**Demo Mode**

- Displays illustrative sample predictions.
- Allows the interface to be explored without requiring a running backend.
- Is intended for offline demonstrations and interface evaluation.

Demo Mode outputs should not be interpreted as actual live model inference.

---

## Project Directory Structure

```text
Smart Customer Complaint Router/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── model_loader.py
│   │   ├── models.py
│   │   └── predictor.py
│   │
│   ├── alembic/
│   │   └── versions/
│   │       └── 001_create_complaints_table.py
│   │
│   ├── models/
│   │   ├── distilbert_model/
│   │   │   ├── config.json
│   │   │   ├── model.safetensors
│   │   │   ├── tokenizer.json
│   │   │   ├── tokenizer_config.json
│   │   │   └── training_args.bin
│   │   │
│   │   ├── logistic_regression_model.joblib
│   │   └── model_metadata.json
│   │
│   ├── .env.example
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── README.md
│   ├── test_database.py
│   └── test_model_loading.py
│
├── public/
│
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitattributes
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── README.md
```

---

## Local Installation and Setup

The project can be run locally using the trained model artifacts included in the repository.

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git
- Git LFS

### 1. Clone the Repository

```bash
git clone https://github.com/angirasny7/smart-customer-complaint-router.git

cd smart-customer-complaint-router
```

If Git LFS is not installed:

```bash
git lfs install
git lfs pull
```

This downloads the large DistilBERT model weights tracked through Git LFS.

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

- API Base URL: http://127.0.0.1:8000
- Swagger Documentation: http://127.0.0.1:8000/docs
- Health Check: http://127.0.0.1:8000/api/v1/health

### 3. Frontend Setup

Open a second terminal and return to the repository root:

```bash
cd ..
```

Install the frontend dependencies:

```bash
npm install
```

Create the frontend environment file if needed:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The frontend environment variable should point to the local backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open the application:

http://localhost:5173/

**Important:** Keep both the frontend and backend terminals running while using Live Mode.

---

## API Reference

The backend exposes REST API endpoints using FastAPI.

### Health Check

**Endpoint:**

```http
GET /api/v1/health
```

Checks backend availability, model loading status, and database connectivity.

### Complaint Prediction

**Endpoint:**

```http
POST /api/v1/predict
```

**Request:**

```json
{
  "text": "I have not received my order yet. Can you check its delivery status?",
  "model": "distilbert"
}
```

The supported model identifiers are:

- `distilbert`
- `logistic_regression`

**Example Response:**

```json
{
  "success": true,
  "input_text": "I have not received my order yet. Can you check its delivery status?",
  "predicted_category": "DELIVERY",
  "confidence": 0.9994,
  "model_used": "distilbert",
  "suggested_department": "Delivery Support",
  "urgency": null,
  "explanation": null
}
```

The confidence value is model-specific and should not automatically be interpreted as a calibrated probability.

### Complaint History

Optional database-backed history endpoints:

```http
GET /api/v1/history?page=1&limit=20
```

Protected by administrator authentication.

### Purge Complaint History

```http
POST /api/v1/history/purge
```

Protected by administrator authentication and governed by the configured retention policy.

---

## Scientific and Domain Limitations

Transparency about dataset characteristics and model limitations is important.

### 1. Dataset Characteristics

The Bitext dataset is a curated customer-support dataset with synthetic or semi-synthetic template-generated examples.

Its high linguistic consistency and relatively distinct category patterns contribute to the high test scores.

Consequently, the reported results demonstrate performance on this particular dataset and do not guarantee identical performance on naturally occurring customer complaints.

External evaluation using real-world complaint data is necessary to assess generalization.

### 2. Urgency Classification

Urgency classification is not implemented.

The dataset does not contain ground-truth urgency, severity, or priority labels.

Therefore, urgency is not artificially inferred using keyword rules or sentiment scores.

The current prediction response returns:

```json
{
  "urgency": null
}
```

Implementing urgency classification requires a separately annotated dataset with appropriate urgency labels.

### 3. Department Mapping

The model predicts one of the 11 complaint categories.

The suggested department is obtained through a predefined mapping in the application.

It is not an independently trained department prediction model.

### 4. Confidence Scores

The confidence score represents the selected model's output for its predicted category.

Confidence values from Logistic Regression and DistilBERT are model-specific and should not be directly compared as calibrated probabilities.

---

## Future Enhancements

Possible future improvements include:

- Training an urgency classification model using properly annotated data.
- Evaluating the models on real-world customer complaint datasets.
- Supporting multilingual complaint classification.
- Improving robustness to spelling mistakes and colloquial language.
- Introducing confidence thresholds and manual-review workflows.
- Adding explainability to help understand model predictions.
- Integrating with real customer-support and ticket-management systems.
- Deploying the application as a publicly accessible service.

---

## Project Acknowledgments

**Dataset:** [Bitext Customer Support LLM Chatbot Training Dataset](https://huggingface.co/datasets/bitext/Bitext-customer-support-llm-chatbot-training-dataset)

**Pretrained Transformer:** [distilbert-base-uncased](https://huggingface.co/distilbert/distilbert-base-uncased)

**Machine Learning Frameworks:** Scikit-learn, PyTorch, Hugging Face Transformers.

**Development Tools:** Google Colab, Visual Studio Code, Git, and GitHub.

---

## Author
Angira Yadav

**Smart Customer Complaint Router**

Developed as an academic Machine Learning and Natural Language Processing project.

GitHub Repository: https://github.com/angirasny7/smart-customer-complaint-router
