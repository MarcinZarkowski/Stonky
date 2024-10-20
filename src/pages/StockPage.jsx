import TradingViewWidget from "../components/StockChart";
import { useParams } from "react-router-dom";
import "../styles/StockPage.css";
import MyChart from "../components/MyChart";
import api from "../api";
import { useState, useEffect, useRef } from "react";
import Chat from "../components/ChatterBox.jsx";
import StockAnalysis from "../components/StockAnalysis";

function StockPage() {
    const { ticker } = useParams();
    const dataRetrieved = useRef(false);
    const [actuals, setActuals] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [average_deviation, setAverageDeviation] = useState(0); // Initialized to 0 for safer operations
    const [next_day_prediction, setNextDayPrediction] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
   // const [chartType, setChartType] = useState("general");

    useEffect(() => {
        if (!dataRetrieved.current) {
            getData(ticker);
            dataRetrieved.current = true;
        }
    }, [ticker]);
    /*
    const handleChartChange = () => {
        setChartType((prevChartType) => (prevChartType === "general" ? "technical" : "general"));
    };*/

    const getData = async (ticker) => {
        setLoading(true); // Start loading state
        try {
            const res = await api.get(`api/get-stock-pred/${ticker}/`);
            console.log(res);

            if (res.data.status === 'failed') {
                setError(res.data.message);
                return;
            }
            setActuals(res.data.actuals);
            setPredictions(res.data.predictions);
            setAverageDeviation(res.data.average_deviance || 0); // Default to 0 if undefined
            setNextDayPrediction(res.data.next_day_prediction || {}); // Default to empty object
        } catch (err) {
            if (err.status === 401) {
                setError("You are not authorized to view this page. Please log in or refresh the page.");
            } else {
                setError(err.message || "An error occurred");
                console.log("Error fetching data:", err.message);
            }
        } finally {
            setLoading(false); // End loading state
        }
    };

    const Data = {
        actualsData: actuals,
        predictionsData: predictions,
        next_day_predictionData: next_day_prediction,
        average_deviationData: average_deviation,
    };

    return (
        <div className="page-container">
            <div className="stock-page-container">
                <div className="tradview-container">
                 
                     
    
                    <div className="stock-history-container">
                         <TradingViewWidget ticker={ticker} />
    
                    </div>
                    
                    <div className="mychart-container">
                        <h2 className="title">{ticker} Next Day Predictions</h2>
                        {loading ? (
                            <h2 className="title">Processing data and predicting...</h2>
                        ) : (
                            <>
                                {error && <p className="title">{error}</p>}
                                {actuals.length > 0 && (
                                    <>
                                        <p className="description">
                                            The model is predicting a price of 
                                            <span className="numbers"> {Data.next_day_predictionData.value.toFixed(2)}</span>.
                                            However, based on the model's performance predicting {ticker}'s prices over the last year, 
                                            tomorrow's actual price may span from 
                                            <span className="numbers"> {((Data.next_day_predictionData.value - Data.average_deviationData) < 0 
                                                    ? 0 
                                                    : (Data.next_day_predictionData.value - Data.average_deviationData)
                                                ).toFixed(2)} </span> 
                                            to 
                                            <span className="numbers"> { (Data.next_day_predictionData.value + Data.average_deviationData).toFixed(2) }</span>.
                                        </p>
                                        <div className="header-container">
                                            <p className="red">Predicted values</p><> ~~ </>
                                            <p className="green">Actual values</p><> ~~ </> 
                                            <p className="purple">{Data.next_day_predictionData.time} Prediction</p>
                                        </div>
                                        <div className="my-chart-container">
                                            <MyChart data={Data} />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="right-side">
                    <Chat ticker={ticker} />
                </div>
            </div>
        </div>
    );
}

export default StockPage;
