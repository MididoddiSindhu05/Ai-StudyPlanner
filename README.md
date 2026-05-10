# AI Study Planner 🎓

An ultra-modern, full-stack productivity suite for students, powered by Google's Gemini AI. 

## ✨ Features

- **🧠 AI-Generated Study Plans**: Custom schedules based on your subjects, goals, and deadlines.
- **📊 Intelligence Dashboard**: Real-time analytics, productivity scores, and study streak tracking.
- **⏳ Focus Engine**: Premium Pomodoro timer with session management.
- **💬 AI Study Assistant**: Instant help with any subject or study-related query.
- **📈 Progress Analytics**: Subject-wise distribution and weekly efficiency charts.
- **🔒 Secure Auth**: Full authentication system with JWT.

## 🛠️ Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Recharts, Zustand.
- **Backend**: Node.js + Express.
- **Database**: MongoDB (via Mongoose).
- **AI**: Google Gemini API.

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- MongoDB Atlas account (or local MongoDB).
- Gemini API Key.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   MONGO_URI="your_mongodb_uri"
   JWT_SECRET="your_secret_key"
   GEMINI_API_KEY="your_gemini_key"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/server.ts`: Express server and Vite middleware.
- `/server/models/`: Mongoose schemas.
- `/server/routes/`: API endpoints.
- `/src/pages/`: React views (Dashboard, AI Planner, etc.).
- `/src/services/`: API and AI integration layers.
- `/src/store/`: Client-side state management.

## 📝 API Endpoints

- `POST /api/auth/register`: Create new student account.
- `POST /api/auth/login`: Authenticate student.
- `GET /api/tasks`: Fetch student tasks.
- `POST /api/tasks`: Create a new study task.

## 🎨 UI/UX Design

The application uses **Glassmorphism** and High-Contrast dark themes to provide a premium, modern experience. All transitions are powered by Framer Motion for a "fluid" feel.

---
Built with ❤️ for students worldwide.
