import LandingPage from "./pages/LandingPage"
import { BrowserRouter, Routes, Route } from "react-router"
import TeacherPage from "./pages/TeacherPage"
import StudentPage from "./pages/StudentPage"
import ChatBox from "./pages/ChatBox"
const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
        </Routes>
      </BrowserRouter>
      <ChatBox accessor="teacher"/>
    </div>
  )
}

export default App
