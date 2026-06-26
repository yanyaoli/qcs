<template>
  <div class="dashboard-page">
    <h1>数据看板</h1>
    <div class="welcome-text">{{ userStore.user?.name || 'User' }}，欢迎回来</div>

    <div class="stats-grid">
      <div class="stat-card glass">
        <h3>Total Users</h3>
        <p class="stat-value">1,234</p>
      </div>
      <div class="stat-card glass">
        <h3>Active Sessions</h3>
        <p class="stat-value">456</p>
      </div>
      <div class="stat-card glass">
        <h3>System Health</h3>
        <p class="stat-value text-primary">100%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.dashboard-page {
  width: 100%;
}

h1 {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-text {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  padding: 2rem;
  background: rgba(26, 29, 36, 0.8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    margin: 0;
    color: var(--color-text);
    font-size: 2rem;
    font-weight: bold;

    &.text-primary {
      color: var(--color-primary);
    }
  }
}
</style>
