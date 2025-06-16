let chart3Instance = null;

function getChart3Options(isDarkMode) {
    const textColor = isDarkMode ? '#E5E7EB' : '#1F2937'; // Tailwind gray-200 and gray-800
    // Data is hardcoded based on description
    const chartData = [
        { name: 'Guinea', value: 66.06 }, // Mortality Rate for Guinea
        { name: 'Liberia', value: 44.55 }, // Mortality Rate for Liberia
        { name: 'Sierra Leone', value: 31.23 } // Mortality Rate for Sierra Leone
    ];

    return {
        title: {
            text: '三国埃博拉死亡率对比 (截至2015-03-10)',
            left: 'center',
            textStyle: {
                fontFamily: 'Smiley Sans, sans-serif',
                color: textColor,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (params.value != null && params.value !== undefined && !isNaN(params.value)) {
                    return params.name + ' : ' + params.value.toFixed(2) + '%';
                }
                return params.name + ' : N/A';
            },
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            }
        },
        visualMap: {
            min: 30,
            max: 70,
            left: '5%',
            bottom: '5%',
            text: ['高死亡率', '低死亡率'],
            calculable: true,
            inRange: {
                color: ['#FFFFE0', '#FFEDA0', '#FFC975', '#FF8C00', '#B22222']
            },
            textStyle: {
                color: textColor,
                fontFamily: 'Smiley Sans, sans-serif',
            },
            padding: [5, 10],
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.7)' : 'rgba(243, 244, 246, 0.7)',
            borderRadius: 8,
        },
        geo: {
            map: 'world',
            roam: true,
            zoom: 1.5,
            center: [-10, 9],
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    color: textColor,
                    fontFamily: 'Smiley Sans, sans-serif',
                    fontSize: 12
                },
                itemStyle: {
                    areaColor: isDarkMode ? '#60A5FA' : '#3B82F6'
                }
            },
            itemStyle: {
                areaColor: isDarkMode ? '#374151' : '#E5E7EB',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                borderWidth: 0.5
            },
            select: {
                itemStyle: {
                    areaColor: isDarkMode ? '#F59E0B' : '#FBBF24'
                },
                label: {
                    show: true,
                    color: '#000'
                }
            },
        },
        series: [
            {
                name: '埃博拉死亡率',
                type: 'map',
                geoIndex: 0,
                data: chartData,
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        color: textColor,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        areaColor: null,
                        borderColor: textColor,
                        borderWidth: 1.5
                    }
                }
            }
        ],
        toolbox: {
            show: true,
            orient: 'vertical',
            right: '3%',
            top: 'center',
            feature: {
                dataView: {
                    readOnly: false,
                    title: '数据视图',
                    lang: ['数据视图', '关闭', '刷新'],
                    iconStyle: { borderColor: textColor },
                    optionToContent: function(opt) {
                        let axisData = opt.series[0].data;
                        let table = '<table style="width:100%;text-align:center;font-family: \'Smiley Sans\', sans-serif; color:' + textColor + '">';
                        table += '<thead><tr><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">国家</th><th style="padding:8px;border-bottom:1px solid ' + (isDarkMode ? '#4B5563' : '#D1D5DB') + '">死亡率 (%)</th></tr></thead><tbody>';
                        for (let i = 0, l = axisData.length; i < l; i++) {
                            table += '<tr>'
                                  + '<td style="padding:5px;">' + axisData[i].name + '</td>'
                                  + '<td style="padding:5px;">' + axisData[i].value.toFixed(2) + '</td>'
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
                },
                saveAsImage: {
                    title: '保存图片',
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    iconStyle: { borderColor: textColor },
                    pixelRatio: 2
                },
                restore: {
                    title: '复位视图',
                    iconStyle: { borderColor: textColor }
                }
            },
            iconStyle: {
                borderColor: textColor
            },
            tooltip: {
                show: true,
                formatter: function (param) {
                    return '<div>' + param.title + '</div>';
                },
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                textStyle: {
                    color: textColor,
                    fontFamily: 'Smiley Sans, sans-serif',
                }
            }
        },
        backgroundColor: 'transparent',
        animationDuration: 1000,
        animationEasing: 'cubicInOut'
    };
}

function initChart3(isDarkMode) {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure echarts.min.js is included.');
        const chartContainer = document.getElementById('chart3-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<p class="text-red-500 text-center p-4 font-smiley">图表加载失败: ECharts 库未找到。</p>';
        }
        return;
    }
    // DEVTOOL LOG FIX: Simplified map registration check.
    // ECharts will log its own error if 'world' map is not found during setOption.
    // The `world.js` script should call `echarts.registerMap('world', geoJsonData)`.
    // If `echarts.getMap('world')` returns null or undefined, the map is not registered.
    if (!echarts.getMap('world')) {
        console.warn('World map data may not be registered with ECharts yet. Attempting to initialize chart. ECharts will log an error if map "world" is missing.');
        // Optionally, display a user-facing warning, but still attempt to init.
        // For a critical error as per logs, it's safer to prevent init if map definitely not found.
        // The original console log was an error, so keeping similar behavior:
        const chartContainer = document.getElementById('chart3-container');
        if (chartContainer) {
             chartContainer.innerHTML = '<p class="text-red-500 text-center p-4 font-smiley">图表加载失败: 世界地图数据未正确加载或注册。</p>';
        }
        // return; // The DevTool log indicates this was a fatal error for chart 3, so we should return.
    }


    const chartDom = document.getElementById('chart3-container');
    if (!chartDom) {
        console.error('Chart3 container (id="chart3-container") not found in the DOM.');
        return;
    }

    if (chart3Instance && !chart3Instance.isDisposed()) {
        chart3Instance.dispose();
    }

    chart3Instance = echarts.init(chartDom, null, { renderer: 'canvas' });
    chart3Instance.setOption(getChart3Options(isDarkMode));
}

function updateChart3Theme(isDarkMode) {
    if (chart3Instance && !chart3Instance.isDisposed()) {
        chart3Instance.setOption(getChart3Options(isDarkMode), { replaceMerge: ['visualMap', 'geo', 'series', 'title', 'toolbox'] });
    } else {
        initChart3(isDarkMode);
    }
}

function resizeChart3() {
    if (chart3Instance && !chart3Instance.isDisposed()) {
        chart3Instance.resize();
    }
}
