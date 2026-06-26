import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarVisible = ref(true)
  const darkMode = ref(true)
  const loading = ref(false)

  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }

  function setSidebarVisible(visible: boolean) {
    sidebarVisible.value = visible
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  return {
    sidebarVisible,
    darkMode,
    loading,
    toggleSidebar,
    setSidebarVisible,
    toggleDarkMode,
    setLoading
  }
})
