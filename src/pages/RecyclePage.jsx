// src/pages/RecyclePage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Layout from '../components/Layout';
import './RecyclePage.css';

const RecyclePage = () => {
    const navigate = useNavigate();
    const { token, transactionNumber } = useAuth();
    const connectionRef = useRef(null);

    const [counts, setCounts] = useState({ pet: 0, teneke: 0 });
    const [rewards, setRewards] = useState({ pet: 0, teneke: 0 });

    // Timeout için referans
    const timeoutRef = useRef(null);

    // Otomatik işlem tamamlama ve ana sayfaya yönlendirme
    const handleAutoComplete = useCallback(async () => {
        try {
            // complete endpoint'i ile işlemi bitir
            await fetch(
                `http://192.168.1.102:5190/api/Transaction/complete/${transactionNumber}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        selectedOption: "Kendi Hesabıma Aktar"
                    })
                }
            );
        } catch (err) {
            // hata olsa bile ana sayfaya dön
        }
        navigate("/");
    }, [navigate, token, transactionNumber]);

    // Timeout sıfırlama fonksiyonu
    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleAutoComplete();
        }, 45000); // 45 saniye
    }, [handleAutoComplete]);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    useEffect(() => {
        if (!token || !transactionNumber || connectionRef.current) return;

        const conn = new HubConnectionBuilder()
            .withUrl("http://192.168.1.102:5190/barcodeHub", {
                accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        connectionRef.current = conn;
        conn.on("ProcessingStatus", (msg) => {
            if (msg.status === "success") {
                const key = msg.data.materialType === 0 ? "pet" : "teneke";
                const reward = parseFloat(msg.data.totalReward?.toFixed(2) || "0");
                setCounts(prev => ({
                    ...prev,
                    [key]: prev[key] + 1
                }));

                setRewards(prev => ({
                    ...prev,
                    [key]: parseFloat((prev[key] + reward).toFixed(2))
                }));
                resetTimeout(); // SignalR'dan veri gelirse timeout sıfırlansın
            }
        });
        conn.start().catch(console.error);

        return () => {
            conn.stop();
            connectionRef.current = null;
        };
    }, [token, transactionNumber, resetTimeout]);

    // Tuş, tıklama ve hareketlerde timeout sıfırlansın
    useEffect(() => {
        const resetter = () => resetTimeout();
        window.addEventListener("mousemove", resetter);
        window.addEventListener("keydown", resetter);
        window.addEventListener("touchstart", resetter);

        resetTimeout(); // Sayfa açılır açılmaz başlat

        return () => {
            window.removeEventListener("mousemove", resetter);
            window.removeEventListener("keydown", resetter);
            window.removeEventListener("touchstart", resetter);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [resetTimeout]);

    // Kullanıcı manuel tamamladığında
    const handleComplete = async () => {
        try {
            const res = await fetch(
                `http://192.168.1.102:5190/api/Transaction/${transactionNumber}/reward`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            navigate("/transaction", { state: data });
        } catch {
            alert("Ödül bilgisi alınamadı.");
        }
    };

    const totalCount = counts.pet + counts.teneke;
    const totalReward = parseFloat((rewards.pet + rewards.teneke).toFixed(2));

    const cards = [
        { key: "pet", label: "PET", icon: "water", count: counts.pet, reward: rewards.pet },
        { key: "teneke", label: "TENEKE", icon: "can", count: counts.teneke, reward: rewards.teneke },
        { key: "total", label: "TOPLAM", icon: null, count: totalCount, reward: totalReward },
    ];

    return (
        <Layout>
            <div className="recycle-container">
                <div className="info-section">
                    <h2>Geri Dönüşüm Bilgileri</h2>
                    <p>Doğayı Kurtarmak İçin Geri Dönüştür</p>
                </div>

                <div className="card-list">
                    {cards.map(({ key, label, icon, count, reward }) => (
                        <div className={`info-card ${key}`} key={key} data-aos="fade-up">
                            {icon && (
                                <div className="icon">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/ikons/${icon}.png`}
                                        alt={label}
                                    />
                                </div>
                            )}
                            <div className="card-content">
                                <h3>{label}</h3>
                                <p>{key === "total" ? "KAZANÇ / PUAN" : "ATIK MİKTARI"}</p>
                            </div>
                            <div className="card-values">
                                <div className="adet">{String(count).padStart(2, "0")} adet</div>
                                <div className="puan">{reward.toFixed(2)} puan</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-area" data-aos="zoom-in">
                    <img
                        className="complete-button"
                        src={`${process.env.PUBLIC_URL}/ikons/islemi-tamamla-tamam.png`}
                        alt="Tamam"
                        onClick={handleComplete}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default RecyclePage;
