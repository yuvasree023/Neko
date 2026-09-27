# Momo Journal — Security Model

Momo Journal is built with a zero-trust privacy and security architecture.

## 1. Zero Client-Side Secrets
- The `GEMINI_API_KEY` is **strictly server-side** and never exposed to the frontend browser bundle.
- In production, it is securely mounted via **Google Cloud Secret Manager** directly to the Cloud Run runtime container.

## 2. Strict User Isolation Boundary
- All journal entries are keyed strictly under `/users/{uid}/entries/{entryId}`.
- Every read, write, update, and delete request is authenticated against the user's verified Firebase UID.
- Firestore Security Rules enforce:
  ```
  match /users/{userId}/entries/{entryId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

## 3. Rate Limiting & Abuse Prevention
- Backend routes implement sliding-window rate limiting (`express-rate-limit`) preventing API exhaustion and denial-of-service.
- String inputs are strictly length-capped and sanitized before being processed by Google GenAI.

## 4. Content Security & Privacy
- Journal entries are never used to train global AI models without consent.
- Only the active reflection text or conversation turn is sent to the Gemini endpoint; historical databases are never leaked or batch-transmitted.
