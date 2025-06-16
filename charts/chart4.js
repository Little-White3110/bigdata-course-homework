// Data for Chart 4: New Cases in 21-day period (Feb 05 to Feb 25, 2015), shown weekly.
// Calculated weekly new cases:
// Week 1 (Feb 05 - Feb 11): Guinea: 69, Liberia: 136, Sierra Leone: 194
// Week 2 (Feb 12 - Feb 18): Guinea: 64, Liberia: 126, Sierra Leone: 169
// Week 3 (Feb 19 - Feb 25): Guinea: 47, Liberia: 231, Sierra Leone: 198
const chart4WeeklyData = {
    timeline: ['第一周 (2/5-2/11)', '第二周 (2/12-2/18)', '第三周 (2/19-2/25)'],
    countries: ['几内亚', '利比里亚', '塞拉利昂'],
    colors: ['#F87171', '#60A5FA', '#34D399'], // Tailwind red-400, blue-400, green-400
    weeklyNewCases: [
        // Week 1
        [
            { value: 69, itemStyle: { color: '#F87171', borderRadius: [4, 4, 0, 0] } }, // Guinea
            { value: 136, itemStyle: { color: '#60A5FA', borderRadius: [4, 4, 0, 0] } }, // Liberia
            { value: 194, itemStyle: { color: '#34D399', borderRadius: [4, 4, 0, 0] } }  // Sierra Leone
        ],
        // Week 2
        [
            { value: 64, itemStyle: { color: '#F87171', borderRadius: [4, 4, 0, 0] } },
            { value: 126, itemStyle: { color: '#60A5FA', borderRadius: [4, 4, 0, 0] } },
            { value: 169, itemStyle: { color: '#34D399', borderRadius: [4, 4, 0, 0] } }
        ],
        // Week 3
        [
            { value: 47, itemStyle: { color: '#F87171', borderRadius: [4, 4, 0, 0] } },
            { value: 231, itemStyle: { color: '#60A5FA', borderRadius: [4, 4, 0, 0] } },
            { value: 198, itemStyle: { color: '#34D399', borderRadius: [4, 4, 0, 0] } }
        ]
    ]
};

let chart4Instance = null;

function getChart4Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
    const axisLineColor = isDarkMode ? '#4B5563' : '#D1D5DB';
    const splitLineColor = isDarkMode ? '#374151' : '#E5E7EB';

    const baseOption = {
        timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 2000, // ms
            data: chart4WeeklyData.timeline,
            label: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            },
            lineStyle: { color: axisLineColor },
            itemStyle: { color: axisLineColor, borderColor: axisLineColor },
            checkpointStyle: {
                color: isDarkMode ? '#F59E0B' : '#FBBF24', // amber-500/400
                borderColor: textColor
            },
            controlStyle: {
                itemSize: 18,
                color: textColor,
                borderColor: textColor,
                playIcon: 'path://M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384zM384 698.7V325.3L704 512l-320 186.7z', // Play icon
                stopIcon: 'path://M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384zM320 320h384v384H320V320z' // Stop icon
            },
            bottom: '3%',
            left:'10%',
            right: '10%'
        },
        title: {
            text: '21天内周新增病例数 (动态)',
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
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '18%', // Adjusted for timeline
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chart4WeeklyData.countries,
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: axisLineColor } },
            axisLabel: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' }
        },
        yAxis: {
            type: 'value',
            name: '新增病例数',
            nameTextStyle: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            axisLine: { show: true, lineStyle: { color: axisLineColor } },
            axisLabel: { color: textColor, fontFamily: 'Smiley Sans, sans-serif' },
            splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } }
        },
        series: [{
            name: '新增病例',
            type: 'bar',
            barWidth: '60%',
            emphasis: {
                focus: 'series',
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true,
                position: 'top',
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
                formatter: '{c}'
            }
        }],
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
                    optionToContent: function(opt) {
                        // opt contains the full options object. For timeline, it's structured.
                        // We need baseOption for categories, and options array for series data per timeline step.
                        const timelineLabels = opt.timeline[0].data;
                        const countryCategories = opt.xAxis[0].data; // from baseOption or first option if not in base

                        let table = '<table style="width:100%;text-align:center;font-family: \'Smiley Sans\', sans-serif; color:' + textColor + '">';
                        table += '<thead><tr><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">周数</th>';
                        countryCategories.forEach(country => {
                            table += '<th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">' + country + '</th>';
                        });
                        table += '</tr></thead><tbody>';

                        // Data is in opt.options array, matching timelineLabels
                        opt.options.forEach((optionData, index) => {
                            table += '<tr><td style="padding:5px;">' + timelineLabels[index] + '</td>';
                            // Assuming series data is [{value, itemStyle}, ...]
                            let seriesValues = optionData.series[0].data.map(dp => dp.value !== undefined ? dp.value : dp); // handle if data is just values or objects
                            seriesValues.forEach(val => {
                                table += '<td style="padding:5px;">' + val + '</td>';
                            });
                            table += '</tr>';
                        });
                        table += '</tbody></table>';
                        return table;
                    },
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    textColor: textColor,
                }
            },
            iconStyle: { borderColor: textColor },
            right: 20
        },
        backgroundColor: 'transparent',
    };

    const options = chart4WeeklyData.weeklyNewCases.map(weekData => ({
        series: [{ data: weekData }]
    }));

    return { baseOption, options };
}

function initChart4(isDarkMode) {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included before this script.');
        const chartContainer = document.getElementById('chart4-container');
        if(chartContainer) {
            chartContainer.innerHTML = '<p class="text-red-500 text-center p-4 font-smiley">图表加载失败: ECharts 未找到。</p>';
        }
        return;
    }

    const chartDom = document.getElementById('chart4-container');
    if (!chartDom) {
        console.error('Chart4 container (id="chart4-container") not found in the DOM.');
        return;
    }

    if (chart4Instance && !chart4Instance.isDisposed()) {
        chart4Instance.dispose();
    }

    chart4Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart4Instance.setOption(getChart4Options(isDarkMode));
}

function updateChart4Theme(isDarkMode) {
    if (chart4Instance && !chart4Instance.isDisposed()) {
        chart4Instance.setOption(getChart4Options(isDarkMode)); // Re-set full options for timeline theme update
    } else {
        initChart4(isDarkMode);
    }
}

function resizeChart4() {
    if (chart4Instance && !chart4Instance.isDisposed()) {
        chart4Instance.resize();
    }
}
