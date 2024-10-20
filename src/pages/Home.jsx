import React from 'react';
import StockList from '../components/StockList';
import '../styles/StockPage.css';

function Home() {
    return (
        <div className="page-container">
            <StockList />
        </div>
    );
}

export default Home;