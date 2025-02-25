// import { createChart } from 'lightweight-charts';
import React from 'react';

export const ChartComponent = () => {
    // 注释掉图表相关代码，保留基本结构
    /*
    const chartContainerRef = useRef();
    
    useEffect(() => {
        const chart = createChart(chartContainerRef.current);
        const lineSeries = chart.addLineSeries();
        
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
        
        return () => {
            chart.remove();
        };
    }, []);
    */

    return (
        <div className="p-4 bg-white rounded-lg">
            <h3 className="text-lg font-medium mb-2">图表区域</h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-100">
                图表功能待实现
            </div>
        </div>
    );
};

export default ChartComponent;