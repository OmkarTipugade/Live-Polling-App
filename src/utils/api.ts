const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// API Service for backend communication
export const api = {
    // Poll Session APIs
    async createSession(teacherName: string) {
        const response = await fetch(`${BACKEND_URL}/api/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacherName })
        });
        if (!response.ok) throw new Error("Failed to create session");
        return response.json();
    },

    async joinSession(sessionId: string, name: string) {
        const response = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error("Failed to join session");
        return response.json();
    },

    async kickStudent(sessionId: string, studentId: string) {
        const response = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/students/${studentId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to kick student");
        return response.json();
    },

    // Question APIs
    async createQuestion(sessionId: string, text: string, options: string[], timeLimit: number) {
        const response = await fetch(`${BACKEND_URL}/api/questions/${sessionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, options, timeLimit })
        });
        if (!response.ok) throw new Error("Failed to create question");
        return response.json();
    },

    async getCurrentQuestion(sessionId: string) {
        const response = await fetch(`${BACKEND_URL}/api/questions/${sessionId}/current`);
        if (!response.ok) throw new Error("Failed to get current question");
        return response.json();
    },

    async getQuestionResults(questionId: string) {
        const response = await fetch(`${BACKEND_URL}/api/questions/${questionId}/results`);
        if (!response.ok) throw new Error("Failed to get results");
        return response.json();
    },

    // Answer APIs
    async submitAnswer(questionId: string, studentId: string, selectedOption: string) {
        const response = await fetch(`${BACKEND_URL}/api/answers/${questionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, selectedOption })
        });
        if (!response.ok) throw new Error("Failed to submit answer");
        return response.json();
    },

    // Chat APIs
    async sendMessage(pollSessionId: string, senderId: string, senderRole: "teacher" | "student", message: string) {
        const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pollSessionId, senderId, senderRole, message })
        });
        if (!response.ok) throw new Error("Failed to send message");
        return response.json();
    },

    async getMessages(pollSessionId: string) {
        const response = await fetch(`${BACKEND_URL}/api/chat/${pollSessionId}`);
        if (!response.ok) throw new Error("Failed to get messages");
        return response.json();
    },

    async deleteMessage(messageId: string, senderId: string, role: "teacher" | "student") {
        const response = await fetch(`${BACKEND_URL}/api/chat/${messageId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId, role })
        });
        if (!response.ok) throw new Error("Failed to delete message");
        return response.json();
    }
};
