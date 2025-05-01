import React, { useEffect, useState, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import "./RecyclePage.css";

const RecyclePage = () => {
  const navigate = useNavigate();
  const { token, transactionNumber } = useAuth();
  const connectionRef = useRef(null);

  const [counts, setCounts] = useState({ pet: 0, teneke: 0 });
  const [rewards, setRewards] = useState({ pet: 0, teneke: 0 });

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (!token || !transactionNumber) return;

    if (connectionRef.current) return; // bağlantı zaten kuruluysa tekrar kurma

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5190/barcodeHub", {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("ProcessingStatus", (message) => {
      console.log("🔔 SignalR verisi:", message);
      if (message.status === "success") {
        const { materialType } = message.data;
        const type = materialType === 0 ? "pet" : materialType === 1 ? "teneke" : null;

        if (type) {
          setCounts((prev) => ({
            ...prev,
            [type]: prev[type] + 1,
          }));
          setRewards((prev) => ({
            ...prev,
            [type]: parseFloat((prev[type] + 0.25).toFixed(2)),
          }));
        }
      }
    });

    connection
      .start()
      .then(() => console.log("✅ SignalR bağlantısı kuruldu"))
      .catch((err) => console.error("❌ SignalR bağlantı hatası:", err));

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [token, transactionNumber]);

  const handleComplete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5190/api/Transaction/${transactionNumber}/reward`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rewardData = await response.json();
      navigate("/transaction", { state: rewardData });
    } catch (error) {
      console.error("Ödül bilgisi alınamadı:", error);
      alert("Bir hata oluştu.");
    }
  };

  const totalCount = counts.pet + counts.teneke;
  const totalReward = parseFloat((rewards.pet + rewards.teneke).toFixed(2));

  return (
    <div className="index-page recycle-page">
      <header className="header d-flex justify-content-between align-items-center">
        <h1>Akıllı Geri Dönüşüm Otomatı</h1>
        <span className="atkazan-logo">
          <span style={{ color: "#00AEEF" }}>AT</span>
          <span style={{ color: "#28A745" }}>KAZAN</span>
        </span>
      </header>

      <main className="main container">
        <div className="info-section" data-aos="fade-up">
          <h1>Geri Dönüşüm Bilgileri</h1>
          <p>Doğayı Kurtarmak İçin Geri Dönüştür</p>
        </div>

        <div className="card-list">
          {[{ type: "pet", label: "PET", icon: "water" }, { type: "teneke", label: "TENEKE", icon: "can" }, { type: "total", label: "TOPLAM", icon: "recycle" }].map(({ type, label, icon }) => (
            <div className="info-card" key={type} data-aos="fade-up">
              <div className="icon">
                <img src={`${process.env.PUBLIC_URL}/ikons/${icon}.png`} alt={`${type} icon`} width="50" height="50" />
              </div>
              <div className="card-content">
                <h3>{label}</h3>
                <p>{type === "total" ? "KAZANÇ / PUAN" : "ATIK MİKTARI"}</p>
              </div>
              <div className="card-values">
                <div className="adet">{String(type === "total" ? totalCount : counts[type]).padStart(2, "0")} adet</div>
                <div className="puan">{(type === "total" ? totalReward : rewards[type]).toFixed(2)} puan</div>
              </div>
            </div>
          ))}
        </div>

        <div className="action-area" data-aos="zoom-in">
          <h2>İŞLEMİ TAMAMLA</h2>
          <img
             src={`${process.env.PUBLIC_URL}/ikons/islemi-tamamla-tamam.png`}
            alt="İşlemi Tamamla"
            className="complete-button"
            onClick={handleComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default RecyclePage;
