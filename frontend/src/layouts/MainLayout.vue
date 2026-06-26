<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ collapsed: !uiStore.sidebarVisible }">
      <div class="sidebar-body">
        <div class="sidebar-header">
          <h1 class="logo">QCS</h1>
          <button class="toggle-btn" @click="uiStore.toggleSidebar"><i class="ri-menu-fold-line"></i></button>
        </div>
        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="nav-item">
            <span class="icon"><i class="ri-dashboard-line"></i></span>
            <span class="label">数据看板</span>
          </router-link>
          <router-link to="/info" class="nav-item">
            <span class="icon"><i class="ri-information-line"></i></span>
            <span class="label">信息维护</span>
          </router-link>
          <router-link to="/production" class="nav-item">
            <span class="icon"><i class="ri-settings-3-line"></i></span>
            <span class="label">生产管理</span>
          </router-link>
          <router-link to="/first-article" class="nav-item">
            <span class="icon"><i class="ri-file-list-line"></i></span>
            <span class="label">首件确认</span>
          </router-link>
          <router-link to="/inspection" class="nav-item">
            <span class="icon"><i class="ri-edit-line"></i></span>
            <span class="label">巡检签字</span>
          </router-link>
          <router-link to="/reports" class="nav-item">
            <span class="icon"><i class="ri-bar-chart-box-line"></i></span>
            <span class="label">报表台账</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <button class="logout-btn" @click="showLogoutConfirm = true">
            <span class="icon"><i class="ri-logout-box-r-line"></i></span>
            <span class="label">退出登录</span>
          </button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <div class="header-content">
          <h2>{{ userInfo }}</h2>
          <span class="current-time">{{ currentTime }}</span>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>

    <ConfirmModal
      v-model:visible="showLogoutConfirm"
      title="退出确认"
      message="确认退出登录吗？"
      confirmText="退出"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore, useUserStore } from '../stores'
import ConfirmModal from '../components/ConfirmModal.vue'

const uiStore = useUiStore()
const userStore = useUserStore()
const router = useRouter()

const showLogoutConfirm = ref(false)
const currentTime = ref('')

let timer: ReturnType<typeof setInterval> | null = null

const userInfo = computed(() => {
  const user = userStore.user
  if (!user) return 'Welcome'
  return `${user.department} ${user.name}`
})

const updateTime = () => {
  const now = new Date()
  const y = now.getFullYear()
  const mo = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${y}-${mo}-${d} ${h}:${m}:${s}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.sidebar {
  width: 250px;
  background: var(--color-panel);
  border-right: 1px solid var(--color-border);
  transition: width var(--transition-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;

  &.collapsed {
    width: 50px;

    .sidebar-header {
      justify-content: center;
    }

    .logo {
      opacity: 0;
      width: 0;
      padding: 0;
      margin: 0;
    }

    .label {
      opacity: 0;
      width: 0;
    }

    .sidebar-nav {
      padding: var(--spacing-md) 0;
      align-items: center;
    }

    .nav-item {
      justify-content: center;
      gap: 0;
      padding: var(--spacing-md) 0;
    }

    .sidebar-footer {
      padding: var(--spacing-sm) 0;
      align-items: center;
    }

    .logout-btn {
      justify-content: center;
      gap: 0;
      padding: var(--spacing-md) 0;
    }

    .icon {
      margin: 0;
    }
  }
}

.sidebar-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: var(--spacing-lg) var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-sm);
  min-height: 64px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s, width 0.2s;
}

.toggle-btn {
  background: transparent;
  color: var(--color-text);
  font-size: 1.5rem;
  padding: var(--spacing-sm);
  cursor: pointer;
  transition: color var(--transition-base);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 40px;
  min-height: 40px;

  &:hover {
    color: var(--color-primary);
  }
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-md);
  color: var(--color-text);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  min-height: 48px;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }

  &.router-link-active {
    color: var(--color-primary);
  }
}

.icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
}

.label {
  font-weight: 500;
  font-size: 1rem;
}

.sidebar-footer {
  padding: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-md);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  min-height: 48px;
  cursor: pointer;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 1rem;

  &:hover {
    color: var(--color-primary);
    background: rgba(229, 9, 20, 0.08);
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--color-panel);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: 500;
  }
}

.current-time {
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
