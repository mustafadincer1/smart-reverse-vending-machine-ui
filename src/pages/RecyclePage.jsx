import React, { useEffect, useState, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Layout from '../components/Layout';
// No need to import RecyclePage.css anymore since styles are in Layout.css

const RecyclePage = () => {
    const navigate = useNavigate();
    const { token, transactionNumber } = useAuth();
    const connectionRef = useRef(null);
    const [counts, setCounts] = useState({ pet: 0, teneke: 0 });
    const [rewards, setRewards] = useState({ pet: 0, teneke: 0 });

    useEffect(() => {
        // SignalR bağlantı başlatma
    }, []);

    return (
        <Layout>
            {/* RecyclePage content here */}
            <div className="info-section">
                <h2>Geri Dönüşüm İşlemi</h2>
                <p>Lütfen atıklarınızı ilgili bölümlere atınız</p>
            </div>

            <div className="card-list">
                {/* Example card - you can add your actual implementation here */}
                <div className="info-card">
                    <div className="icon">
                        <img src={`${process.env.PUBLIC_URL}/ikons/pet.png`} alt="Pet Şişe" />
                    </div>
                    <div className="card-content">
                        <h3>Pet Şişe</h3>
                        <p>Plastik şişeleri buraya atın</p>
                    </div>
                    <div className="card-values">
                        <div className="adet">{counts.pet} adet</div>
                        <div className="puan">{rewards.pet} puan</div>
                    </div>
                </div>

                {/* You can add more cards here */}
            </div>

            <div className="action-area">
                <h2>İşlemi Tamamla</h2>
                <img
                    src={`${process.env.PUBLIC_URL}/ikons/complete-button.png`}
                    alt="İşlemi Tamamla"
                    className="complete-button"
                    onClick={() => navigate('/complete')}
                />
            </div>
        </Layout>
    );
};

export default RecyclePage;