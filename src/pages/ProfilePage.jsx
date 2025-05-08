/* src/pages/ProfilePage.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        petCount: 0,
        canCount: 0,
        totalReward: 0
    });

    useEffect(() => {
        // profil verisi çekme
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Layout>
            <div className="profile-page">
                <main>
                    {/* orijinal profil içeriği buraya */}
                </main>
            </div>
        </Layout>
    );
};

export default ProfilePage;

