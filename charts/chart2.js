// Data for Chart 2: Case Type Distribution (Radar Chart) for 2015-03-10
// Data updated based on CSV for 2015-03-10:
// Guinea: Confirmed 2871.0, Probable 392.0, Suspected 22.0
// Liberia: Confirmed 3150.0, Probable 1879.0, Suspected 4314.0
// Sierra Leone: Confirmed 8428.0, Probable 287.0, Suspected 2904.0
const chart2Data = {
    indicators: [
        // Max values adjusted based on the new data.
        // Max Confirmed: 8428 (Sierra Leone) -> Using 9000
        // Max Probable: 1879 (Liberia) -> Using 2000
        // Max Suspected: 4314 (Liberia) -> Using 4500
        { name: '确诊 (Confirmed)', max: 9000 },
        { name: '疑似 (Probable)', max: 2000 },
        { name: '可能 (Suspected)', max: 4500 }
    ],
    countriesData: [
        {
            name: '几内亚',
            value: [2871.0, 392.0, 22.0],
            color: '#F87171' // Tailwind red-400
        },
        {
            name: '利比里亚',
            value: [3150.0, 1879.0, 4314.0],
            color: '#60A5FA' // Tailwind blue-400
        },
        {
            name: '塞拉利昂',
            value: [8428.0, 287.0, 2904.0],
            color: '#34D399' // Tailwind green-400
        }
    ]
};

let chart2Instance = null;

function getChart2Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
    const axisLineColor = isDarkMode ? '#4B5563' : '#D1D5DB';
    const splitLineColorRadar = isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(209, 213, 219, 0.6)';
    const splitAreaColorRadar = isDarkMode ?
        ['rgba(55, 65, 81, 0.2)', 'rgba(55, 65, 81, 0.3)'] :
        ['rgba(229, 231, 235, 0.3)', 'rgba(229, 231, 235, 0.5)'];

    return {
        title: {
            text: '病例类型分布雷达图 (2015-03-10)',
            left: 'center',
            textStyle: {
                fontFamily: 'Smiley Sans, sans-serif',
                color: textColor,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            }
        },
        legend: {
            data: chart2Data.countriesData.map(c => c.name),
            top: 'bottom',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            },
            inactiveColor: isDarkMode ? '#4B5563' : '#9CA3AF'
        },
        radar: {
            indicator: chart2Data.indicators,
            shape: 'circle',
            center: ['50%', '50%'],
            radius: '65%',
            axisName: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
                fontSize: 12,
                padding: [3, 5]
            },
            splitLine: {
                lineStyle: {
                    color: splitLineColorRadar,
                    width: 1,
                    type: 'dashed'
                }
            },
            splitArea: {
                areaStyle: {
                    color: splitAreaColorRadar,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 5,
                }
            },
            axisLine: {
                lineStyle: {
                    color: axisLineColor,
                    width: 1.5
                }
            }
        },
        series: [{
            name: '病例类型分布',
            type: 'radar',
            data: chart2Data.countriesData.map(country => ({
                name: country.name,
                value: country.value,
                itemStyle: { color: country.color },
                lineStyle: { width: 2.5 },
                areaStyle: { opacity: 0.3 },
                symbol: 'circle',
                symbolSize: 6,
                emphasis: {
                    lineStyle: { width: 3.5 },
                    areaStyle: { opacity: 0.5 }
                }
            }))
        }],
        backgroundColor: 'transparent',
        animationDuration: 1000,
        animationEasing: 'cubicInOut'
    };
}

function initChart2(isDarkMode) {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included before this script.');
        const chartContainer = document.getElementById('chart2-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<p class=\"text-red-500 text-center p-4\">图表加载失败: ECharts 未找到。</p>';
        }
        return;
    }

    const chartDom = document.getElementById('chart2-container');
    if (!chartDom) {
        console.error('Chart2 container (id=\"chart2-container\") not found in the DOM.');
        return;
    }

    if (chart2Instance && !chart2Instance.isDisposed()) {
        chart2Instance.dispose();
    }

    chart2Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart2Instance.setOption(getChart2Options(isDarkMode));
}

function updateChart2Theme(isDarkMode) {
    if (chart2Instance && !chart2Instance.isDisposed()) {
        chart2Instance.setOption(getChart2Options(isDarkMode), { replaceMerge: ['series'] });
    } else {
        initChart2(isDarkMode);
    }
}

function resizeChart2() {
    if (chart2Instance && !chart2Instance.isDisposed()) {
        chart2Instance.resize();
    }
}
