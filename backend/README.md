# Smart Complaint Router — Backend Service (FastAPI)

FastAPI service powering the machine-learning classification and department routing for the Smart Customer Complaint Router.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.10+ installed
- Git with [Git LFS](https://git-lfs.com/) installed (to clone the DistilBERT model weights)

### 2. Environment Setup
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies (CPU-optimized PyTorch + Transformers + FastAPI)
pip install -r requirements.txt
```

### 3. Run the Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Health check:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- **Interactive OpenAPI Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧠 Machine Learning Models

The backend loads two pre-trained classification models into memory on startup:

| Model | Path | Size | Git Storage | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **DistilBERT** | `models/distilbert_model/` | ~255 MB | **Git LFS** (`*.safetensors`) | 6-layer transformer fine-tuned for 11 customer support intents. 99.85% test accuracy. |
| **Logistic Regression** | `models/logistic_regression_model.joblib` | ~671 KB | Standard Git | Scikit-learn Pipeline (TF-IDF + Logistic Regression). 99.74% test accuracy. |

### Memory Footprint
- Both models are loaded in CPU mode (CUDA is intentionally avoided for lean cloud hosting).
- Total idle RSS (Resident Set Size) memory footprint is **~208 MB**, comfortably below the 512 MB memory limit of free cloud tiers such as Render.

---

## ⚙️ Environment Configuration

Copy the example environment template:
```bash
cp .env.example .env
```

| Variable | Default | Required? | Description |
| :--- | :--- | :---: | :--- |
| `HOST` | `127.0.0.1` | No | Server listen address |
| `PORT` | `8000` | No | Server listen port |
| `CORS_ORIGIN` | `http://localhost:5173` | No | Allowed frontend origin. Supports comma-separated list. Regex allows `*.vercel.app` automatically. |
| `DATABASE_URL` | *(None)* | **No** | Neon PostgreSQL connection string. **If omitted, the backend runs in stateless mode** (predictions succeed; persistence is skipped). |
| `ADMIN_API_KEY` | *(None)* | No | Bearer token required for `GET /api/v1/history` and `POST /api/v1/history/purge`. |
| `COMPLAINT_RETENTION_DAYS` | `90` | No | Number of days to retain records during purge operations. |

> **IMPORTANT:** `DATABASE_URL` is **completely optional**. If it is not set or the database is offline, the public prediction endpoint `POST /api/v1/predict` continues to operate smoothly without interruption.

---

## 🌐 API Endpoints

### 1. `GET /api/v1/health`
Checks server status, database connection, and model loading state.
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

### 2. `POST /api/v1/predict` (Public)
Classifies a customer complaint text and routes it to the designated department.
```json
// Request
{
  "text": "My package has not arrived and tracking stopped updating.",
  "model": "distilbert" // or "logistic_regression"
}

// Response
{
  "success": true,
  "input_text": "My package has not arrived and tracking stopped updating.",
  "predicted_category": "DELIVERY",
  "confidence": 0.9991,
  "model_used": "distilbert",
  "suggested_department": "Delivery Support",
  "urgency": null,
  "explanation": null
}
```

### 3. `GET /api/v1/history` (Admin Authenticated)
Returns paginated prediction history. Requires header `Authorization: Bearer <ADMIN_API_KEY>`.

### 4. `POST /api/v1/history/purge` (Admin Authenticated)
Purges records older than `COMPLAINT_RETENTION_DAYS`. Requires header `Authorization: Bearer <ADMIN_API_KEY>`.

---

## ☁️ Deployment on Render

1. Create a new **Web Service** on Render connected to your repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Environment Variables:
   - `CORS_ORIGIN`: `https://your-frontend-domain.vercel.app`
   - `DATABASE_URL`: *(Optional — add when ready to enable PostgreSQL)*
   - `ADMIN_API_KEY`: *(Optional — secure secret key)*

> **Deploy Notice:** Do NOT add `alembic upgrade head` to the Render start command unless you have provided a valid `DATABASE_URL`, as Alembic will fail to connect if no database exists.
