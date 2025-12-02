import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { SocketProvider } from "./context/SocketContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <App />
      <ToastContainer />
    </SocketProvider>
  </BrowserRouter>
);
