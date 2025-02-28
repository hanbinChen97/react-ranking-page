import { createChart, LineSeries } from 'lightweight-charts';
import React, { useRef, useEffect, useState } from 'react';
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

const DataChart = ({ balanceHistory, currentIndex, loading }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const lineSeriesRef = useRef(null);
    
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 创建图表（仅在组件挂载时创建一次）
        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
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

            // 添加线图系列
            lineSeriesRef.current = chartRef.current.addSeries(LineSeries, { 
                color: '#2962FF',
                lineWidth: 2,
                priceFormat: {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01,
                },
            });

            // 处理窗口大小变化
            const handleResize = () => {
                if (chartRef.current && chartContainerRef.current) {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                        height: chartContainerRef.current.clientHeight,
                    });
                }
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                if (chartRef.current) {
                    chartRef.current.remove();
                    chartRef.current = null;
                }
            };
        }
    }, []);

    // 更新图表数据
    useEffect(() => {
        if (!lineSeriesRef.current || !balanceHistory || balanceHistory.length === 0) return;

        // 处理数据，只显示到当前索引的数据
        const currentData = balanceHistory.slice(0, currentIndex + 1);
        
        // 使用Map处理重复时间戳
        const timeValueMap = new Map();
        currentData.forEach(item => {
            const timestamp = Math.floor(item.timestamp / 1000);
            const value = parseFloat(item.balance);
            
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

        // 更新图表数据
        if (formattedData.length > 0) {
            lineSeriesRef.current.setData(formattedData);
            chartRef.current?.timeScale().fitContent();
        }
    }, [balanceHistory, currentIndex]);

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
                    style={{ minHeight: '300px' }}
                />
            )}
        </Card>
    );
};

export default DataChart;