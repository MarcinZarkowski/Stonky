import React, { useEffect, useRef } from 'react';

const StockSymbolInfo = ({ ticker }) => {
  const container = useRef();

  useEffect(() => {
    // Create the script element for the TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;

    // Define the widget configuration
    script.innerHTML = JSON.stringify({
      symbol: ticker,
      width: "100%",
      locale: "en",
      colorTheme: "dark",
      isTransparent: true,
    });

    // Append the script to the container
    if (container.current) {
      container.current.innerHTML = ''; // Clear any existing content
      container.current.appendChild(script);
    }

    // Cleanup on component unmount
    return () => {
      if (container.current) {
        container.current.innerHTML = ''; // Clear the container
      }
    };
  }, [ticker]); // Update when symbol or width changes

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: "100%", height:"400px" }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default StockSymbolInfo;
