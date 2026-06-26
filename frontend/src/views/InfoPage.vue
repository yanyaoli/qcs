<template>
  <div class="info-page">
    <div class="info-sidebar">
      <div
        v-for="group in navGroups"
        :key="group.label"
        class="nav-group"
      >
        <div class="nav-group-title" @click="toggleGroup(group.label)">
          <span>{{ group.label }}</span>
          <i class="ri-arrow-down-s-line" :class="{ open: expandedGroups.has(group.label) }"></i>
        </div>
        <div v-if="expandedGroups.has(group.label)" class="nav-items">
          <div
            v-for="item in group.children"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeKey === item.key }"
            @click="activeKey = item.key"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-content">
      <div class="content-header">
        <h2>{{ currentTitle }}</h2>
      </div>

      <!-- 部门管理 -->
      <div v-if="activeKey === 'departments'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th style="width:80px">ID</th><th>部门名称</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in departmentData" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.id }}</td><td>{{ row.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 班次管理 -->
      <div v-if="activeKey === 'shifts'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th style="width:80px">ID</th><th>班次名称</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in shiftData" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.id }}</td><td>{{ row.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 职位管理 -->
      <div v-if="activeKey === 'positions'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th style="width:80px">ID</th><th>职位名称</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in positionData" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.id }}</td><td>{{ row.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 权限管理 -->
      <div v-if="activeKey === 'permissions'" class="content-body">
        <div class="info-card">
          <div class="info-icon"><i class="ri-information-line"></i></div>
          <div class="info-text">
            系统管理员、现场组长、部门主管可以修改基础字典。
            系统管理员、部门主管可以修改基础字典及相关数据。
          </div>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>职位</th><th style="width:160px">修改基础字典</th><th style="width:160px">修改相关数据</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in permissionData" :key="row.position" :style="rowStyle(i)">
                <td>{{ row.position }}</td>
                <td class="cell-center"><i v-if="row.canEditBasicDict" class="ri-check-line check-yes"></i><i v-else class="ri-close-line check-no"></i></td>
                <td class="cell-center"><i v-if="row.canEditRelatedData" class="ri-check-line check-yes"></i><i v-else class="ri-close-line check-no"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 人员信息 -->
      <div v-if="activeKey === 'employees'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th style="width:120px">工号</th><th>姓名</th><th>部门</th><th style="width:130px">职位</th><th style="width:100px">班次</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in employeeData" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.employee_no }}</td><td>{{ row.name }}</td><td>{{ row.department }}</td><td>{{ row.position }}</td><td>{{ row.shift }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 认证信息 -->
      <div v-if="activeKey === 'auth'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>姓名</th><th style="width:120px">工号</th><th>账号</th><th style="width:120px" class="cell-center">密码</th><th style="width:120px" class="cell-center">人脸数据</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in authData" :key="row.employee_id" :style="rowStyle(i)">
                <td>{{ row.name }}</td><td>{{ row.employee_no }}</td><td>{{ row.username }}</td>
                <td class="cell-center"><span class="password-placeholder">••••••</span></td>
                <td class="cell-center"><span v-if="row.has_face" class="tag-green">已录入</span><span v-else class="tag-gray">未录入</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 机台管理 -->
      <div v-if="activeKey === 'machines'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th style="width:150px">机台编号</th><th>所属部门</th><th>物理位置</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in machineData" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.code }}</td><td>{{ row.department }}</td><td>{{ row.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  departments, shifts, positions, permissions,
  employees, machines, employeeAuth,
} from '../mock/data'

const expandedGroups = ref(new Set(['组织管理']))
const activeKey = ref('departments')

const toggleGroup = (label: string) => {
  if (expandedGroups.value.has(label)) expandedGroups.value.delete(label)
  else expandedGroups.value.add(label)
}

const navGroups = [
  {
    label: '组织管理',
    children: [
      { key: 'departments', label: '部门管理', icon: 'ri-building-line' },
      { key: 'shifts', label: '班次管理', icon: 'ri-time-line' },
      { key: 'positions', label: '职位管理', icon: 'ri-user-star-line' },
      { key: 'permissions', label: '权限管理', icon: 'ri-shield-keyhole-line' },
    ],
  },
  {
    label: '人员信息',
    children: [
      { key: 'employees', label: '人员信息', icon: 'ri-team-line' },
    ],
  },
  {
    label: '认证信息',
    children: [
      { key: 'auth', label: '认证信息', icon: 'ri-shield-user-line' },
    ],
  },
  {
    label: '机台管理',
    children: [
      { key: 'machines', label: '机台管理', icon: 'ri-server-line' },
    ],
  },
]

const titles: Record<string, string> = {
  departments: '部门管理',
  shifts: '班次管理',
  positions: '职位管理',
  permissions: '权限管理',
  employees: '人员信息',
  auth: '认证信息',
  machines: '机台管理',
}

const currentTitle = computed(() => titles[activeKey.value] || '')

const departmentData = departments
const shiftData = shifts
const positionData = positions
const permissionData = permissions

const employeeData = computed(() =>
  employees.map(e => ({
    ...e,
    department: departments.find(d => d.id === e.department_id)?.name || '',
  }))
)

const authData = computed(() =>
  employeeAuth.map(a => {
    const emp = employees.find(e => e.id === a.employee_id)
    return {
      ...a,
      name: emp?.name || '',
      employee_no: emp?.employee_no || '',
    }
  })
)

const machineData = computed(() =>
  machines.map(m => ({
    ...m,
    department: departments.find(d => d.id === m.department_id)?.name || '',
  }))
)

const rowStyle = (i: number) => i % 2 === 1 ? { backgroundColor: 'rgba(255, 255, 255, 0.04)' } as const : {}
</script>

<style scoped lang="scss">
.info-page {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  min-height: 0;
}

.info-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-group-title {
  padding: 0.6rem 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: var(--color-text);
  }

  i {
    font-size: 1rem;
    transition: transform 0.2s;

    &.open {
      transform: rotate(180deg);
    }
  }
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  padding: 0.65rem 0.75rem 0.65rem 1.5rem;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
    width: 18px;
    color: var(--color-text-secondary);
  }

  &:hover {
    background: rgba(229, 9, 20, 0.1);
  }

  &.active {
    background: rgba(229, 9, 20, 0.2);
    color: #ff9fa0;

    i {
      color: #ff9fa0;
    }
  }
}

.info-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content-header {
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.content-body {
  flex: 1;
  overflow-y: auto;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;

  .info-icon i {
    font-size: 1.3rem;
    color: #3b82f6;
  }

  .info-text {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

// Custom table
.tbl-wrap {
  overflow-y: auto;
  max-height: 600px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
}

.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    background: rgba(255, 255, 255, 0.06);
    color: #9ca3af;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    padding: 10px 12px;
    color: #e5e7eb;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  tr:hover td {
    background: rgba(229, 9, 20, 0.08);
  }
}

.cell-center {
  text-align: center;
}

.check-yes {
  color: #10b981;
  font-size: 1.2rem;
  font-weight: 700;
}

.check-no {
  color: #6b7280;
  font-size: 1.2rem;
}

.tag-green {
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag-gray {
  color: #6b7280;
  font-size: 0.85rem;
}

.password-placeholder {
  color: #6b7280;
  letter-spacing: 2px;
}
</style>
