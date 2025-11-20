<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import { fetchWeeklyKLine } from '../services/itick';
import { ElMessage } from 'element-plus';

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  chartTitle: {
      type: String,
      default: ''
  }
});

const chartRef = ref(null);
let myChart = null;

// Fallback Mock Data
const generateWeeklyData = () => {
  const data = [];
  const dates = [];
  let baseValue = 15;
  const weeks = 52;
  const oneWeek = 7 * 24 * 3600 * 1000;
  let date = new Date().getTime() - weeks * oneWeek;

  for (let i = 0; i < weeks; i++) {
    date += oneWeek;
    const dateStr = new Date(date).toISOString().split('T')[0];
    const open = baseValue + (Math.random() - 0.5) * 2;
    const close = baseValue + (Math.random() - 0.5) * 2;
    const low = Math.min(open, close) - Math.random() * 1;
    const high = Math.max(open, close) + Math.random() * 1;
    baseValue = close;
    data.push([open, close, low, high]);
    dates.push(dateStr);
  }
  return { categoryData: dates, values: data };
};

const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value, 'dark');
    loadChartData();
  }
};

const loadChartData = async () => {
  if (!myChart) return;
  
  myChart.showLoading();

  let categoryData = [];
  let values = [];

  try {
    const apiData = await fetchWeeklyKLine(props.code);
    
    if (Array.isArray(apiData)) {
      apiData.forEach(item => {
        let dateStr, open, close, low, high;

        if (Array.isArray(item)) {
          dateStr = item[0];
          open = item[1];
          high = item[2];
          low = item[3];
          close = item[4];
        } else {
          dateStr = item.t || item.time || item.date || item.created_at;
          open = item.o || item.open;
          close = item.c || item.close;
          low = item.l || item.low;
          high = item.h || item.high;
        }

        // Parse date
        if (typeof dateStr === 'number') {
           if (dateStr > 10000000 && dateStr < 99999999) {
               const s = dateStr.toString();
               dateStr = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
           } else {
               dateStr = new Date(dateStr * 1000).toISOString().split('T')[0];
           }
        } else if (typeof dateStr === 'string') {
           if (/^\d{8}$/.test(dateStr)) {
               dateStr = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
           } else {
               const d = new Date(dateStr);
               if (!isNaN(d.getTime())) {
                  dateStr = d.toISOString().split('T')[0];
               }
           }
        }

        if (dateStr && open !== undefined) {
          categoryData.push(dateStr);
          values.push([
            Number(open),
            Number(close),
            Number(low),
            Number(high)
          ]);
        }
      });
    } else {
      throw new Error('Data format not recognized');
    }

    // If no data found, display "No Data"
    if (categoryData.length === 0) {
        myChart.clear();
        myChart.setOption({
            title: {
                text: '暂无数据',
                left: 'center',
                top: 'center',
                textStyle: { color: '#94a3b8', fontSize: 16 }
            }
        });
        return;
    }
    
  } catch (error) {
    console.warn(`API call failed for ${props.code}:`, error);
    
    // Display "No Data" on error
    myChart.clear();
    myChart.setOption({
        title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#94a3b8', fontSize: 16 }
        }
    });
    return;
  } finally {
    myChart.hideLoading();
  }

  const option = {
    backgroundColor: 'transparent',
    // title removed from chart option as it is now in card header
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: function (params) {
        const param = params[0];
        if (!param) return '';
        
        const date = param.name;
        
        // ECharts value usually includes the category index at position 0 for category axis
        // format: [index, open, close, low, high]
        let data = param.value;
        if (Array.isArray(data) && data.length === 5) {
             data = data.slice(1);
        }
        
        // data order: [open, close, low, high]
        const [open, close, low, high] = data;
        
        // Determine color based on rise (Red) or fall (Green)
        const color = Number(close) >= Number(open) ? '#ef4444' : '#10b981';
        
        return `
          <div style="margin-bottom: 4px; font-weight: bold">${date}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px">
            <span style="color: #ccc">开盘</span>
            <span style="font-weight: bold; color: ${color}">${Number(open).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px">
            <span style="color: #ccc">收盘</span>
            <span style="font-weight: bold; color: ${color}">${Number(close).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px">
            <span style="color: #ccc">最高</span>
            <span style="font-weight: bold; color: ${color}">${Number(high).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px">
            <span style="color: #ccc">最低</span>
            <span style="font-weight: bold; color: ${color}">${Number(low).toFixed(2)}</span>
          </div>
        `;
      }
    },
    grid: {
      left: '20px',
      right: '20px',
      bottom: '30px',
      top: '10px', // Reduced top padding to move chart up
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categoryData,
      scale: true,
      boundaryGap: true, // Ensure candles are not cut off
      axisLine: { onZero: false, lineStyle: { color: '#94a3b8' } },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
      axisLabel: { color: '#94a3b8' }
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      {
        show: true,
        type: 'slider',
        bottom: 5, // Position slider at the very bottom
        start: 0,
        end: 100,
        height: 20,
        borderColor: 'transparent',
        backgroundColor: 'rgba(47, 69, 84, 0.3)',
        fillerColor: 'rgba(167, 183, 204, 0.4)',
        handleStyle: {
          color: '#a7b7cc',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ],
    series: [
      {
        name: props.chartTitle || props.title || props.code,
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: '#ef4444', // Red for up (Close > Open)
          color0: '#10b981', // Green for down (Close < Open)
          borderColor: '#ef4444',
          borderColor0: '#10b981'
        }
      }
    ]
  };

  myChart.setOption(option);
};

const handleResize = () => {
  myChart && myChart.resize();
};

watch(() => props.code, () => {
    loadChartData();
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (myChart) myChart.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>{{ chartTitle || title }}</span>
      </div>
    </template>
    <div ref="chartRef" class="chart-container"></div>
  </el-card>
</template>

<style scoped>
.chart-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.chart-card :deep(.el-card__header) {
  border-bottom: 1px solid var(--border-color);
  padding: 15px 20px;
}
</style>
