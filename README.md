# Smart Customer Complaint Router

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208%20%7C%20Tailwind-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20PyTorch%20%7C%20Transformers-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-black?logo=vercel)](https://vercel.com)

A production-grade, full-stack Natural Language Processing (NLP) system designed to automatically classify customer service complaints into **11 operational categories** and route them to corresponding organizational departments in real time.

The system features two machine-learning inference engines:
1. **Fine-Tuned DistilBERT** (`distilbert-base-uncased`) — Primary Transformer model (**99.85% test accuracy**, **99.86% Macro F1**).
2. **TF-IDF + Logistic Regression** — High-speed, lightweight linear baseline (**99.74% test accuracy**, **99.81% Macro F1**).

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Dataset & Academic ML Context](#-dataset--academic-ml-context)
- [Model Evaluation & Benchmarks](#-model-evaluation--benchmarks)
- [Category-to-Department Routing](#-category-to-department-routing)
- [Scientific & Domain Disclaimers](#-scientific--domain-disclaimers)
- [Directory Structure](#-directory-structure)
- [Local Development Setup](#-local-development-setup)
  - [1. Backend Setup (FastAPI)](#1-backend-setup-fastapi)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [API Reference](#-api-reference)
- [Public Deployment Guide](#-public-deployment-guide)
  - [Backend Deployment (Render)](#backend-deployment-render)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Optional Database (Neon PostgreSQL)](#optional-database-neon-postgresql)
- [Demonstration vs. Live Mode](#-demonstration-vs-live-mode)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🏛️ System Architecture

```text
[ Browser / Client ]
         |
         v
[ React 19 + TypeScript SPA (Vercel) ]
         |
         |  REST API (JSON over HTTPS)
         v
[ FastAPI Python Backend Service (Render) ]
         |
         +---> Model Inference Engine (In-Memory CPU PyTorch / Scikit-Learn)
         |        ├── DistilBERT (Transformers, safetensors via Git LFS)
         |        └── TF-IDF + Logistic Regression (Joblib)
         |
         +---> Optional Persistence Layer (Neon Serverless PostgreSQL via SQLAlchemy 2.0)
                  └── complaints table (UUID, timestamp, category, confidence, department)
```

---

## 📚 Dataset & Academic ML Context

The underlying models were trained and evaluated on the **Bitext Customer Support Dataset**:
- **Total Corpus Size:** 26,872 curated customer queries across 11 intent classes.
- **Data Splits:** 80% Train, 10% Validation, 10% Held-out Test (stratified).
- **Domain Coverage:** Account management, billing, cancellations, delivery issues, orders, payments, refunds, and subscriptions.

### Note on Synthetic Data & High Accuracy
The Bitext corpus is a **synthetic / semi-synthetic template-generated dataset** designed to represent distinct customer intents with minimal noise and high linguistic consistency. Consequently:
- Both linear models and deep transformers achieve near-perfect evaluation metrics (>99.7%).
- Real-world production text with severe misspellings, colloquialisms, or mixed intents may demonstrate lower confidence in out-of-domain scenarios.
- The high benchmark scores accurately reflect performance on this specific benchmark dataset rather than generalized open-domain perfection.

---

## 📊 Model Evaluation & Benchmarks

The models were trained and validated in Google Colab (NVIDIA T4 GPU for DistilBERT, Multi-core CPU for Logistic Regression). Held-out test set performance:

| Metric | DistilBERT (`distilbert-base-uncased`) | TF-IDF + Logistic Regression | Selection Decision |
| :--- | :---: | :---: | :--- |
| **Model Type** | Transformer-based Deep Learning | Linear Classification Baseline | **DistilBERT: Primary Engine** |
| **Test Accuracy** | **99.85%** | 99.74% | DistilBERT (+0.11%) |
| **Macro Precision** | 99.85% | **99.86%** | Balanced across all classes |
| **Macro Recall** | **99.88%** | 99.76% | DistilBERT catches 3 fewer errors |
| **Macro F1-Score** | **99.86%** | 99.81% | Academic primary metric |
| **Misclassified (Test Split)** | **4 samples** (out of 2,688) | 7 samples (out of 2,688) | Minimal error surface |
| **Training Duration** | 193.30s (~3.2 mins) | **5.65s** | Logistic Regression is 34x faster |
| **Feature Representation** | 768 hidden dimensions, WordPiece (64 tokens max) | 5,202 unigram/bigram features, sublinear TF-IDF | DistilBERT handles contextual nuance |
| **Weights Footprint** | ~255 MB (`model.safetensors`) | ~671 KB (`.joblib`) | LFS for DistilBERT, normal git for LR |
| **Memory Footprint (RSS)** | ~180 MB | ~28 MB | Total service: ~208 MB on CPU |

---

## 🏢 Category-to-Department Routing

Predictions map directly to specialized business units using a deterministic routing table:

| Category ID | Display Name | Target Department | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| `ACCOUNT` | Account | **Account Support** | Credentials, profile settings, 2FA, data export |
| `CANCEL` | Cancellation | **Cancellation Support** | Service termination, contract closures, retention |
| `CONTACT` | Contact & Support | **Customer Relations** | General escalations, corporate contacts, inquiries |
| `DELIVERY` | Delivery | **Delivery Support** | Courier dispatch, transit delays, package tracking |
| `FEEDBACK` | Feedback | **Customer Feedback Team** | Voice of Customer, survey responses, reviews |
| `INVOICE` | Invoice | **Billing Support** | Tax documentation, statement copies, breakdowns |
| `ORDER` | Order | **Order Management** | Item modifications, cart inquiries, fulfillment |
| `PAYMENT` | Payment | **Payment Support** | Gateway issues, card declines, charge disputes |
| `REFUND` | Refund | **Refund Support** | Reimbursement claims, policy terms, credit slips |
| `SHIPPING` | Shipping | **Shipping Support** | Address changes, customs clearance, freight routing |
| `SUBSCRIPTION` | Subscription | **Subscription Support** | Tier upgrades, recurring renewals, billing pauses |

---

## ⚠️ Scientific & Domain Disclaimers

### 1. Urgency Classification
- **Current Status:** Explicitly **not implemented** (`urgency: null`).
- **Academic Reason:** The Bitext corpus does **not** contain ground-truth urgency, severity, or priority labels.
- **Integrity Rule:** Urgency is never synthesized using arbitrary keyword heuristics or sentiment scores. The schema is forward-compatible to receive multi-task urgency heads when an annotated dataset is introduced.

### 2. Department Mapping
- Department routing is a **proposed operational mapping ontology**, not a distinct classifier. The ML model predicts the operational category (`predicted_category`), and the application maps this to the responsible department (`suggested_department`).

---

## 📁 Directory Structure

```text
Smart Complaint Router/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings, CORS, department maps, DB URL
│   │   ├── database.py            # SQLAlchemy engine, session maker, DB ping
│   │   ├── main.py                # FastAPI endpoints, CORS, exception handlers
│   │   ├── model_loader.py        # Safe CPU loading of DistilBERT & Logistic Regression
│   │   ├── models_db.py           # ComplaintRecord SQLAlchemy ORM model
│   │   ├── predictor.py           # Text preprocessor, inference runner, routing
│   │   └── schemas.py             # Pydantic v2 schemas for requests & responses
│   ├── migrations/                # Alembic schema migration versions
│   │   ├── env.py
│   │   └── versions/
│   ├── models/
│   │   ├── distilbert_model/      # DistilBERT weights, config, tokenizer
│   │   │   ├── config.json
│   │   │   ├── model.safetensors  # (Tracked via Git LFS - 255.45 MB)
│   │   │   ├── tokenizer.json
│   │   │   └── vocab.txt
│   │   ├── logistic_regression_model.joblib # LR pipeline (671 KB)
│   │   └── model_metadata.json    # Versioning & Colab metrics
│   ├── .env.example               # Backend environment variables template
│   ├── alembic.ini                # Alembic database configuration
│   ├── README.md                  # Dedicated backend documentation
│   ├── requirements.txt           # Python dependencies (CPU PyTorch)
│   └── test_database.py           # Comprehensive integration & fallback test suite
├── src/
│   ├── components/                # Reusable UI components (Cards, Tables, KPI grids)
│   ├── config/                    # Category definitions, departments, metrics
│   ├── context/                   # Global state (Demo Mode, Backend health, history)
│   ├── pages/                     # Dashboard, Classify, History, Model Info, About
│   ├── services/                  # Axios API client & mock demo datasets
│   ├── types/                     # TypeScript data interfaces
│   ├── App.tsx                    # Route definitions
│   ├── index.css                  # Tailwind CSS v4 styling
│   └── main.tsx                   # React root entrypoint
├── .env.example                   # Frontend environment variables template
├── .gitattributes                 # Git LFS tracking rules (*.safetensors)
├── .gitignore                     # Production ignore rules
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript compiler options
├── vercel.json                    # Vercel SPA routing rewrite rule
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🛠️ Local Development Setup

### 1. Backend Setup (FastAPI)

Prerequisites: Python 3.10+ and Git LFS.

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies (CPU PyTorch + FastAPI + Transformers)
pip install -r requirements.txt

# (Optional) Copy environment template
cp .env.example .env

# Launch FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify backend health at: `http://127.0.0.1:8000/api/v1/health`  
Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

> **Note:** The backend operates fully even without a database. Predictions will compute and return instantly with database storage gracefully bypassed.

### 2. Frontend Setup (React + Vite)

Prerequisites: Node.js 18+.

```bash
# Return to repository root
cd ..

# Install frontend dependencies
npm install

# (Optional) Configure environment
# Defaults to http://127.0.0.1:8000 if VITE_API_BASE_URL is not set
cp .env.example .env

# Start Vite development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 🔌 API Reference

### Health Check
- **`GET /api/v1/health`**
  - **Description:** Verifies service uptime, database connectivity, and loaded model availability.
  - **Response:**
    ```json
    {
      "status": "healthy",
      "database_connected": false,
      "models_loaded": {
        "distilbert": true,
        "logistic_regression": true
      },
      "active_models": ["distilbert", "logistic_regression"]
    }
    ```

### Classify Complaint
- **`POST /api/v1/predict`**
  - **Description:** Publicly accessible endpoint to classify a complaint and determine its routing department.
  - **Request Body:**
    ```json
    {
      "text": "I was charged twice on my invoice for this month's plan.",
      "model": "distilbert"
    }
    ```
  - **Response Body:**
    ```json
    {
      "success": true,
      "input_text": "I was charged twice on my invoice for this month's plan.",
      "predicted_category": "INVOICE",
      "confidence": 0.9984,
      "model_used": "distilbert",
      "suggested_department": "Billing Support",
      "urgency": null,
      "explanation": null
    }
    ```

### Complaint History (Admin Only)
- **`GET /api/v1/history?page=1&limit=20`**
  - **Description:** Paginated database audit log. Protected by `Authorization: Bearer <ADMIN_API_KEY>`.

### Purge History (Admin Only)
- **`POST /api/v1/history/purge`**
  - **Description:** Purges records older than `COMPLAINT_RETENTION_DAYS`. Requires Admin Bearer token.

---

## 🚀 Public Deployment Guide

### Backend Deployment (Render)

1. **Push your code to GitHub** (ensure `model.safetensors` is uploaded via Git LFS).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name:** `smart-complaint-router-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free (512 MB RAM is sufficient; active footprint is ~208 MB)
5. Add Environment Variables:
   - `PYTHON_VERSION`: `3.10.9` (or `3.10.12`)
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app`
   - `DATABASE_URL`: *(Optional — Neon PostgreSQL connection string)*
   - `ADMIN_API_KEY`: *(Optional — secure random string)*
6. Click **Create Web Service**.

### Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure the Project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (repository root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://smart-complaint-router-api.onrender.com` (your Render service URL)
5. Click **Deploy**. Single Page App (SPA) routes are automatically handled by the included `vercel.json`.

### Optional Database (Neon PostgreSQL)

1. Create a free serverless PostgreSQL database at [Neon.tech](https://neon.tech).
2. Copy the pooled connection string (`postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).
3. Set the `DATABASE_URL` environment variable on Render.
4. Run Alembic migrations once locally or via Render build script:
   ```bash
   alembic upgrade head
   ```

---

## 🧪 Demonstration vs. Live Mode

The web application includes an integrated **Demo / Live toggle** in the upper-right corner:
- **Live Mode:** Dispatches actual HTTP POST calls to the FastAPI backend. Displays real-time model inference confidence and routing decisions.
- **Demo Mode:** Operates client-side using deterministic evaluation presets for instant demonstration, offline usage, and classroom walkthroughs.

---

## 📄 License & Acknowledgments

- **Dataset:** [Bitext Customer Support Dataset](https://github.com/bitext/customer-support-dataset)
- **Base Transformer:** Hugging Face `distilbert-base-uncased`
- **License:** Open-source under the [MIT License](LICENSE).
