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

const DataChart = ({ balanceHistory, currentIndex, loading }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const lineSeriesRef = useRef(null);
    
    // 调试日志
    useEffect(() => {
        console.log('DataChart props:', {
            hasBalanceHistory: !!balanceHistory,
            historyLength: balanceHistory?.length,
            currentIndex,
            loading,
            containerHeight: chartContainerRef.current?.clientHeight,
            containerWidth: chartContainerRef.current?.clientWidth
        });
    }, [balanceHistory, currentIndex, loading]);

    // 初始化图表
    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 5;

        const initChart = () => {
            if (!chartContainerRef.current) {
                console.log('No container ref yet');
                return false;
            }
            
            const container = chartContainerRef.current;
            console.log('Container dimensions:', {
                width: container.clientWidth,
                height: container.clientHeight
            });

            // 确保容器有有效的尺寸
            if (!container.clientWidth || !container.clientHeight) {
                console.log('Container has invalid dimensions');
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Retrying initialization (${retryCount}/${maxRetries})...`);
                    return false;
                }
                // 如果多次重试后仍然没有尺寸，使用固定尺寸
                console.log('Using fallback dimensions');
            }

            try {
                // 如果已经存在图表，先清除
                if (chartRef.current) {
                    chartRef.current.remove();
                    chartRef.current = null;
                    lineSeriesRef.current = null;
                }

                console.log('Creating new chart...');
                const chart = createChart(container, {
                    width: container.clientWidth || 800,
                    height: Math.max(container.clientHeight || 300, 300),
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
                    crosshair: {
                        mode: 1,
                        vertLine: {
                            width: 8,
                            color: '#C3BCDB44',
                            style: 0,
                        },
                        horzLine: {
                            color: '#9B7DFF',
                            width: 1,
                            style: 2,
                        },
                    },
                });

                const series = chart.addSeries(LineSeries, { 
                    color: '#2962FF',
                    lineWidth: 2,
                    priceFormat: {
                        type: 'price',
                        precision: 2,
                        minMove: 0.01,
                    },
                });

                chartRef.current = chart;
                lineSeriesRef.current = series;

                console.log('Chart initialized successfully');
                return true;
            } catch (error) {
                console.error('Error initializing chart:', error);
                return false;
            }
        };

        const attemptInit = () => {
            if (!initChart() && retryCount < maxRetries) {
                requestAnimationFrame(attemptInit);
            }
        };

        attemptInit();

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                const { clientWidth, clientHeight } = chartContainerRef.current;
                chartRef.current.applyOptions({
                    width: clientWidth || 800,
                    height: Math.max(clientHeight || 300, 300),
                });
                chartRef.current.timeScale().fitContent();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                lineSeriesRef.current = null;
            }
        };
    }, []);

    // 更新图表数据
    useEffect(() => {
        if (!balanceHistory || balanceHistory.length === 0) {
            return;
        }

        // 如果图表还没有初始化，等待下一次渲染
        if (!lineSeriesRef.current) {
            console.log('Chart not initialized yet, waiting...');
            const timer = setTimeout(() => {
                console.log('Retrying data update...');
                updateChartData();
            }, 100);
            return () => clearTimeout(timer);
        }

        updateChartData();
    }, [balanceHistory, currentIndex]);

    // 更新图表数据的函数
    const updateChartData = () => {
        if (!lineSeriesRef.current || !balanceHistory || balanceHistory.length === 0) {
            console.log('Cannot update chart:', {
                hasLineSeriesRef: !!lineSeriesRef.current,
                hasBalanceHistory: !!balanceHistory,
                historyLength: balanceHistory?.length
            });
            return;
        }

        try {
            console.log('Updating chart data...');
            const currentData = balanceHistory.slice(0, currentIndex + 1);
            
            const timeValueMap = new Map();
            currentData.forEach(item => {
                if (!item.timestamp || !item.balance) {
                    console.log('Invalid data item:', item);
                    return;
                }
                
                const timestamp = Math.floor(item.timestamp / 1000);
                const value = parseFloat(item.balance);
                
                if (!isNaN(timestamp) && !isNaN(value)) {
                    if (!timeValueMap.has(timestamp) || item.timestamp > timeValueMap.get(timestamp).originalTimestamp) {
                        timeValueMap.set(timestamp, {
                            value: value,
                            originalTimestamp: item.timestamp
                        });
                    }
                }
            });

            const formattedData = Array.from(timeValueMap.entries())
                .map(([time, data]) => ({
                    time: parseInt(time, 10),
                    value: data.value
                }))
                .sort((a, b) => a.time - b.time);

            console.log('Formatted data sample:', formattedData.slice(0, 5));

            if (formattedData.length > 0) {
                lineSeriesRef.current.setData(formattedData);
                chartRef.current?.timeScale().fitContent();
            }
        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    };

    return (
        <Card 
            title="余额变化趋势" 
            className="h-full"
            bodyStyle={{ 
                height: 'calc(100% - 57px)', 
                padding: '12px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <div 
                    ref={chartContainerRef}
                    className="w-full h-full"
                    style={{ 
                        minHeight: '300px',
                        height: '300px',
                        width: '100%'
                    }}
                />
            )}
        </Card>
    );
};

export default DataChart;