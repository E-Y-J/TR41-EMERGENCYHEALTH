import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import QRCodePage from "./pages/QRCodePage";
import PageLayout from "./components/PageLayout";
// import Allergy from "./pages/AllergyPage";

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-qr" element={<QRCodePage />} />
        {/* <Route path="/allergy" element={<Allergy />} /> */}
      </Routes>
    </PageLayout>
  );
}

export default App;
