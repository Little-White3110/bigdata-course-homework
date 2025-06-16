// Data for Chart 6: Cure Rate vs Mortality Rate (Butterfly Chart)
// Based on cumulative data as of 2015-03-10 from CSV
// Cure Rate = (Total Cases - Total Deaths) / Total Cases * 100
// Mortality Rate = Total Deaths / Total Cases * 100
// Guinea: Cases 3285.0, Deaths 2170.0 -> Cure Rate 33.9%, Mortality Rate 66.1%
// Liberia: Cases 9343.0, Deaths 4162.0 -> Cure Rate 55.5%, Mortality Rate 44.5%
// Sierra Leone: Cases 11619.0, Deaths 3629.0 -> Cure Rate 68.8%, Mortality Rate 31.2%
const chart6Data = {
    countries: ['几内亚', '利比里亚', '塞拉利昂'],
    cureRates: [33.9, 55.5, 68.8], // Percentage
    mortalityRates: [66.1, 44.5, 31.2] // Percentage
};

let chart6Instance = null;

function getChart6Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
    const axisLineColor = isDarkMode ? '#4B5563' : '#D1D5DB';
    const splitLineColor = isDarkMode ? '#374151' : '#E5E7EB';

    return {
        title: {
            text: '治愈率与死亡率对比 (截至2015-03-10)',
            left: 'center',
            textStyle: {
                fontFamily: 'Smiley Sans, sans-serif',
                color: textColor,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                let tooltip = params[0].name + '<br/>'; // Country name
                params.forEach(item => {
                    const value = Math.abs(item.value).toFixed(1); // Use absolute value for display
                    tooltip += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>` +
                               `${item.seriesName}: ${value}%<br/>`;
                });
                return tooltip;
            },
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' }
        },
        legend: {
            data: ['治愈率', '死亡率'],
            bottom: '3%',
            left: 'center',
            textStyle: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            inactiveColor: isDarkMode ? '#4B5563' : '#9CA3AF'
        },
        grid: {
            left: '3%',
            right: '10%', // Make space for labels on right
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '百分比 (%)',
            nameTextStyle: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            axisLine: { show: true, lineStyle: { color: axisLineColor } },
            axisLabel: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
                formatter: function (value) {
                    return Math.abs(value) + '%'; // Show absolute value for labels
                }
            },
            splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
            min: -100, // Adjust min/max for butterfly chart symmetry if needed
            max: 100
        },
        yAxis: {
            type: 'category',
            data: chart6Data.countries,
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: axisLineColor } },
            axisLabel: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' }
        },
        series: [
            {
                name: '治愈率',
                type: 'bar',
                stack: 'total', // Stacking helps create the butterfly effect if one series is negative
                barWidth: '35%',
                data: chart6Data.cureRates.map(value => ({
                    value: value,
                    itemStyle: { borderRadius: [0, 4, 4, 0] } // Rounded right corners
                })),
                itemStyle: { color: '#34D399' }, // Tailwind green-400
                emphasis: { focus: 'series' },
                label: {
                    show: true,
                    position: 'right', // Label on the right for positive bars
                    formatter: '{c}%',
                    color: textColor,
                    fontFamily: 'Smiley Sans, sans-serif'
                }
            },
            {
                name: '死亡率',
                type: 'bar',
                stack: 'total',
                barWidth: '35%',
                data: chart6Data.mortalityRates.map(value => ({
                    value: -value, // Use negative values for butterfly effect
                    itemStyle: { borderRadius: [4, 0, 0, 4] } // Rounded left corners
                })),
                itemStyle: { color: '#EF4444' }, // Tailwind red-500
                emphasis: { focus: 'series' },
                label: {
                    show: true,
                    position: 'left', // Label on the left for negative bars
                    formatter: function(params) {
                        return Math.abs(params.value).toFixed(1) + '%'; // Display absolute value
                    },
                    color: textColor,
                    fontFamily: 'Smiley Sans, sans-serif'
                }
            }
        ],
        toolbox: {
            feature: {
                saveAsImage: {
                    title: '保存图片',
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    iconStyle: { borderColor: textColor },
                },
                 dataView: {
                    readOnly: false,
                    title: '数据视图',
                    lang: ['数据视图', '关闭', '刷新'],
                    iconStyle: { borderColor: textColor },
                     optionToContent: function(opt) { // Corrected string escaping
                        let yAxisData = opt.yAxis[0].data; // Countries
                        let cureData = opt.series[0].data.map(d => d.value); // Positive values
                        let mortalityData = opt.series[1].data.map(d => Math.abs(d.value)); // Absolute negative values

                        let table = '<table style="width:100%;text-align:center;font-family: \'Smiley Sans\', sans-serif; color:' + textColor + '">';
                        table += '<thead><tr><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">国家</th><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">治愈率 (%)</th><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">死亡率 (%)</th></tr></thead><tbody>';
                        for (let i = 0; i < yAxisData.length; i++) {
                            table += '<tr>'
                                  + '<td style="padding:5px;">' + yAxisData[i] + '</td>'
                                  + '<td style="padding:5px;">' + cureData[i].toFixed(1) + '</td>'
                                  + '<td style="padding:5px;">' + mortalityData[i].toFixed(1) + '</td>'
                                  + '</tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    },
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    textColor: textColor,
                    textareaBorderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                    buttonColor: isDarkMode ? '#60A5FA' : '#3B82F6',
                    buttonTextColor: '#FFFFFF'
                }
            },
            iconStyle: { borderColor: textColor },
            right: 20
        },
        backgroundColor: 'transparent',
        animationDuration: 1000,
        animationEasing: 'cubicInOut'
    };
}

function initChart6(isDarkMode) {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included before this script.');
        const chartContainer = document.getElementById('chart6-container');
        if(chartContainer) {
            chartContainer.innerHTML = '<p class="text-red-500 text-center p-4 font-smiley">图表加载失败: ECharts 未找到。</p>';
        }
        return;
    }

    const chartDom = document.getElementById('chart6-container');
    if (!chartDom) {
        console.error('Chart6 container (id="chart6-container") not found in the DOM.');
        return;
    }

    if (chart6Instance && !chart6Instance.isDisposed()) {
        chart6Instance.dispose();
    }
    
    chart6Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart6Instance.setOption(getChart6Options(isDarkMode));
}

function updateChart6Theme(isDarkMode) {
    if (chart6Instance && !chart6Instance.isDisposed()) {
        chart6Instance.setOption(getChart6Options(isDarkMode), { replaceMerge: ['series', 'title', 'legend', 'tooltip', 'toolbox', 'xAxis', 'yAxis'] });
    } else {
        initChart6(isDarkMode);
    }
}

function resizeChart6() {
    if (chart6Instance && !chart6Instance.isDisposed()) {
        chart6Instance.resize();
    }
}
