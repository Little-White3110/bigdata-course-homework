// Data for Chart 5: Imported Cases Pie Chart
// Data is hardcoded based on description, not explicitly changed per suggestions
const chart5Data = {
    countries: ['美国', '英国', '西班牙', '马里'],
    cases: [4, 1, 1, 8]
};

let chart5Instance = null;

function getChart5Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937'; // Tailwind gray-200 and gray-800
    const colors = ['#F59E0B', '#EF4444', '#3B82F6', '#10B981']; // Amber, Red, Blue, Green variants

    const seriesData = chart5Data.countries.map((country, index) => ({
        value: chart5Data.cases[index],
        name: country,
        itemStyle: {
            color: colors[index]
        }
    }));

    return {
        title: {
            text: '输入型病例环形图',
            left: 'center',
            textStyle: {
                fontFamily: 'Smiley Sans, sans-serif',
                color: textColor,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left', 
            top: 'center', 
            data: chart5Data.countries,
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            },
            inactiveColor: isDarkMode ? '#4B5563' : '#9CA3AF'
        },
        series: [
            {
                name: '输入型病例数',
                type: 'pie',
                radius: ['40%', '70%'], 
                center: ['60%', '50%'], 
                data: seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: true,
                    formatter: '{b}: {d}%', 
                    color: textColor,
                    fontFamily: 'Smiley Sans, sans-serif',
                },
                labelLine: {
                    show: true,
                    lineStyle: {
                         color: isDarkMode ? '#6B7280' : '#9CA3AF' 
                    }
                },
                 itemStyle: {
                    borderColor: isDarkMode ? '#111827' : '#FFFFFF', 
                    borderWidth: 2
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200 + idx * 50;
                }
            }
        ],
        toolbox: {
            feature: {
                saveAsImage: {
                    title: '保存图片',
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    iconStyle: { borderColor: textColor },
                    pixelRatio: 2
                },
                 dataView: {
                    readOnly: false,
                    title: '数据视图',
                    lang: ['数据视图', '关闭', '刷新'],
                    iconStyle: { borderColor: textColor },
                     optionToContent: function(opt) { // Corrected string escaping
                        let seriesData = opt.series[0].data;
                        let table = '<table style="width:100%;text-align:center;font-family: \'Smiley Sans\', sans-serif; color:' + textColor + '">';
                        table += '<thead><tr><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">国家</th><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">病例数</th></tr></thead><tbody>';
                        seriesData.forEach(item => {
                            table += '<tr>'
                                  + '<td style="padding:5px;">' + item.name + '</td>'
                                  + '<td style="padding:5px;">' + item.value + '</td>'
                                  + '</tr>';
                        });
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
            right: 20,
            top: 10
        },
        backgroundColor: 'transparent',
        animationDurationUpdate: 500,
        animationEasingUpdate: 'cubicInOut'
    };
}

function initChart5(isDarkMode) {
     if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included before this script.');
        const chartContainer = document.getElementById('chart5-container');
        if(chartContainer) {
            chartContainer.innerHTML = '<p class="text-red-500 text-center p-4 font-smiley">图表加载失败: ECharts 未找到。</p>';
        }
        return;
    }

    const chartDom = document.getElementById('chart5-container');
    if (!chartDom) {
        console.error('Chart5 container (id="chart5-container") not found in the DOM.');
        return;
    }

    if (chart5Instance && !chart5Instance.isDisposed()) {
        chart5Instance.dispose();
    }
    
    chart5Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart5Instance.setOption(getChart5Options(isDarkMode));
}

function updateChart5Theme(isDarkMode) {
    if (chart5Instance && !chart5Instance.isDisposed()) {
        chart5Instance.setOption(getChart5Options(isDarkMode), { replaceMerge: ['series', 'title', 'legend', 'tooltip', 'toolbox'] });
    } else {
        initChart5(isDarkMode);
    }
}

function resizeChart5() {
    if (chart5Instance && !chart5Instance.isDisposed()) {
        chart5Instance.resize();
    }
}
