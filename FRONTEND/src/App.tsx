import { Route, Routes } from "react-router-dom";
import AuthContainer from "./components/AuthContainer";
import HomePage from "./components/HomePage";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthContainer />} />
      </Routes>
    </>
  );
}

export default App;
