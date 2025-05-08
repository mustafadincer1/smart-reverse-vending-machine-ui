/* src/pages/TransactionPage.jsx */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from '../components/Layout';
import './TransactionPage.css';

const TransactionPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const totalReward = state?.totalReward ?? 0;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const options = [
        { name: "Doğa ve Çevre Vakfı", icon: "doga-ve-cevre-bagisla.png" },
        // diğer seçenekler
    ];

    const confirmSelection = () => {
        // onaylama işlemi
    };

    return (
        <Layout>
            <div className="transaction-page">
                {/* orijinal işlem içeriği buraya */}
            </div>
        </Layout>
    );
};

export default TransactionPage;
