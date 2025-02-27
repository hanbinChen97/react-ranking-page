import { createChart, LineSeries } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';

export const ChartComponent = () => {
    const chartContainerRef = useRef();
    
    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: 400,
            height: 300,
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
        <div className="p-4 bg-white rounded-lg">
            <h3 className="text-lg font-medium mb-2">数据趋势图</h3>
            <div 
                ref={chartContainerRef}
                className="h-[300px] w-full bg-gray-100"
            />
        </div>
    );
};

export default ChartComponent;