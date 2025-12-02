import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "../actions.js";
import type {
    JoinSessionPayload,
    NewQuestionPayload,
    SubmitAnswerPayload,
    ChatMessagePayload,
    KickStudentPayload
} from "../actions.js";
import { PollSession } from "../models/PollSession.model.js";
import { Question } from "../models/Question.model.js";
import { Answer } from "../models/Answer.model.js";
import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";

export const setupSocketHandlers = (io: Server) => {
    io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Join Session Event
        socket.on(SOCKET_EVENTS.JOIN_SESSION, async (data: JoinSessionPayload) => {
            try {
                const { sessionId, userId, userName, role } = data;

                // Join the room 
                socket.join(sessionId);
                
                socket.data.sessionId = sessionId;
                socket.data.userId = userId;
                socket.data.role = role;

                console.log(`${role} ${userName} joined session ${sessionId}`);

                // Get current session state
                const session = await PollSession.findById(sessionId)
                    .populate('students')
                    .populate('currentQuestionId');

                if (session) {
                    // Notify all clients in the room about the new participant
                    if (role === "student") {
                        io.to(sessionId).emit(SOCKET_EVENTS.STUDENT_JOINED, {
                            userId,
                            userName,
                            timestamp: new Date()
                        });
                    }

                    // Send current participants list to the room
                    const participants = await User.find({
                        pollSessionId: sessionId,
                        role: "student"
                    });

                    io.to(sessionId).emit(SOCKET_EVENTS.UPDATE_PARTICIPANTS, {
                        participants: participants.map(p => ({
                            id: p._id,
                            name: p.name
                        }))
                    });

                    // If there's a current question, send it to the newly joined student
                    if (session.currentQuestionId && role === "student") {
                        const currentQuestion = session.currentQuestionId as any;
                        
                        // Check if the question is still active
                        if (currentQuestion.isActive) {
                            // Find question number (position in questions array)
                            const questionIndex = session.questions.findIndex(
                                (qId) => qId.toString() === currentQuestion._id.toString()
                            );
                            const questionNumber = questionIndex >= 0 ? questionIndex + 1 : undefined;
                            
                            socket.emit(SOCKET_EVENTS.QUESTION_ASKED, {
                                question: {
                                    id: currentQuestion._id,
                                    text: currentQuestion.text,
                                    options: currentQuestion.options,
                                    timeLimit: currentQuestion.timeLimit,
                                    startTime: currentQuestion.startTime,
                                    questionNumber
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error in JOIN_SESSION:", error);
                socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to join session" });
            }
        });

        // New Question Event (Teacher only)
        socket.on(SOCKET_EVENTS.NEW_QUESTION, async (data: NewQuestionPayload) => {
            try {
                const { sessionId, text, options, timeLimit } = data;

                // Verify session exists
                const session = await PollSession.findById(sessionId);
                if (!session) {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "Session not found" });
                    return;
                }

                // Auto-inactivate previous question if it exists and is still active
                if (session.currentQuestionId) {
                    const previousQuestion = await Question.findById(session.currentQuestionId);
                    if (previousQuestion && previousQuestion.isActive) {
                        // Mark previous question as inactive
                        previousQuestion.isActive = false;
                        await previousQuestion.save();

                        // Get and emit final results for the previous question
                        const previousAnswers = await Answer.find({ questionId: previousQuestion._id });
                        const previousCounts: Record<string, number> = {};
                        previousQuestion.options.forEach(opt => previousCounts[opt] = 0);
                        previousAnswers.forEach(a => {
                            previousCounts[a.selectedOption] = (previousCounts[a.selectedOption] || 0) + 1;
                        });

                        // Broadcast final results for previous question
                        io.to(sessionId).emit(SOCKET_EVENTS.SHOW_RESULTS, {
                            questionId: previousQuestion._id,
                            results: previousCounts,
                            totalAnswers: previousAnswers.length
                        });

                        console.log(`Previous question ${previousQuestion._id} auto-inactivated due to new question`);
                    }
                }

                // Create question with optional correct answer
                const questionData: any = {
                    pollSessionId: sessionId,
                    text,
                    options,
                    timeLimit: timeLimit || 60,
                    startTime: new Date(),
                    isActive: true
                };
                
                // Only add correctAnswer if it's provided
                if (data.correctAnswer) {
                    questionData.correctAnswer = data.correctAnswer;
                }

                const question = await Question.create(questionData);

                // Update session with current question
                session.questions.push(question._id);
                session.currentQuestionId = question._id;
                await session.save();

                // Question number is the position in the questions array
                const questionNumber = session.questions.length;

                // Broadcast the new question to all clients in the session
                io.to(sessionId).emit(SOCKET_EVENTS.QUESTION_ASKED, {
                    question: {
                        id: question._id,
                        text: question.text,
                        options: question.options,
                        timeLimit: question.timeLimit,
                        startTime: question.startTime,
                        questionNumber
                    }
                });

                console.log(`New question asked in session ${sessionId}`);

                // Set timer to expire question after timeLimit
                setTimeout(async () => {
                    const q = await Question.findById(question._id);
                    if (q && q.isActive) {
                        q.isActive = false;
                        await q.save();

                        // Get results
                        const answers = await Answer.find({ questionId: question._id });
                        const counts: Record<string, number> = {};
                        question.options.forEach(opt => counts[opt] = 0);
                        answers.forEach(a => {
                            counts[a.selectedOption] = (counts[a.selectedOption] || 0) + 1;
                        });

                        // Broadcast results
                        io.to(sessionId).emit(SOCKET_EVENTS.SHOW_RESULTS, {
                            questionId: question._id,
                            results: counts,
                            totalAnswers: answers.length
                        });

                        console.log(`Question ${question._id} expired, showing results`);
                    }
                }, timeLimit * 1000);

            } catch (error) {
                console.error("Error in NEW_QUESTION:", error);
                socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to create question" });
            }
        });

        // Submit Answer Event (Student only)
        socket.on(SOCKET_EVENTS.SUBMIT_ANSWER, async (data: SubmitAnswerPayload) => {
            try {
                const { questionId, studentId, selectedOption, sessionId } = data;

                // Find the question
                const question = await Question.findById(questionId);
                if (!question) {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "Question not found" });
                    return;
                }

                // Check if question is still active
                if (!question.isActive) {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "Question is no longer active" });
                    return;
                }

                // Check time limit
                if (question.startTime && question.timeLimit) {
                    const diffSec = (Date.now() - question.startTime.getTime()) / 1000;
                    if (diffSec > question.timeLimit) {
                        socket.emit(SOCKET_EVENTS.ERROR, { message: "Time limit exceeded" });
                        return;
                    }
                }

                // Validate option
                if (!question.options.includes(selectedOption)) {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "Invalid option" });
                    return;
                }

                // Create answer
                const answer = await Answer.create({
                    questionId,
                    studentId,
                    selectedOption
                });

                // Emit confirmation to student
                socket.emit(SOCKET_EVENTS.ANSWER_SUBMITTED, {
                    success: true,
                    answerId: answer._id
                });

                // Get current answer count
                const session = await PollSession.findById(sessionId).populate('students');
                const answersCount = await Answer.countDocuments({ questionId });
                const totalStudents = session?.students.length || 0;

                // Calculate real-time results
                const allAnswers = await Answer.find({ questionId });
                const counts: Record<string, number> = {};
                question.options.forEach(opt => counts[opt] = 0);
                allAnswers.forEach(a => {
                    counts[a.selectedOption] = (counts[a.selectedOption] || 0) + 1;
                });

                // Broadcast updated results to teacher
                io.to(sessionId).emit(SOCKET_EVENTS.UPDATE_RESULTS, {
                    questionId,
                    results: counts,
                    answeredCount: answersCount,
                    totalStudents
                });

                // If all students answered, deactivate question and show results
                if (answersCount >= totalStudents && totalStudents > 0) {
                    question.isActive = false;
                    await question.save();

                    if (session) {
                        session.currentQuestionId = null;
                        await session.save();
                    }

                    io.to(sessionId).emit(SOCKET_EVENTS.ALL_ANSWERED, {
                        questionId
                    });

                    io.to(sessionId).emit(SOCKET_EVENTS.SHOW_RESULTS, {
                        questionId,
                        results: counts,
                        totalAnswers: answersCount
                    });

                    console.log(`All students answered question ${questionId}`);
                }

            } catch (error: any) {
                console.error("Error in SUBMIT_ANSWER:", error);
                if (error.code === 11000) {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "You have already answered this question" });
                } else {
                    socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to submit answer" });
                }
            }
        });

        // Chat Message Event
        socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: ChatMessagePayload) => {
            try {
                const { sessionId, senderId, senderRole, message } = data;

                // Create message in database
                const newMessage = await Message.create({
                    pollSessionId: sessionId,
                    senderId,
                    senderRole,
                    message
                });

                // Get sender info
                const sender = await User.findById(senderId);

                // Broadcast message to all in session
                io.to(sessionId).emit(SOCKET_EVENTS.NEW_MESSAGE, {
                    messageId: newMessage._id,
                    senderId,
                    senderName: sender?.name || "Unknown",
                    senderRole,
                    message,
                    timestamp: newMessage.createdAt
                });

            } catch (error) {
                console.error("Error in SEND_MESSAGE:", error);
                socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to send message" });
            }
        });

        // Kick Student Event (Teacher only)
        socket.on(SOCKET_EVENTS.STUDENT_KICKED, async (data: KickStudentPayload) => {
            try {
                const { sessionId, studentId } = data;

                // Remove student from session
                const session = await PollSession.findById(sessionId);
                if (session) {
                    session.students = session.students.filter(id => id.toString() !== studentId);
                    await session.save();
                }

                // Delete student user
                await User.findByIdAndDelete(studentId);

                // Notify all clients in session
                io.to(sessionId).emit(SOCKET_EVENTS.STUDENT_KICKED, {
                    studentId
                });

                // Update participants list
                const participants = await User.find({
                    pollSessionId: sessionId,
                    role: "student"
                });

                io.to(sessionId).emit(SOCKET_EVENTS.UPDATE_PARTICIPANTS, {
                    participants: participants.map(p => ({
                        id: p._id,
                        name: p.name
                    }))
                });

                console.log(`Student ${studentId} kicked from session ${sessionId}`);

            } catch (error) {
                console.error("Error in STUDENT_KICKED:", error);
                socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to kick student" });
            }
        });

        // Leave Session Event
        socket.on(SOCKET_EVENTS.LEAVE_SESSION, async () => {
            try {
                const { sessionId, userId, role } = socket.data;

                if (sessionId) {
                    socket.leave(sessionId);
                    console.log(`${role} ${userId} left session ${sessionId}`);

                    // Notify others
                    socket.to(sessionId).emit(SOCKET_EVENTS.STUDENT_LEFT, {
                        userId,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                console.error("Error in LEAVE_SESSION:", error);
            }
        });

        // Disconnect Event
        socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
            try {
                const { sessionId, userId, role } = socket.data;

                if (sessionId && userId) {
                    console.log(`${role} ${userId} disconnected from session ${sessionId}`);

                    // Notify others about disconnection
                    socket.to(sessionId).emit(SOCKET_EVENTS.STUDENT_LEFT, {
                        userId,
                        timestamp: new Date()
                    });
                }

                console.log(`Client disconnected: ${socket.id}`);
            } catch (error) {
                console.error("Error in DISCONNECT:", error);
            }
        });
    });
};
