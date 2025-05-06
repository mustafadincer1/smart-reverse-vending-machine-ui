import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RecyclePage from "./pages/RecyclePage";
import TransactionPage from "./pages/TransactionPage";
import RegisterPage from "./pages/RegisterPage";
import CompletePage from "./pages/CompletePage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";




function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recycle" element={<RecyclePage />} />
                <Route path="/transaction" element={<TransactionPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/complete" element={<CompletePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
