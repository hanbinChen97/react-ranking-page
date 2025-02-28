import { createChart, CandlestickSeries } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';

const generateData = (numberOfCandles = 500, updatesPerCandle = 5, startAt = 100) => {
    const samplePoint = i => {
        const randomFactor = 25 + Math.random() * 25;
        return i * (0.5 + Math.sin(i / 1) * 0.2 + Math.sin(i / 2) * 0.4 + Math.sin(i / randomFactor) * 0.8 + Math.sin(i / 50) * 0.5) + 200 + i * 2;
    };

    const createCandle = (val, time) => ({
        time,
        open: val,
        high: val,
        low: val,
        close: val,
    });

    const updateCandle = (candle, val) => ({
        time: candle.time,
        close: val,
        open: candle.open,
        low: Math.min(candle.low, val),
        high: Math.max(candle.high, val),
    });

    const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
    const numberOfPoints = numberOfCandles * updatesPerCandle;
    const initialData = [];
    const realtimeUpdates = [];
    let lastCandle;
    let previousValue = samplePoint(-1);

    for (let i = 0; i < numberOfPoints; ++i) {
        if (i % updatesPerCandle === 0) {
            date.setUTCDate(date.getUTCDate() + 1);
        }
        const time = date.getTime() / 1000;
        let value = samplePoint(i);
        const diff = (value - previousValue) * Math.random();
        value = previousValue + diff;
        previousValue = value;

        if (i % updatesPerCandle === 0) {
            const candle = createCandle(value, time);
            lastCandle = candle;
            if (i >= startAt) {
                realtimeUpdates.push(candle);
            }
        } else {
            const newCandle = updateCandle(lastCandle, value);
            lastCandle = newCandle;
            if (i >= startAt) {
                realtimeUpdates.push(newCandle);
            } else if ((i + 1) % updatesPerCandle === 0) {
                initialData.push(newCandle);
            }
        }
    }

    return { initialData, realtimeUpdates };
};

const DataChart = () => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const intervalRef = useRef(null);
    
    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { type: 'solid', color: 'white' },
                textColor: 'black',
            },
        });
        
        chartRef.current = chart;
        
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        
        seriesRef.current = candlestickSeries;

        // Generate initial data and updates
        const data = generateData(100, 20, 50);
        candlestickSeries.setData(data.initialData);
        
        // Set up real-time updates
        function* getNextRealtimeUpdate(realtimeData) {
            for (const dataPoint of realtimeData) {
                yield dataPoint;
            }
            return null;
        }
        
        const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);
        
        intervalRef.current = setInterval(() => {
            const update = streamingDataProvider.next();
            if (update.done) {
                clearInterval(intervalRef.current);
                return;
            }
            candlestickSeries.update(update.value);
        }, 100);

        chart.timeScale().fitContent();
        chart.timeScale().scrollToPosition(5);

        // Handle resize
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            clearInterval(intervalRef.current);
            chart.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleGoToRealtime = () => {
        if (chartRef.current) {
            chartRef.current.timeScale().scrollToRealTime();
        }
    };

    return (
        <Card 
            title={
                <div className="flex justify-between items-center">
                    <span>实时数据趋势</span>
                    <button 
                        onClick={handleGoToRealtime}
                        className="px-4 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                        回到实时
                    </button>
                </div>
            }
            className="h-full"
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '12px' }}
        >
            <div 
                ref={chartContainerRef}
                className="w-full h-full"
            />
        </Card>
    );
};

export default DataChart; 