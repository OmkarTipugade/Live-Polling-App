import LandingPage from "./pages/LandingPage"
import { BrowserRouter, Routes, Route } from "react-router"
import TeacherPage from "./pages/TeacherPage"
import StudentPage from "./pages/StudentPage"
import ChatBox from "./pages/ChatBox"
import TeacherQuePage from "./pages/TeacherQuePage"
import ProtectedRoute from "./components/ProtectedRoute"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import { useLocation } from "react-router"
const App = () => {

  const location = useLocation()

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
      {location.pathname !== "/" && <ChatBox accessor="teacher"/>}
    </div>
  )
}

export default App
