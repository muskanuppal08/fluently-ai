# 🌐 Fluently-AI
> **Your Intelligent Language Practice Companion & Real-Time AI Translator**

Fluently-AI is a high-fidelity, real-time AI language tutor and translation workspace. Built to help language learners gain confidence, the application bridges real-time translation tools with contextual roleplay practice and active grammar feedback loops. Packaged for desktop browser interfaces and compiled for mobile device wrappers (Android/iOS) via Capacitor.

---

## ✨ Features

### 🎨 Premium Glassmorphism Interface (Module 1)
- **Tailored Aesthetics**: Toggle between a premium dark-mesh workspace and a clean light interface.
- **Customizable Room Accents**: Personalize your learning space with classy desaturated accents (`Violet`, `Emerald`, `Slate`, `Amber`).
- **Interactive Wallpapers**: Swap chat canvas styles (`Classic Mesh`, `Cosmic Nebula`, `Clean Minimalist`) based on your learning mood.
- **Responsive Workspace**: Fully responsive workspace that scales seamlessly from ultra-wide displays to mobile viewports.

### ⚡ Real-Time Streaming Translation (Module 2)
- **Word-by-Word Streaming**: Responses render instantly using Server-Sent Events (SSE), making chats feel snappy and natural.
- **Auto Language Detection**: Enter text in your native language to receive immediate translations, or write in the target language to practice conversational flow.
- **Grammar Feedback Cards**: Dynamic inline overlays detect grammatical errors, present natural phrasing alternatives, and provide deep explanatory rule cards.

### 🎭 Immersive Language Practice Room (Module 3)
- **Situational Roleplay Scenarios**: Choose from active scenarios like **Ordering in a Cafe** ☕, **Hotel Check-in** 🏨, or **Asking for Directions** 🗺️.
- **Dynamic Role-Play Persona**: The AI assumes characters (like a barista or hotel receptionist) in the target language to test your conversational capacity under pressure.

### 💾 Persistent History & Vocab Notebook (Module 4)
- **Database Session Persistence**: Conversations are saved to MongoDB using Mongoose. Users can create new chat sessions or retrieve historical rooms.
- **Vocabulary Bookmarking**: Bookmark useful phrases, translations, and grammar explanations directly from the chat feed into a personal local learning notebook.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite, TS), Tailwind CSS, Lucide Icons |
| **Mobile Shell** | Capacitor (Ionic Native Wrappers) |
| **Backend API** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Streaming** | Server-Sent Events (SSE) |
| **AI Brain** | Mistral AI API (`mistral-tiny`) |

---

## 🚀 Quick Start

### 1. Configure the Backend
First, clone the repository, navigate to the `backend` folder, and configure your API credentials:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` root:
```env
PORT=5001
MISTRAL_API_KEY=your_mistral_api_key_here
MONGODB_URI=mongodb://127.0.0.1:27017/fluently
```
Run the backend server:
```bash
npm run dev
```

### 2. Configure the Frontend
In a new terminal window, navigate to the `frontend` folder, install packages, and spin up the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to start practicing!
