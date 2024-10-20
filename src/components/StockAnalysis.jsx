import React, { useEffect, useRef, memo } from 'react';

function StockAnalysis({ ticker }) {
  const container = useRef();
  const scriptAdded = useRef(false);

  useEffect(() => {
    const addTradingViewScript = () => {
      if (scriptAdded.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      const widgetConfig = {
        autosize: true,
        symbol: ticker,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark", // Test with "light" if you encounter issues
        style: "1",
        locale: "en",
        withdateranges: true,
        allow_symbol_change: true,
        save_image: false,
        details: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
      };

      console.log("Widget Configuration:", widgetConfig); // Log the config

      script.innerHTML = JSON.stringify(widgetConfig);

      if (container.current) {
        container.current.innerHTML = '';
        container.current.appendChild(script);
        scriptAdded.current = true;
      }
    };

    const timeoutId = setTimeout(addTradingViewScript, 0);

    return () => {
      clearTimeout(timeoutId);
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [ticker]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(StockAnalysis);
