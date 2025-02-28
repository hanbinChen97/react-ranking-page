import { createChart, LineSeries } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';
import { Card, Spin } from 'antd';

// 生成示例数据的辅助函数
const generateLineData = (numberOfPoints = 500) => {
    const randomFactor = 25 + Math.random() * 25;
    const samplePoint = i => 
        i * (0.5 + 
            Math.sin(i / 10) * 0.2 + 
            Math.sin(i / 20) * 0.4 + 
            Math.sin(i / randomFactor) * 0.8 + 
            Math.sin(i / 500) * 0.5) + 
        200;

    const res = [];
    const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
    
    for (let i = 0; i < numberOfPoints; ++i) {
        const time = Math.floor(date.getTime() / 1000);
        const value = samplePoint(i);
        res.push({ time, value });
        date.setUTCDate(date.getUTCDate() + 1);
    }
    
    return res;
};

const DataChart = ({ balanceHistory, loading }) => {
    const chartContainerRef = useRef();
    
    useEffect(() => {
        console.log('接收到的原始数据:', balanceHistory);
        
        if (!chartContainerRef.current) {
            console.log('图表容器未准备好');
            return;
        }

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { type: 'solid', color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });
        
        console.log('图表创建完成，容器尺寸:', {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight
        });

        // 添加一条线来显示余额变化
        const lineSeries = chart.addSeries(LineSeries, { 
            color: '#2962FF',
            lineWidth: 2,
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        });

        // 如果有余额历史数据，则进行处理和显示
        if (balanceHistory && balanceHistory.length > 0) {
            console.log('开始处理数据...');
            
            // 使用Map来处理重复时间戳
            const timeValueMap = new Map();
            
            balanceHistory.forEach(item => {
                const timestamp = Math.floor(item.timestamp / 1000); // 转换为秒级时间戳
                const value = parseFloat(item.balance);
                
                // 如果有重复的时间戳，保留最新的值
                if (!timeValueMap.has(timestamp) || item.timestamp > timeValueMap.get(timestamp).originalTimestamp) {
                    timeValueMap.set(timestamp, {
                        value: value,
                        originalTimestamp: item.timestamp
                    });
                }
            });

            // 转换为数组并排序
            const formattedData = Array.from(timeValueMap.entries())
                .map(([time, data]) => ({
                    time: time,
                    value: data.value
                }))
                .sort((a, b) => a.time - b.time)
                .filter(item => !isNaN(item.time) && !isNaN(item.value));
            
            console.log('处理后的数据:', formattedData);
            
            if (formattedData.length > 0) {
                console.log('设置图表数据，数据点数量:', formattedData.length);
                lineSeries.setData(formattedData);
                chart.timeScale().fitContent();
            } else {
                console.log('警告：处理后没有有效数据点');
            }
        } else {
            console.log('没有收到余额历史数据或数据为空');
        }

        // 自适应容器大小
        const handleResize = () => {
            const newWidth = chartContainerRef.current.clientWidth;
            const newHeight = chartContainerRef.current.clientHeight;
            console.log('窗口调整大小:', { width: newWidth, height: newHeight });
            chart.applyOptions({
                width: newWidth,
                height: newHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            console.log('清理图表组件');
            chart.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, [balanceHistory]);

    return (
        <Card 
            title="余额变化趋势" 
            className="h-full"
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '12px' }}
        >
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <div 
                    ref={chartContainerRef}
                    className="w-full h-full"
                    style={{ minHeight: '300px' }}  // 添加最小高度确保图表可见
                />
            )}
        </Card>
    );
};

export default DataChart;