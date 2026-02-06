import PrivateRoute from "./RouteProtaction/Private-Route/PrivateRoute";
import PublicRoute from "./RouteProtaction/Public-Route/PublicRoute";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import QRCodePage from "./pages/QRCodePage";
import PageLayout from "./components/PageLayout";
import ChatHistory from "./pages/ChatHistory";
import RespondersChat from "./pages/RespondersChat";

function App() {

  // Get the current location and Check if the current path starts with /chatbot/
  const location = useLocation();
  const isResponderChat = location.pathname.startsWith("/chatbot/");

  if (isResponderChat) {
    return (
      <Routes>
        <Route path="/chatbot/:token" element={<RespondersChat />} />
      </Routes>
    );
  }

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="chat-history" element={<PrivateRoute><ChatHistory /></PrivateRoute>} />
        <Route path="/my-qr" element={<PrivateRoute><QRCodePage /></PrivateRoute>} />
      </Routes>
    </PageLayout>
  );
}

export default App;
