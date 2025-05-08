/* src/pages/MainPage.jsx */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Layout from '../components/Layout';
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
        // ek AOS ayarları
    }, []);

    return (
        <Layout>
            <div className="main-page">
                <main>
                    {/* orijinal anasayfa içeriği buraya */}
                </main>
                <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
                    <i className="bi bi-arrow-up-short"></i>
                </a>
            </div>
        </Layout>
    );
};

export default MainPage;
