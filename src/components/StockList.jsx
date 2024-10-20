import React, { useState, useEffect } from "react";
import api from "../api";
import StockSearch from "./StockSearch";
import Stock from "./Stock";

function StockList() {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState(false);
    const [stocks, setStock] = useState([]);
    const [search, setSearch] = useState("");
    const [searchNewStock, setSearchNewStock] = useState(""); // State for searching new stock

    const getStocks = () => {
        api.get("api/stocklist/")
            .then((res) => {
                setStock(res.data);
                setError(false);
            })
            .catch((err) => {
                if (err.status ===401){
                setAlert(`Error: Unauthorized, refresh page or log back in`),setError(true)}
                else {
                    setAlert(`Error: ${err}`),setError(true)}
            }
            );
    };

    const handleSearch = (query) => {
        setSearch(query);
        setAlert("");
        setError(false);
        if (query.length > 0) {
            api.get(`/api/stock-search/${query}`)
                .then((res) => {
                    setStock(res.data);
                    setError(false);
                })
                .catch((err) => {
                    if (err.status ===401){
                    setAlert(`Error: Unauthorized, refresh page or log back in`),setError(true)}
                    else {
                        setAlert(`Error: ${err}`),setError(true)}
                }
                );
            
        } else {
            getStocks();
        }
    };

    const deleteStock = (id, ticker) => {
        setAlert("");
        api.delete(`api/stock/delete/${id}/`).then((res) => {
            if (res.status === 204) {
                setAlert(`${ticker} deleted from your list`);
                setError(false);
            } else {
                setAlert("Stock couldn't be deleted");
                setError(true);
            }
            getStocks();
        });
    };

    useEffect(() => {
        getStocks();
    }, []);

    const addStock = (stock) => {
        setAlert("");
        const stockData = {
            stock_name: stock["Name"],
            stock_ticker: stock["Symbol"],
            stock_sector: stock["Sector"],
            stock_industry: stock["Industry"],
        };
        api.post("api/stocklist/", stockData)
            .then((res) => {
                if (res.status === 201) {
                    setAlert(`${stock["Symbol"]} added to your list`);
                    setError(false);
                } else {
                    setAlert("Stock couldn't be added");
                    setError(true);
                }
                getStocks();
            })
            .catch((err) => {
                if (err.status ===401){
                setAlert(`Error: Unauthorized, refresh page or log back in`),setError(true)}
                else {
                    setAlert(`Error: ${err}`),setError(true)}
            }
            );
    };

    const handleNewStock = (e) => {
        setSearchNewStock(e.target.value);
    };

    return (
        <>
            <div className="header">
                <h1>Following Dashboard</h1>
                {alert && error && <div className="alert">{alert}</div>}
                {alert &&!error && <div className="alert-success">{alert}</div>}
            </div>
            <div className="header">
            <h3>Track stocks, explore historical data, get next-day price predictions, 
                and chat with an AI-driven system updated
                 with the latest stock news, analyst reports, and insights every 12 hours.</h3>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Filter through your stocks"
                    className="search-box"
                />
                <input
                    type="text"
                    onChange={handleNewStock} // Use handleNewStock to update searchNewStock state
                    placeholder="Search stock to follow"
                    className="search-box-right"
                />
            </div>

            <div className="container">
                {search.length === 0 && stocks.length === 0 && (
                    <div className="dummy">
                        <div className="message">
                    
                            <h2 className="startup-text">
                                You currently have no stocks listed under your
                                following. Add stocks by searching in the box to
                                the right.

                            </h2>
                               
                        </div>
                    </div>
                )}
                {(search.length !== 0 || stocks.length !== 0) && (
                    <div className="stock-list-column">
                        {stocks.map((stock) => (
                            <Stock
                                stock={stock}
                                Delete={deleteStock}
                                key={stock.id}
                            />
                        ))}
                    </div>
                )}
                
                <StockSearch addStock={addStock} search={searchNewStock} />
            </div>
        </>
    );
}

export default StockList;
