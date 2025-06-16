// Data for Chart 1: Cumulative Ebola Cases Trend
const chart1Data = {
    dates: ["2015-01-23", "2015-01-26", "2015-01-27", "2015-01-28", "2015-01-29", "2015-01-30", "2015-02-02", "2015-02-03", "2015-02-04", "2015-02-05", "2015-02-06", "2015-02-10", "2015-02-11", "2015-02-12", "2015-02-13", "2015-02-16", "2015-02-17", "2015-02-18", "2015-02-19", "2015-02-20", "2015-02-23", "2015-02-25", "2015-02-26", "2015-02-27", "2015-03-02", "2015-03-04", "2015-03-05", "2015-03-06", "2015-03-10"],
    guinea: [2873.0, 2909.0, 2917.0, 2917.0, 2921.0, 2920.0, 2959.0, 2975.0, 2975.0, 2986.0, 2988.0, 3044.0, 3044.0, 3068.0, 3081.0, 3101.0, 3108.0, 3108.0, 3115.0, 3120.0, 3155.0, 3155.0, 3175.0, 3190.0, 3205.0, 3205.0, 3237.0, 3248.0, 3285.0],
    liberia: [8524.0, 8524.0, 8622.0, 8622.0, 8643.0, 8643.0, 8668.0, 8729.0, 8745.0, 8745.0, 8745.0, 8881.0, 8881.0, 8881.0, 8931.0, 9007.0, 9007.0, 9007.0, 9096.0, 9096.0, 9229.0, 9238.0, 9265.0, 9265.0, 9265.0, 9265.0, 9249.0, 9249.0, 9343.0],
    sierraLeone: [10400.0, 10491.0, 10518.0, 10518.0, 10537.0, 10561.0, 10707.0, 10740.0, 10740.0, 10756.0, 10792.0, 10934.0, 10934.0, 10954.0, 10987.0, 11074.0, 11103.0, 11103.0, 11155.0, 11155.0, 11155.0, 11301.0, 11341.0, 11370.0, 11443.0, 11443.0, 11497.0, 11517.0, 11619.0]
};

let chart1Instance = null;

function getChart1Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937'; // Tailwind gray-200 and gray-800
    const axisLineColor = isDarkMode ? '#4B5563' : '#D1D5DB'; // Tailwind gray-600 and gray-300
    const splitLineColor = isDarkMode ? '#374151' : '#E5E7EB'; // Tailwind gray-700 and gray-200

    return {
        title: {
            text: '三国累计病例趋势',
            left: 'center',
            textStyle: {
                fontFamily: 'Smiley Sans, sans-serif',
                color: textColor,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            }
        },
        legend: {
            data: ['几内亚', '利比里亚', '塞拉利昂'],
            top: 'bottom',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            },
            inactiveColor: isDarkMode ? '#4B5563' : '#9CA3AF' // gray-600 and gray-400
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%', // Make space for legend
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    title: '保存图片',
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', // gray-900 and white
                    iconStyle: {
                        borderColor: textColor
                    },
                }
            },
            iconStyle: { // For other toolbox icons if any
                borderColor: textColor
            },
            right: 20
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chart1Data.dates,
            axisLine: { lineStyle: { color: axisLineColor } },
            axisLabel: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            axisTick: { lineStyle: { color: axisLineColor } }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: axisLineColor } },
            axisLabel: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            splitLine: { 
                lineStyle: { 
                    color: splitLineColor,
                    type: 'dashed'
                } 
            }
        },
        series: [
            {
                name: '几内亚',
                type: 'line',
                data: chart1Data.guinea,
                smooth: true,
                itemStyle: { color: '#F87171' }, // Tailwind red-400
                lineStyle: { width: 2.5 },
                emphasis: { focus: 'series', lineStyle: { width: 3.5 }}
            },
            {
                name: '利比里亚',
                type: 'line',
                data: chart1Data.liberia,
                smooth: true,
                itemStyle: { color: '#60A5FA' }, // Tailwind blue-400
                lineStyle: { width: 2.5 },
                emphasis: { focus: 'series', lineStyle: { width: 3.5 }}
            },
            {
                name: '塞拉利昂',
                type: 'line',
                data: chart1Data.sierraLeone,
                smooth: true,
                itemStyle: { color: '#34D399' }, // Tailwind green-400
                lineStyle: { width: 2.5 },
                emphasis: { focus: 'series', lineStyle: { width: 3.5 }}
            }
        ],
        backgroundColor: 'transparent', // Chart background itself transparent
        animationDuration: 1000,
        animationEasing: 'cubicInOut'
    };
}

function initChart1(isDarkMode) {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included before this script.');
        const chartContainer = document.getElementById('chart1-container');
        if(chartContainer) {
            chartContainer.innerHTML = '<p class="text-red-500 text-center p-4">图表加载失败: ECharts 未找到。</p>';
        }
        return;
    }

    const chartDom = document.getElementById('chart1-container');
    if (!chartDom) {
        console.error('Chart1 container (id="chart1-container") not found in the DOM.');
        return;
    }

    if (chart1Instance) {
        chart1Instance.dispose();
    }
    
    chart1Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart1Instance.setOption(getChart1Options(isDarkMode));
}

function updateChart1Theme(isDarkMode) {
    if (chart1Instance) {
        // Update options smoothly without full re-initialization
        chart1Instance.setOption(getChart1Options(isDarkMode), { replaceMerge: ['series'] });
    } else {
        // If chart wasn't initialized (e.g. ECharts lib failed to load), try initializing again
        initChart1(isDarkMode);
    }
}

function resizeChart1() {
    if (chart1Instance) {
        chart1Instance.resize();
    }
}
