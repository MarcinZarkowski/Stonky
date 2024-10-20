import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const MyChart = ({ data, colors = {} }) => {
    const chartContainerRef = useRef();
    const chart = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const chartContainer = chartContainerRef.current;

        // Function to update dimensions
        const updateDimensions = () => {
            if (chartContainer) {
                setDimensions({
                    width: chartContainer.clientWidth,
                    height: chartContainer.clientHeight,
                });
            }
        };

        // Create a ResizeObserver to observe size changes
        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(chartContainer);
        
        // Initial dimension update
        updateDimensions();

        // Clean up the observer on component unmount
        return () => {
            resizeObserver.unobserve(chartContainer);
        };
    }, []);

    useEffect(() => {
        // Ensure the data is not undefined or missing expected fields
        if (!data || !data.next_day_predictionData || !data.actualsData || !data.predictionsData) {
            console.error("Data is missing required fields.");
            return;
        }

        const high = data.next_day_predictionData?.value + data.average_deviationData || 0;
        const low = data.next_day_predictionData?.value - data.average_deviationData || 0;
        const date = data.next_day_predictionData?.time || 0; 

        const {
            backgroundColor = 'transparent',
            predictedColor = 'rgb(255, 70, 85)',
            actualsColor = 'rgb(5, 209, 175)',
            textColor = 'white',
        } = colors;

        // Create chart instance
        chart.current = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: dimensions.width,
            height: dimensions.height,
        });

        chart.current.timeScale().fitContent();

        // Line series for actual and predicted data
        const actualsLine = chart.current.addLineSeries({
            color: actualsColor,
            lineWidth: 2,
        });
        
        const predictedLine = chart.current.addLineSeries({
            color: predictedColor,
            lineWidth: 2,
        });

        const candleStick = chart.current.addCandlestickSeries({
            upColor: '#a322ff', 
            downColor: '#a322ff',
            borderVisible: false, 
            wickUpColor: '#a322ff', 
            wickDownColor: '#a322ff',
        });

        // Set data for each line series
        if (data.actualsData) {
            actualsLine.setData(data.actualsData);
        }
        if (data.predictionsData) {
            predictedLine.setData(data.predictionsData);
        }
        if (data.next_day_predictionData && high && low && date) {
            candleStick.setData([{ 
                open: data.next_day_predictionData.value, 
                high, 
                low, 
                close: data.next_day_predictionData.value, 
                time: date 
            }]);
        }

        // Resize handler
        const handleResize = () => {
            if (chart.current) {
                chart.current.applyOptions({ width: dimensions.width, height: dimensions.height });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chart.current) {
                chart.current.remove();
            }
        };
    }, [data, colors, dimensions]); // Add dimensions to dependencies

    return (
        <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        </div>
    );
};

export default MyChart;
