import { Link, useNavigate } from "react-router-dom";
import "../styles/Stock.css";
import StockTicker from "./StockTicker"


function Stock({ stock, Delete }) {
    const formattedDate = new Date(stock.created_at).toLocaleDateString("en-US");
    const navigate = useNavigate();

    const handleClick = () => {
       navigate(`/stock/${stock.stock_ticker}`);
    }

    return (
        <div className="stock-button" >
        
        <div className="ticker-holder">
        <StockTicker ticker={stock.stock_ticker} market={stock.stock_market} />
        </div>
        <p className="stock-date">Added - {formattedDate}</p>
        <div className="buttons-container">
        <button className="stock-view" onClick={handleClick}>View {stock.stock_ticker} </button>
        <button 
          className="stock-delete" 
          onClick={(e) => {
            Delete(stock.id, stock.stock_ticker);
          }}
        >
          Unfollow
        </button>
        </div>
      </div>
    );
  }
export default Stock;