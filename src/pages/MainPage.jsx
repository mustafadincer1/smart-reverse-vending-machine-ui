// src/pages/MainPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '../components/Layout';
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });

        const scrollTopBtn = document.querySelector('#scroll-top');
        const toggleScrollTop = () => {
            if (window.scrollY > 100) {
                scrollTopBtn?.classList.add('active');
            } else {
                scrollTopBtn?.classList.remove('active');
            }
        };

        window.addEventListener('scroll', toggleScrollTop);
        window.addEventListener('load', toggleScrollTop);

        scrollTopBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return () => {
            window.removeEventListener('scroll', toggleScrollTop);
        };
    }, []);

    const handleStart = () => {
        navigate('/login');
    };

    return (
        <Layout>
            <section className="hero">
                <div className="hero-content">
                    <h1 data-aos="fade-up">AT KAZAN</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        Doğayı Kurtarmak İçin Geri Dönüştür
                    </p>
                    <div className="hero-start" data-aos="zoom-out" data-aos-delay="200">
                        <img
                            src={`${process.env.PUBLIC_URL}/ikons/basla.png`}
                            alt="Geri Dönüşüme Başla"
                            onClick={handleStart}
                            className="start-icon"
                        />
                    </div>
                </div>
            </section>

            <a
                href="#"
                id="scroll-top"
                className="scroll-top d-flex align-items-center justify-content-center"
            >
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </Layout>
    );
};

export default MainPage;