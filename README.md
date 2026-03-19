# Live Polling App

A real-time interactive polling application that enables teachers to create live polls and receive instant responses from students. Built with React, TypeScript, Node.js, and Socket.IO for seamless real-time communication.

![Live Polling App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black)

## Features

### For Teachers

- **Create Sessions**: Generate unique session codes for students to join
- **Ask Questions**: Create multiple-choice questions with 2-5 options
- **Set Correct Answers**: Mark correct options for automatic grading
- **Real-time Results**: View live voting percentages as students respond
- **Poll History**: Access complete history of questions and results
- **Chat & Messaging**: Communicate with students in real-time
- **Participant Management**: View all participants and kick students if needed

### For Students

- **Easy Join**: Join sessions using a simple session code
- **Answer Questions**: Select and submit answers within time limits
- **Live Feedback**: See results immediately after answering
- **Chat Support**: Send messages to teacher and classmates
- **Clean UI**: Intuitive interface designed for quick responses

### Real-time Features

- Instant question broadcasting
- Live percentage updates
- Real-time chat messaging
- Participant list updates
- Session synchronization across tabs

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Socket.IO Client** - Real-time communication
- **React Router** - Navigation
- **React Toastify** - Notifications
- **Axios** - HTTP requests
- **Tailwind CSS** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety

## Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or Atlas)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd live-polling-app
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Environment Setup

Create a `.env` file in the **root directory**:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Create a `.env` file in the **backend directory**:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/live-polling
```

> **Note**: For MongoDB Atlas, use your connection string:
>
> ```
> MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/live-polling
> ```

## Running the Application

### Development Mode

**Terminal 1 - Frontend:**

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:3000`

### Production Build

**Frontend:**

```bash
npm run build
npm run preview
```

**Backend:**

```bash
cd backend
npm run build
npm start
```

## 📁 Project Structure

```
live-polling-app/
├── src/                      # Frontend source
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx  # Role selection
│   │   ├── TeacherPage.tsx  # Teacher dashboard
│   │   ├── AskQuestion.tsx  # Question view & results
│   │   ├── StudentPage.tsx  # Student join page
│   │   ├── StudentQuePage.tsx # Student answer page
│   │   ├── ChatBox.tsx      # Chat & participants
│   │   ├── PollHistory.tsx  # History view
│   │   └── KickOut.tsx      # Kicked student page
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utilities
│   │   ├── api.ts           # API service
│   │   ├── socketService.ts # Socket connection
│   │   └── socketEvents.ts  # Event types
│   └── App.tsx              # Main app component
│
├── backend/
│   ├── models/              # Mongoose models
│   │   ├── PollSession.model.ts
│   │   ├── Question.model.ts
│   │   ├── Answer.model.ts
│   │   ├── User.model.ts
│   │   └── Message.model.ts
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── socket/              # Socket.IO handlers
│   │   └── socketHandler.ts # Main socket logic
│   └── server.ts            # Express app
│
└── README.md
```

## 🔌 API Endpoints

### Sessions

- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details

### Questions

- `POST /api/questions` - Create question
- `GET /api/questions/session/:sessionId` - Get current question
- `GET /api/questions/session/:sessionId/history` - Get poll history

### Users

- `POST /api/users` - Create user (student/teacher)

## Socket Events

### Client → Server

- `join_session` - Join a polling session
- `new_question` - Teacher asks a question
- `submit_answer` - Student submits answer
- `send_message` - Send chat message
- `student_kicked` - Kick a student (teacher only)

### Server → Client

- `question_asked` - New question broadcast
- `answer_submitted` - Answer confirmation
- `update_results` - Real-time result updates
- `show_results` - Final results
- `new_message` - Chat message broadcast
- `update_participants` - Participant list update

## Usage Flow

### Teacher Flow

1. Visit the app and select "I'm a Teacher"
2. Click "Continue" to create a session
3. Share the session code with students
4. Create a question with options and time limit
5. Mark the correct answer
6. Click "Ask Question" to broadcast
7. Watch real-time results as students answer
8. View poll history anytime

### Student Flow

1. Visit the app and select "I'm a Student"
2. Enter session code and name
3. Click "Continue" to join
4. Wait for teacher to ask a question
5. Select an answer and click "Submit"
6. View results after submitting
7. Wait for next question

## Key Features Explained

### Tab Isolation

Each browser tab maintains its own session using `sessionStorage`, allowing teachers to run multiple sessions simultaneously.

### Late Join Prevention

Students who join after a question is asked will NOT receive that question. They must wait for the next one.

### Real-time Updates

Every time a student answers, all participants see updated percentages instantly via Socket.IO broadcasts.

### Auto-close Questions

Questions automatically close and show final results when all students have answered.

### Chat System

- Teacher messages: Purple background
- Student messages: Black background
- Real-time delivery to all participants

### Kick Functionality

- Only teachers can kick students
- Kicked students see a notification and are redirected
- Automatic cleanup from session and database

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# If using Atlas, verify:
# 1. IP whitelist includes your IP
# 2. Database user credentials are correct
# 3. Connection string is properly formatted
```

### Socket Connection Failed

- Verify backend is running on port 3000
- Check `VITE_BACKEND_URL` in frontend `.env`
- Ensure no firewall blocking WebSocket connections

### Students Can't Join

- Verify session code is correct (case-sensitive)
- Check if backend MongoDB connection is active
- Review browser console for errors

## 📄 Resume Summary

Use the content below as a reference when adding this project to your resume or portfolio.

### One-Line Description

> Built a full-stack real-time live polling web application enabling teachers to broadcast questions and receive instant, live-updated responses from students using WebSockets.

### Resume Bullet Points

- **Architected** a full-stack real-time polling platform using **React 19**, **TypeScript**, **Node.js/Express**, and **Socket.IO**, supporting simultaneous multi-student sessions with sub-second latency.
- **Designed** a **WebSocket event system** (Socket.IO) to broadcast questions, aggregate live answer percentages, and sync participant lists across all connected clients in real time.
- **Implemented** a **role-based dual-interface** (Teacher & Student) with session management using unique session codes stored in MongoDB, enabling isolated multi-session control per browser tab via `sessionStorage`.
- **Built** RESTful API endpoints with **Express** and **Mongoose** for session creation, question management, user registration, and poll history retrieval.
- **Developed** a real-time **chat system** with role-differentiated styling and a **participant management** feature allowing teachers to remove disruptive students, with automatic database cleanup.
- **Integrated** auto-closing poll logic that detects when all students have answered and immediately broadcasts final results, reducing manual teacher overhead.
- **Styled** a fully responsive UI using **Tailwind CSS v4** with toast notifications (**React Toastify**) for seamless user feedback across all interactions.

### Skills Demonstrated

| Category | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.IO (WebSockets) |
| Database | MongoDB, Mongoose ODM |
| HTTP Client | Axios |
| Build/Tooling | Vite, ESLint, tsc |

### Project Highlights for Portfolio

- **Real-time communication** — WebSocket architecture with Socket.IO handles bidirectional events between teachers and multiple students simultaneously.
- **Stateful session management** — `sessionStorage`-based tab isolation lets one teacher manage multiple independent sessions across browser tabs.
- **Full-stack TypeScript** — Shared type discipline across both frontend and backend reduces runtime errors and improves maintainability.
- **Scalable data model** — Normalized MongoDB collections (`PollSession`, `Question`, `Answer`, `User`, `Message`) support complete poll history and per-user tracking.

---

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

Built with modern web technologies to provide a seamless real-time polling experience for educators and students.

---
