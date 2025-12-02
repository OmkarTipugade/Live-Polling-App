import axios from 'axios';

const BACKEND_URL = "https://live-polling-app-1-m2q3.onrender.com";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
            throw new Error(message);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error(error.message || 'Request failed');
        }
    }
);

export const api = {
    async createSession(teacherName: string) {
        const response = await axiosInstance.post('/api/sessions', { teacherName });
        return response.data;
    },

    async joinSession(sessionId: string, name: string) {
        const response = await axiosInstance.post(`/api/sessions/${sessionId}/join`, { name });
        return response.data;
    },

    async kickStudent(sessionId: string, studentId: string) {
        const response = await axiosInstance.delete(`/api/sessions/${sessionId}/students/${studentId}`);
        return response.data;
    },

    // Question APIs
    async createQuestion(sessionId: string, text: string, options: string[], timeLimit: number) {
        const response = await axiosInstance.post(`/api/questions/${sessionId}`, {
            text,
            options,
            timeLimit
        });
        return response.data;
    },

    async getCurrentQuestion(sessionId: string) {
        const response = await axiosInstance.get(`/api/questions/${sessionId}/current`);
        return response.data;
    },

    async getQuestionResults(questionId: string) {
        const response = await axiosInstance.get(`/api/questions/${questionId}/results`);
        return response.data;
    },

    // Answer APIs
    async submitAnswer(questionId: string, studentId: string, selectedOption: string) {
        const response = await axiosInstance.post(`/api/answers/${questionId}`, {
            studentId,
            selectedOption
        });
        return response.data;
    },

    // Chat APIs
    async sendMessage(pollSessionId: string, senderId: string, senderRole: "teacher" | "student", message: string) {
        const response = await axiosInstance.post('/api/chat/send', {
            pollSessionId,
            senderId,
            senderRole,
            message
        });
        return response.data;
    },

    async getMessages(pollSessionId: string) {
        const response = await axiosInstance.get(`/api/chat/${pollSessionId}`);
        return response.data;
    },

    async deleteMessage(messageId: string, senderId: string, role: "teacher" | "student") {
        const response = await axiosInstance.delete(`/api/chat/${messageId}`, {
            data: { senderId, role }
        });
        return response.data;
    },

    // History API
    async getSessionHistory(sessionId: string) {
        const response = await axiosInstance.get(`/api/questions/session/${sessionId}/history`);
        return response.data;
    }
};
