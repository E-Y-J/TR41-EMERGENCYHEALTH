import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import QRCodePage from "./pages/QRCodePage";
import PageLayout from "./components/PageLayout";
import ChatHistory from "./pages/ChatHistory";

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="chat-history" element={<ChatHistory />} />
        <Route path="/my-qr" element={<QRCodePage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
