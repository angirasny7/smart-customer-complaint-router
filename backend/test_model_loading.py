
import joblib
import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Locate model files
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
DISTILBERT_DIR = MODEL_DIR / "distilbert_model"

print("Loading Logistic Regression...")

# Load Logistic Regression package
logistic_package = joblib.load(
    MODEL_DIR / "logistic_regression_model.joblib"
)

vectorizer = logistic_package["vectorizer"]
lr_model = logistic_package["classifier"]

print("Logistic Regression loaded!")
print("Vocabulary size:", len(vectorizer.vocabulary_))
print("Categories:", logistic_package["classes"])

print("\nLoading DistilBERT tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(
    str(DISTILBERT_DIR),
    local_files_only=True
)

print("Tokenizer loaded!")

print("\nLoading DistilBERT model...")

distilbert_model = AutoModelForSequenceClassification.from_pretrained(
    str(DISTILBERT_DIR),
    local_files_only=True
)

distilbert_model.eval()

print("DistilBERT loaded!")
print("Number of labels:", distilbert_model.config.num_labels)
print("Label mapping:", distilbert_model.config.id2label)

# Test a sample complaint
sample = "I have not received my order yet. Can you check its delivery status?"

print("\nTesting predictions...")

# Logistic Regression prediction
vectorized = vectorizer.transform([sample])
lr_probabilities = lr_model.predict_proba(vectorized)[0]

lr_index = lr_probabilities.argmax()
lr_category = lr_model.classes_[lr_index]
lr_confidence = float(lr_probabilities[lr_index])

# DistilBERT prediction
inputs = tokenizer(
    sample,
    return_tensors="pt",
    truncation=True,
    max_length=64
)

with torch.no_grad():
    outputs = distilbert_model(**inputs)

probabilities = torch.softmax(outputs.logits, dim=-1)[0]

bert_index = probabilities.argmax().item()
bert_category = distilbert_model.config.id2label[bert_index]
bert_confidence = probabilities[bert_index].item()

print("\nLOGISTIC REGRESSION")
print("Category:", lr_category)
print("Confidence:", round(lr_confidence, 4))

print("\nDISTILBERT")
print("Category:", bert_category)
print("Confidence:", round(bert_confidence, 4))

print("\nBoth models loaded and inference completed!")
