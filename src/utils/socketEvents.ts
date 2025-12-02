// Socket.io Event Types (matching backend)
export const SOCKET_EVENTS = {
    // Connection
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    
    // Session
    JOIN_SESSION: "join_session",
    LEAVE_SESSION: "leave_session",
    SESSION_CREATED: "session_created",
    STUDENT_JOINED: "student_joined",
    STUDENT_LEFT: "student_left",
    STUDENT_KICKED: "student_kicked",
    
    // Question 
    NEW_QUESTION: "new_question",
    QUESTION_ASKED: "question_asked",
    QUESTION_EXPIRED: "question_expired",
    
    // Answer 
    SUBMIT_ANSWER: "submit_answer",
    ANSWER_SUBMITTED: "answer_submitted",
    ALL_ANSWERED: "all_answered",
    
    // Results 
    UPDATE_RESULTS: "update_results",
    SHOW_RESULTS: "show_results",
    
    // Chat 
    SEND_MESSAGE: "send_message",
    NEW_MESSAGE: "new_message",
    EDIT_MESSAGE: "edit_message",
    MESSAGE_EDITED: "message_edited",
    DELETE_MESSAGE: "delete_message",
    MESSAGE_DELETED: "message_deleted",
    
    // Participant 
    UPDATE_PARTICIPANTS: "update_participants",
    PARTICIPANT_LIST: "participant_list",
    
    // Error 
    ERROR: "error",
    VALIDATION_ERROR: "validation_error"
} as const;

// Type definitions for Socket event payloads
export interface JoinSessionPayload {
    sessionId: string;
    userId: string;
    userName: string;
    role: "teacher" | "student";
}

export interface NewQuestionPayload {
    sessionId: string;
    text: string;
    options: string[];
    timeLimit: number;
}

export interface SubmitAnswerPayload {
    questionId: string;
    studentId: string;
    selectedOption: string;
    sessionId: string;
}

export interface ChatMessagePayload {
    sessionId: string;
    senderId: string;
    senderRole: "teacher" | "student";
    message: string;
}

export interface KickStudentPayload {
    sessionId: string;
    studentId: string;
}

export interface QuestionData {
    id: string;
    text: string;
    options: string[];
    timeLimit: number;
    startTime: Date;
    questionNumber?: number;
}

export interface ResultsData {
    questionId: string;
    results: Record<string, number>;
    totalAnswers: number;
    answeredCount?: number;
    totalStudents?: number;
}

export interface Participant {
    id: string;
    name: string;
}

export interface ChatMessage {
    messageId: string;
    senderId: string;
    senderName: string;
    senderRole: "teacher" | "student";
    message: string;
    timestamp: Date;
}
