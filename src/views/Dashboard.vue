<script setup>
import { reactive } from 'vue';
import { 
  ArrowUp, 
  ArrowDown 
} from '@element-plus/icons-vue';

// Mock Data for Cards
const stats = reactive([
  { title: 'Total Balance', value: '$124,592.00', change: '+12.5%', isPositive: true },
  { title: 'Today\'s Profit', value: '$1,294.50', change: '+5.2%', isPositive: true },
  { title: 'Total Loss', value: '$450.20', change: '-1.2%', isPositive: false },
  { title: 'Portfolio Growth', value: '24.5%', change: '+2.1%', isPositive: true },
]);

// Mock Data for Table
const stockData = [
  { symbol: '1810.HK', name: 'Xiaomi Corp', price: '14.80', change: '+1.25%', volume: '54M' },
  { symbol: '0700.HK', name: 'Tencent', price: '320.60', change: '-0.85%', volume: '32M' },
  { symbol: '9988.HK', name: 'Alibaba', price: '75.15', change: '+3.45%', volume: '45M' },
  { symbol: '3690.HK', name: 'Meituan', price: '110.70', change: '+0.55%', volume: '22M' },
  { symbol: '1211.HK', name: 'BYD', price: '235.20', change: '-0.35%', volume: '28M' },
];
</script>

<template>
  <div class="dashboard-content">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <el-card v-for="(stat, index) in stats" :key="index" class="stat-card" shadow="hover">
        <div class="stat-header">
          <span class="stat-title">{{ stat.title }}</span>
          <span :class="['stat-change', stat.isPositive ? 'positive' : 'negative']">
            {{ stat.change }}
            <el-icon><component :is="stat.isPositive ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
          </span>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
      </el-card>
    </div>

    <!-- Charts & Tables Grid -->
    <div class="dashboard-grid">
      <!-- Watchlist Table -->
      <el-card class="table-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Market Watchlist</span>
            <el-button type="primary" link>View All</el-button>
          </div>
        </template>
        <el-table :data="stockData" style="width: 100%" :row-style="{ background: 'transparent' }">
          <el-table-column prop="symbol" label="Symbol" width="80" />
          <el-table-column prop="price" label="Price" align="right" />
          <el-table-column prop="change" label="Change" align="right">
            <template #default="scope">
              <span :class="scope.row.change.startsWith('+') ? 'text-success' : 'text-danger'">
                {{ scope.row.change }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stat-title {
  color: var(--text-secondary);
  font-size: 14px;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.positive { color: var(--success-color); }
.negative { color: var(--danger-color); }

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr; /* Adjusted since charts are gone */
  gap: 20px;
}

.table-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-card :deep(.el-card__header) {
  border-bottom: 1px solid var(--border-color);
  padding: 15px 20px;
}

/* Table Styling Overrides */
.el-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-text-color: var(--text-primary);
  --el-table-header-text-color: var(--text-secondary);
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-table-border-color: var(--border-color);
}

.text-success { color: var(--success-color); }
.text-danger { color: var(--danger-color); }
</style>
