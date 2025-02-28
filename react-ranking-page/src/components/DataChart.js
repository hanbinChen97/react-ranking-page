import { createChart, LineSeries } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';

const DataChart = () => {
    const chartContainerRef = useRef();
    
    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
        });
        
        const lineSeries = chart.addSeries(LineSeries);
        
        lineSeries.setData([
            { time: '2019-04-11', value: 80.01 },
            { time: '2019-04-12', value: 96.63 },
            { time: '2019-04-13', value: 76.64 },
            { time: '2019-04-14', value: 81.89 },
            { time: '2019-04-15', value: 74.43 },
            { time: '2019-04-16', value: 80.01 },
            { time: '2019-04-17', value: 96.63 },
            { time: '2019-04-18', value: 76.64 },
            { time: '2019-04-19', value: 81.89 },
            { time: '2019-04-20', value: 74.43 },
        ]);

        // 自适应容器大小
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            chart.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Card 
            title="数据趋势图" 
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