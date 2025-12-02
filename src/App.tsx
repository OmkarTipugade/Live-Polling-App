import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import ChatBox from "./pages/ChatBox";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { useLocation } from "react-router";
import StudentQuePage from "./pages/StudentQuePage";
import AskQuestion from "./pages/AskQuestion";
import PollHistory from "./pages/PollHistory";

const App = () => {
  const location = useLocation();

  const hideChatBox =
    location.pathname !== "/" && location.pathname !== "/student";

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/que"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentQuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/que"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AskQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/history"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <PollHistory />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<UnauthorizedPage />} />
      </Routes>
      {hideChatBox && <ChatBox accessor="teacher" />}
    </div>
  );
};

export default App;
