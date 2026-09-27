# Momo Journal — Production Deployment Guide

## 1. Deploying to Google Cloud Run

### Prerequisites
1. Install [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk).
2. Authenticate and set your GCP project:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

### Step 1: Store Secret in Google Cloud Secret Manager
```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secret for Gemini API key
echo -n "your_real_gemini_api_key" | gcloud secrets create GEMINI_API_KEY --data-file=-
```

### Step 2: Build and Deploy Container with Cloud Build
```bash
# Enable Cloud Run and Cloud Build
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Submit build to Google Cloud Build and deploy to Cloud Run
gcloud run deploy momo-journal \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --set-env-vars NODE_ENV=production,PORT=8080
```

## 2. Deploying Firestore Security Rules
```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Login and deploy rules
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules
```
