import PrivateRoute from "./RouteProtaction-Components/Private-Route/PrivateRoute";
import PublicRoute from "./RouteProtaction-Components/Public-Route/PublicRoute";
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
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="chat-history" element={<PrivateRoute><ChatHistory /></PrivateRoute>} />
        <Route path="/my-qr" element={<PrivateRoute><QRCodePage /></PrivateRoute>} />
        <Route path="/chatbot/:token" element={<PrivateRoute><EmergencyChatPage /></PrivateRoute>} />
      </Routes>
    </PageLayout>
  );
}

export default App;
