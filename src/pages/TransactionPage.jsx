import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./TransactionPage.css";

const TransactionPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { token, transactionNumber } = useAuth();
    const totalReward = state?.totalReward ?? 0;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const options = [
        { name: "Doğa ve Çevre Vakfı", icon: "doga-ve-cevre-bagisla.png" },
        { name: "Turkish Marine", icon: "turkish-marine-bagisla.png" },
        { name: "WWF", icon: "wwf-bagisla.png" },
        { name: "TEMA", icon: "tema-bagisla.png" },
    ];

    // Açılışta veya seçenek tıklanınca modal göster
    const handleSelect = (name) => {
        setSelectedOption(name);
        setError("");
        setModalVisible(true);
    };

    // Onaylandığında API çağrısı ve yönlendirme
    const confirmSelection = async () => {
        try {
            setLoading(true);
            setError("");
            // Tamamlama endpoint'ine istek gönder
            await axios.post(
                `http://192.168.1.102:5190/api/Transaction/complete/${transactionNumber}`,
                {
                    selectedOption,
                    totalReward
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Başarılıysa tamam sayfasına yönlendir
            navigate("/complete", {
                state: { totalReward, selectedOption }
            });
        } catch (err) {
            const msg = err.response?.data?.Error || "İşlem tamamlanamadı.";
            setError(msg);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

    return (
        <div className="transaction-page">
            <header className="header">
                <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                <img src="ikons/atkazan.png" alt="Logo" className="logo-img" />
            </header>

            <main className="main hero section">
                <div className="transaction-container">
                    {/* Sol panel */}
                    <div className="earnings-panel">
                        <div className="label">Toplam Kazancınız</div>
                        <div className="amount">₺{totalReward.toFixed(2)}</div>
                        <div className="subtitle">
                            Bu tutarı istediğiniz vakfa bağışlayabilir veya kendi hesabınıza aktarabilirsiniz.
                        </div>
                    </div>

                    {/* Sağ panel */}
                    <div className="donation-panel">
                        <div className="donation-items">
                            {options.map(opt => (
                                <div
                                    key={opt.name}
                                    className="donation-item"
                                    onClick={() => handleSelect(opt.name)}
                                >
                                    <img src={`ikons/${opt.icon}`} alt={opt.name} />
                                    <div className="donation-name">{opt.name}</div>
                                </div>
                            ))}
                        </div>

                        <div className="divider"><span>VEYA</span></div>

                        <button
                            className="own-account-btn"
                            onClick={() => handleSelect("Kendi Hesabıma Aktar")}
                        >
                            KENDİ HESABINA AL
                        </button>
                    </div>
                </div>

                {/* Hata mesajı */}
                {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
            </main>

            {/* Onay Modal */}
            {modalVisible && (
                <div className="confirmation-modal" onClick={() => setModalVisible(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>İşlem Onayı</h3>
                        <p>
                            ₺{totalReward.toFixed(2)} tutarını <strong>{selectedOption}</strong>'a göndermek istiyor musunuz?
                        </p>
                        <div className="modal-buttons">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setModalVisible(false)}
                                disabled={loading}
                            >
                                Vazgeç
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={confirmSelection}
                                disabled={loading}
                            >
                                {loading ? 'Gönderiliyor...' : 'Onaylıyorum'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;