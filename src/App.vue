<script setup>
import { 
  Menu as IconMenu, 
  DataLine, 
  Wallet, 
  Setting, 
  Bell 
} from '@element-plus/icons-vue';
</script>

<template>
  <el-container class="layout-container">
    <!-- Sidebar -->
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <el-icon class="logo-icon"><DataLine /></el-icon>
        <span>StockPro</span>
      </div>
      <el-menu
        :default-active="$route.path === '/market' ? '2' : '1'"
        class="el-menu-vertical"
        background-color="transparent"
        text-color="#94a3b8"
        active-text-color="#3b82f6"
        router
      >
        <el-menu-item index="1" route="/">
          <el-icon><IconMenu /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="2" route="/market">
          <el-icon><DataLine /></el-icon>
          <span>Market</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Wallet /></el-icon>
          <span>Portfolio</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Bell /></el-icon>
          <span>News</span>
        </el-menu-item>
        <el-menu-item index="5" class="mt-auto">
          <el-icon><Setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- Header -->
      <el-header class="header">
        <div class="header-content">
          <div class="search-bar">
            <el-input
              placeholder="Search stocks, ETFs..."
              prefix-icon="Search"
              class="custom-input"
            />
          </div>
          <div class="user-actions">
            <el-button circle icon="Bell" class="icon-btn" />
            <div class="avatar">JD</div>
          </div>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: var(--bg-color);
}

/* Sidebar Styling */
.sidebar {
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
}

.logo-icon {
  margin-right: 10px;
  color: var(--accent-color);
}

.el-menu {
  border-right: none;
  padding-top: 20px;
}

.mt-auto {
  margin-top: auto;
  margin-bottom: 20px;
}

/* Header Styling */
.header {
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  height: 60px;
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-input {
  width: 300px;
}

.custom-input :deep(.el-input__wrapper) {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  box-shadow: none;
  border-radius: 20px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Main Content */
.main-content {
  padding: 24px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>