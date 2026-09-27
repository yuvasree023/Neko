# 🐾 Momo Journal

> A private, secure, minimalist personal journal with a cute 2D animated companion living inside the interface.

---

## ✨ Key Features

- **🐾 Living Companion (Momo)**:
  - Follows cursor with soft, organic inertia and comfortable leash distance.
  - Sits on cards, walks toward the editor, and runs to celebrate saves (`"YAY!!"` with confetti).
  - Inactivity stages: 10s look around → 20s sit → 40s lie down → 60s sleep (`zzz...`).
  - Wakes up on mouse movement or typing.
  - Expresses 18 distinct states and emotions with short speech bubbles (`"aww..."`, `"oh!"`, `"hmm..."`, `"hehe"`, `"yay!"`).
- **✍️ Distraction-Free Journal Editor**:
  - Auto-saving local drafts, live word count, and formatting shortcuts.
  - Real-time subtle typing reaction & mood analysis.
- **✨ Gemini AI Companion (Optional)**:
  - Slide-over thought partner providing gentle reflections and syncing Momo's mood.
  - Structured JSON schema enforcement with strict privacy boundaries.
- **🔒 Private & Secure by Design**:
  - Google Cloud Secret Manager for server-side `GEMINI_API_KEY`.
  - Strict Firebase UID boundary isolation in Firestore.
  - Zero secrets in client-side bundles.
- **🎨 Cozy Aesthetics**:
  - Warm cream paper light mode & soothing charcoal dark mode.
  - Responsive design with full accessibility and `prefers-reduced-motion` support.

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack dev server
npm run dev
```

Visit `http://localhost:3000` to interact with Momo!

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, Helmet, CORS, Rate Limiter.
- **AI & Cloud**: Google GenAI SDK (Gemini API), Firebase Auth, Cloud Firestore, Cloud Run, Secret Manager.

---

## 📖 Documentation

- [System Architecture](docs/architecture.md)
- [Local Setup Guide](docs/setup.md)
- [Production Deployment](docs/deployment.md)
- [Security & Privacy Model](docs/security.md)
