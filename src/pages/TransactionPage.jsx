import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TransactionPage.css";

const TransactionPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  if (!state) return <p>Yükleniyor...</p>;

  const { transactionNumber, totalReward } = state;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const confirmSelection = () => {
    navigate("/complete", {
      state: {
        transactionNumber,
        totalReward,
        option: selectedOption,
      },
    });
  };

  return (
    <div className="transaction-page">
      <header className="header fixed-top d-flex align-items-center">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-center">
            <h1>Akıllı Geri Dönüşüm Otomatı</h1>
          </div>
          <div>
            <img src="ikons/atkazan.png" width="170px" alt="Logo" />
          </div>
        </div>
      </header>

      <main className="main">
        <section className="earnings-section container">
          <h2 className="section-title">Kazancınızı Değerlendirin</h2>
          <div className="content-row">
            <div className="col-4">
              <div className="earnings-card">
                <div className="earnings-label">Toplam Kazancınız</div>
                <div className="earnings-amount">₺{totalReward.toFixed(2)}</div>
                <div className="earnings-label">
                  Bu tutarı bağışlayabilir veya hesabınıza aktarabilirsiniz
                </div>
              </div>
            </div>

            <div className="col-8">
              <div className="options-container">
                <div className="donation-grid">
                  {[
                    { name: "Doğa ve Çevre Vakfı", icon: "doga-ve-cevre-bagisla.png" },
                    { name: "Turkish Marine", icon: "turkish-marine-bagisla.png" },
                    { name: "WWF", icon: "wwf-bagisla.png" },
                    { name: "TEMA", icon: "tema-bagisla.png" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="donation-item"
                      onClick={() => handleOptionSelect(item.name)}
                    >
                      <img src={`ikons/${item.icon}`} alt={item.name} />
                      <div className="donation-name">{item.name}</div>
                    </div>
                  ))}
                </div>

                <div className="divider">
                  <div className="line"></div>
                  <div className="text">VEYA</div>
                  <div className="line"></div>
                </div>

                <div className="text-center">
                  <button
                    className="account-button"
                    onClick={() => handleOptionSelect("Kendi Hesabım")}
                  >
                    KENDİ HESABINA AL
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section mt-4">
            <button
              className="back-link"
              onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "#6c757d", fontSize: "1.1rem" }}
            >
              <i className="bi bi-arrow-left"></i> Ana Sayfaya Dön
            </button>
          </div>
        </section>
      </main>

      {modalVisible && (
        <div className="confirmation-modal" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">İşlem Onayı</h3>
            <p className="modal-text">
              ₺{totalReward.toFixed(2)} tutarını{" "}
              <span className="selected-option">{selectedOption}</span>'a göndermek istiyor musunuz?
            </p>
            <div className="modal-buttons">
              <button className="modal-btn cancel-btn" onClick={() => setModalVisible(false)}>
                Vazgeç
              </button>
              <button className="modal-btn confirm-btn" onClick={confirmSelection}>
                Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
