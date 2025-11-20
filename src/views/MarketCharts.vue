<script setup>
import BaseChart from '../components/BaseChart.vue';
</script>

<template>
  <div class="charts-page">
    <div class="charts-grid">
      <!-- CSI All Share Index -->
      <BaseChart 
        title="市场概览 (指数)"
        code="000985.SH"
        chart-title="中证全指 (000985.SH) - 周线"
        class="chart-item"
      />

      <!-- New Energy Vehicle Index -->
      <BaseChart 
        title="市场概览 (指数)"
        code="399976.SZ"
        chart-title="中证新能源车 (399976.SZ) - 周线"
        class="chart-item"
      />

      <!-- Shuanghuan Driveline -->
      <BaseChart 
        title="市场概览 (个股)"
        code="002472.SZ"
        chart-title="双环传动 (002472.SZ) - 周线"
        class="chart-item"
      />
    </div>
  </div>
</template>

<style scoped>
.charts-page {
  padding: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  gap: 20px;
}

.chart-item {
  min-width: 0; /* Prevents grid item overflow */
}
</style>
