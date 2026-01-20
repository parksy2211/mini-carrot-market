import { Navigate, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import MyPage from "./pages/MyPage";

export default function App() {
  return (
    <div className="app">
      <TopBar />

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/me" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
