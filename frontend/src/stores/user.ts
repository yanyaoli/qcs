import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  position: string
  department: string
}

export const useUserStore = defineStore('user', () => {
  const storedName = localStorage.getItem('user_name')
  const storedDept = localStorage.getItem('user_department')
  const user = ref<User | null>(
    storedName && storedDept ? { id: 0, name: storedName, position: '', department: storedDept } : null
  )
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isAuthenticated = computed(() => !!token.value)

  function setUser(userData: User) {
    user.value = userData
    localStorage.setItem('user_name', userData.name)
    localStorage.setItem('user_department', userData.department)
  }

  function setToken(authToken: string) {
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  function logout() {
    clearAuth()
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    clearAuth,
    logout
  }
})
