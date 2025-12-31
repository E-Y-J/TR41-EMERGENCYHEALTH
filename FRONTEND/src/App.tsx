import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QRCodePage from "./pages/QRCodePage";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/my-qr" element={<QRCodePage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
