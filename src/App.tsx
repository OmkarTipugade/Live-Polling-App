import LandingPage from "./pages/LandingPage"
import { Routes, Route } from "react-router"
import TeacherPage from "./pages/TeacherPage"
import StudentPage from "./pages/StudentPage"
import ChatBox from "./pages/ChatBox"
import TeacherQuePage from "./pages/TeacherQuePage"
import ProtectedRoute from "./components/ProtectedRoute"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import { useLocation } from "react-router"
import StudentQuePage from "./pages/StudentQuePage"
const App = () => {

  const location = useLocation()

  const hideChatBox = location.pathname !== "/" && location.pathname !== "/student";

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
                <StudentQuePage/>
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
                <TeacherQuePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<UnauthorizedPage />} />
        </Routes>
      {hideChatBox && <ChatBox accessor="teacher"/>}
    </div>
  )
}

export default App
