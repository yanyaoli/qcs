<template>
  <div class="login-container">
    <div class="login-content">
      <div class="selection-section">
        <div class="section-header">
          <h1>Polyunion QCS</h1>
          <p>Quality Control System</p>
        </div>
        <button class="name-btn" @click="openDrawer">
          <template v-if="selectedEmployee">
            <span class="flex-1 text-center">{{ selectedEmployee.name }}</span>
          </template>
          <template v-else><span class="flex-1 text-center">点击选择人员</span></template>
          <i class="ri-arrow-up-s-line"></i>
        </button>

        <button
          class="login-btn"
          @click="confirmLogin"
          :disabled="!selectedEmployee || loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="other-methods">
          <span class="text">其他登录方式</span>
          <div class="method-links">
            <button class="method-link" disabled>密码登录</button>
            <button class="method-link" disabled>人脸识别</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <i class="ri-close-circle-line"></i> {{ error }}
      </div>
    </div>

    <transition name="fade">
      <div v-if="showDrawer" class="drawer-overlay" @click="closeDrawer" />
    </transition>

    <transition name="slideUp">
      <div v-if="showDrawer" class="drawer">
        <div class="drawer-handle"><span class="handle-bar" /></div>

        <div class="drawer-header">
          <i class="ri-search-line"></i>
          <input v-model="searchQuery" placeholder="搜索姓名..." />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''"><i class="ri-close-line"></i></button>
        </div>

        <div class="drawer-body" ref="listRef" @scroll="onScroll">
          <div v-if="filteredGroups.length === 0" class="empty">
            未找到匹配的人员
          </div>
          <div
            v-for="group in filteredGroups"
            :key="group.letter"
            :ref="(el) => setGroupRef(group.letter, el as HTMLElement)"
            class="group"
          >
            <div class="group-letter">{{ group.letter }}</div>
            <div
              v-for="emp in group.employees"
              :key="emp.id"
              class="emp-item"
              :class="{ selected: selectedEmployee?.id === emp.id }"
              @click="selectEmployee(emp)"
            >
              <div class="emp-avatar">{{ emp.name.charAt(0) }}</div>
              <div class="emp-info">
                <div class="emp-name">{{ emp.name }}</div>
                <div class="emp-tags">
                  <span class="tag">{{ emp.position }}</span>
                  <span class="tag">{{ emp.shift }}</span>
                </div>
              </div>
              <div v-if="selectedEmployee?.id === emp.id" class="check"><i class="ri-check-line"></i></div>
            </div>
          </div>
        </div>

        <div class="index-bar">
          <span
            v-for="letter in indexLetters"
            :key="letter"
            class="index-letter"
            :class="{ active: activeLetter === letter }"
            @click="scrollToLetter(letter)"
          >{{ letter }}</span>
        </div>

        <div class="drawer-footer">
          <button
            class="drawer-login-btn"
            @click="confirmLogin"
            :disabled="!selectedEmployee || loading"
          >
            <template v-if="loading">登录中...</template>
            <template v-else-if="selectedEmployee">登录 ({{ selectedEmployee.name }})</template>
            <template v-else>请选择人员</template>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { authApi } from '../api/auth'

interface Employee {
  id: number
  name: string
  shift: string
  position: string
  employee_no: string
  dept_id: number
}

interface Department {
  id: number
  name: string
}

const router = useRouter()
const userStore = useUserStore()

const employees = ref<Employee[]>([])
const departments = ref<Department[]>([])
const selectedEmployee = ref<Employee | null>(null)
const showDrawer = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const activeLetter = ref('')
const listRef = ref<HTMLDivElement>()
const groupRefs = new Map<string, HTMLElement>()

const grouped = computed(() => {
  const groups = new Map<string, Employee[]>()
  for (const emp of employees.value) {
    const letter = emp.name.charAt(0).toUpperCase()
    if (!groups.has(letter)) groups.set(letter, [])
    groups.get(letter)!.push(emp)
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, emps]) => ({ letter, employees: emps }))
})

const filteredGroups = computed(() => {
  if (!searchQuery.value) return grouped.value
  const q = searchQuery.value.toLowerCase()
  return grouped.value
    .map(g => ({
      letter: g.letter,
      employees: g.employees.filter(e => e.name.toLowerCase().includes(q))
    }))
    .filter(g => g.employees.length > 0)
})

const indexLetters = computed(() => filteredGroups.value.map(g => g.letter))

const setGroupRef = (letter: string, el: HTMLElement | null) => {
  if (el) groupRefs.set(letter, el)
}

const scrollToLetter = (letter: string) => {
  const el = groupRefs.get(letter)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeLetter.value = letter
  }
}

const onScroll = () => {
  if (!listRef.value) return
  const top = listRef.value.scrollTop
  let current = ''
  for (const g of filteredGroups.value) {
    const el = groupRefs.get(g.letter)
    if (el && el.offsetTop - listRef.value.offsetTop <= top + 60) {
      current = g.letter
    }
  }
  activeLetter.value = current
}

const openDrawer = () => {
  showDrawer.value = true
  document.body.style.overflow = 'hidden'
}

const closeDrawer = () => {
  showDrawer.value = false
  document.body.style.overflow = ''
}

const selectEmployee = (emp: Employee) => {
  selectedEmployee.value = emp
}

const confirmLogin = async () => {
  if (!selectedEmployee.value) return

  try {
    error.value = ''
    loading.value = true

    const response = await authApi.login({ employee_id: selectedEmployee.value.id })
    if (response.token) {
      localStorage.setItem('last_employee_id', String(selectedEmployee.value.id))
      const dept = departments.value.find(d => d.id === selectedEmployee.value!.dept_id)

      userStore.setToken(response.token)
      userStore.setUser({
        id: response.employee_id,
        name: response.name,
        position: response.position,
        department: dept?.name || ''
      })
      showDrawer.value = false
      document.body.style.overflow = ''
      await router.push('/dashboard')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const deptResponse = await authApi.getDepartments()
    departments.value = deptResponse

    const empPromises = deptResponse.map(d => authApi.getEmployees(d.id).catch(() => []))
    const empResults = await Promise.all(empPromises)
    employees.value = empResults.flat()

    const savedEmpId = localStorage.getItem('last_employee_id')
    if (savedEmpId) {
      const emp = employees.value.find(e => e.id === Number(savedEmpId))
      if (emp) selectedEmployee.value = emp
    }
  } catch (err) {
    error.value = '获取数据失败'
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f1115 0%, #1a1d24 100%);
  overflow: hidden;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    margin: 0;
    color: #e50914;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0.25rem 0 0 0;
    color: #9ca3af;
    font-size: 0.85rem;
  }
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.selection-section {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.name-btn {
  width: 80%;
  max-width: 280px;
  padding: 1rem 1.5rem;
  background: rgba(26, 29, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(26, 29, 36, 0.7);
    border-color: #e50914;
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.2);
  }

  i {
    font-size: 1.3rem;
    color: #9ca3af;
    flex-shrink: 0;
  }
}

.login-btn {
  width: 100%;
  max-width: 320px;
  padding: 0.9rem 1.5rem;
  background: #e50914;
  border: none;
  border-radius: 9999px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 50px;

  &:hover:not(:disabled) {
    background: #ff3b47;
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.other-methods {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  .text {
    color: #9ca3af;
    font-size: 0.85rem;
  }

  .method-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .method-link {
    padding: 0.5rem 1.2rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.4rem;
    color: #9ca3af;
    font-size: 0.85rem;
    cursor: not-allowed;
    transition: all 0.2s;
    min-height: 36px;

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: 0.5rem;
  color: #fca5a5;
  text-align: center;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease-out;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.drawer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  max-width: 600px;
  height: 80vh;
  background: rgba(20, 22, 28, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1rem 1rem 0 0;
  z-index: 201;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-handle {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 0;

  .handle-bar {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
  }
}

.drawer-header {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  i {
    color: #9ca3af;
    font-size: 1rem;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    padding: 0.5rem 0;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 0.95rem;
    outline: none;

    &::placeholder {
      color: #6b7280;
    }
  }

  .clear-btn {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 2px;
    display: flex;
    font-size: 1rem;

    &:hover {
      color: #ffffff;
    }
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem 0.5rem;
  position: relative;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(229, 9, 20, 0.3); border-radius: 3px; }
}

.group { padding-top: 0.75rem; }

.group-letter {
  padding: 0.6rem 0 0.4rem;
  color: #e50914;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.emp-item {
  padding: 1rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 64px;

  &:hover { background: rgba(229, 9, 20, 0.08); }
  &.selected { background: rgba(229, 9, 20, 0.15); }
}

.emp-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.2);
  color: #ff9fa0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.emp-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.emp-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 1.1rem;
}

.emp-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background: rgba(229, 9, 20, 0.15);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 0.3rem;
  color: #ff9fa0;
  font-size: 0.85rem;
  font-weight: 500;
}

.check {
  color: #e50914;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.empty {
  padding: 4rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
}

.index-bar {
  position: absolute;
  right: 6px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0 2px;
  pointer-events: none;
  z-index: 2;
}

.index-letter {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
  transition: all 0.15s;
  pointer-events: auto;
  line-height: 1.4;

  &:hover { color: #e50914; background: rgba(229, 9, 20, 0.15); }
  &.active { color: #e50914; font-weight: 700; font-size: 0.85rem; }
}

.drawer-footer {
  padding: 0.75rem 1.5rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-login-btn {
  width: 100%;
  padding: 0.8rem;
  background: #e50914;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 46px;

  &:hover:not(:disabled) {
    background: #ff3b47;
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slideUp-enter-active,
.slideUp-leave-active { transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
.slideUp-enter-from,
.slideUp-leave-to { transform: translate(-50%, 100%); }
.slideUp-enter-to,
.slideUp-leave-from { transform: translate(-50%, 0); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .section-header {
    h1 { font-size: 1.6rem; }
    p { font-size: 0.8rem; }
  }
  .login-content { padding: 1rem; }
  .drawer { height: 85vh; }
}
</style>
