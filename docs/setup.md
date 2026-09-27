# Momo Journal — Local Setup Guide

Follow these steps to run Momo Journal locally.

## Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm**: v9+

## 1. Clone & Install Dependencies
```bash
npm install
```

## 2. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Option A: Instant Zero-Config Mode (Default)
If you leave `.env` empty, Momo Journal will automatically start in **Demo / Offline Mode**:
- Full companion animations, cursor physics, and sleep stages work out of the box.
- Smart simulated AI provides instant empathetic reactions to journal text.
- Journal entries and settings are persisted locally with user-isolation.

### Option B: Live Gemini AI & Firebase Setup
To connect real Gemini AI and Firebase:
1. **Gemini API Key**:
   - Get an API key from [Google AI Studio](https://aistudio.google.com/).
   - Add to `.env`:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

2. **Firebase Auth & Firestore**:
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Google & Email/Password providers).
   - Create a **Cloud Firestore** database.
   - Deploy security rules (`firebase deploy --only firestore:rules`).
   - Add frontend config to `.env`:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
   - (Optional for backend token verification) Add service account details:
     ```env
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_CLIENT_EMAIL=your_service_account_email
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
     ```

## 3. Run the Development Server
```bash
npm run dev
```
- Client runs at `http://localhost:3000`
- Express API server runs at `http://localhost:5000`

## 4. Build for Production
```bash
npm run build
```
