import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import QRCode from "./pages/QRCode";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/qrcode" element={<QRCode />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
