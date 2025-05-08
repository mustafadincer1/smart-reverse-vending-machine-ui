// src/pages/RecyclePage.jsx
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
                setCounts(p => ({ ...p, [key]: p[key] + 1 }));
                setRewards(p => ({
                    ...p,
                    [key]: parseFloat((p[key] + 0.25).toFixed(2)),
                }));
            }
        });
        conn.start().catch(console.error);

        return () => {
            conn.stop();
            connectionRef.current = null;
        };
    }, [token, transactionNumber]);

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
        <div className="recycle-page">
            <header className="header fixed-top d-flex align-items-center">
                <div className="container-fluid d-flex align-items-center justify-content-between">
                  
                    <div className="logo d-flex align-items-center">
                        <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                    </div>
                    <div className="atkazan-logo">
                        <span style={{ color: "#00AEEF" }}>AT</span>
                        <span style={{ color: "#28A745" }}>KAZAN</span>
                    </div>
                </div>
            </header>

            <main className="main hero section">
                <div className="info-section" data-aos="fade-up">
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
            </main>
        </div>
    );
};

export default RecyclePage;