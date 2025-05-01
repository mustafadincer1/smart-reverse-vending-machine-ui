import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RecyclePage from "./pages/RecyclePage";
import TransactionPage from "./pages/TransactionPage";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recycle" element={<RecyclePage />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
