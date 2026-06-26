import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores'
import LoginLayout from '../layouts/LoginLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import InfoPage from '../views/InfoPage.vue'
import PlaceholderPage from '../views/PlaceholderPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '',
        component: LoginPage,
        name: 'Login'
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
        name: 'Dashboard',
        meta: { title: '数据看板' }
      },
      {
        path: 'info',
        component: InfoPage,
        name: 'Info',
        meta: { title: '信息维护' }
      },
      {
        path: 'production',
        component: PlaceholderPage,
        name: 'Production',
        meta: { title: '生产管理' }
      },
      {
        path: 'first-article',
        component: PlaceholderPage,
        name: 'FirstArticle',
        meta: { title: '首件确认' }
      },
      {
        path: 'inspection',
        component: PlaceholderPage,
        name: 'Inspection',
        meta: { title: '巡检签字' }
      },
      {
        path: 'reports',
        component: PlaceholderPage,
        name: 'Reports',
        meta: { title: '报表台账' }
      },
      {
        path: '',
        redirect: 'dashboard'
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && userStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
