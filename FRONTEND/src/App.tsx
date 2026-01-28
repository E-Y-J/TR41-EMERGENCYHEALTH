import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import QRCodePage from "./pages/QRCodePage";
import PageLayout from "./components/PageLayout";
import ChatHistory from "./pages/ChatHistory";
import EmergencyChatPage from "./pages/EmergiChatBot";

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="chat-history" element={<ChatHistory />} />
        <Route path="/my-qr" element={<QRCodePage />} />
        {/* <Route path="/allergy" element={<Allergy />} /> */}
        <Route path="/chatbot/:token" element={<EmergencyChatPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
