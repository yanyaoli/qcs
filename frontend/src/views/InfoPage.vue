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
      <div v-if="activeKey === 'auth'" class="content-hint">
        <i class="ri-information-line"></i>
        <span>重置密码请在管理系统中操作</span>
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
              <tr v-for="(row, i) in permissionData" :key="row.position_id" :style="rowStyle(i)">
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
                <td>{{ row.employee_no }}</td><td>{{ row.name }}</td><td>{{ row.department_name }}</td><td>{{ row.position_name }}</td><td>{{ row.shift_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 认证信息 -->
      <div v-if="activeKey === 'auth'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>姓名</th><th style="width:120px">工号</th><th>账号</th><th style="width:100px" class="cell-center">账号状态</th><th style="width:120px" class="cell-center">人脸数据</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in authData" :key="row.employee_id" :style="rowStyle(i)">
                <td>{{ row.name }}</td><td>{{ row.employee_no }}</td><td>{{ row.username }}</td>
                <td class="cell-center"><span :class="row.statusClass">{{ row.statusLabel }}</span></td>
                <td class="cell-center"><span v-if="row.has_face" class="tag-green">已录入</span><span v-else class="tag-gray">未录入</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 机台档案 -->
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

      <!-- 不良原因分类库 -->
      <div v-if="activeKey === 'defectCauses'" class="content-body">
        <div v-for="group in defectCauseByDept" :key="group.department" class="cause-group">
          <div class="cause-dept-title">{{ group.department }}</div>
          <div class="cause-tags">
            <span v-for="cause in group.causes" :key="cause" class="cause-tag">{{ cause }}</span>
          </div>
        </div>
      </div>

      <!-- 单位库 -->
      <div v-if="activeKey === 'units'" class="content-body">
        <div v-for="group in unitByCategory" :key="group.category" class="cause-group">
          <div class="cause-dept-title">{{ group.category }}</div>
          <div class="cause-tags">
            <span v-for="item in group.items" :key="item" class="cause-tag">{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- 产品标准规格库 -->
      <div v-if="activeKey === 'productStandards'" class="content-body">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>品名规格描述</th><th>标准宽度</th><th>宽度公差限</th><th>标准厚度</th><th>厚度公差限</th><th>标准拉力基准值</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in productStandards" :key="row.id" :style="rowStyle(i)">
                <td>{{ row.description }}</td>
                <td>{{ row.standardWidth }}</td>
                <td>{{ row.widthTolerance }}</td>
                <td>{{ row.standardThickness }}</td>
                <td>{{ row.thicknessTolerance }}</td>
                <td>{{ row.standardTension }}</td>
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
  defectCauses, units, productStandards,
} from '../mock/data'

const expandedGroups = ref(new Set(['组织管理', '人员信息', '认证信息', '机台管理', '不良原因分类库', '单位库', '产品标准规格库']))
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
      { key: 'permissions', label: '权限说明', icon: 'ri-shield-keyhole-line' },
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
      { key: 'auth', label: '账号管理', icon: 'ri-shield-user-line' },
    ],
  },
  {
    label: '机台管理',
    children: [
      { key: 'machines', label: '机台档案', icon: 'ri-server-line' },
    ],
  },
  {
    label: '不良原因分类库',
    children: [
      { key: 'defectCauses', label: '不良原因', icon: 'ri-close-circle-line' },
    ],
  },
  {
    label: '单位库',
    children: [
      { key: 'units', label: '单位维护', icon: 'ri-ruler-line' },
    ],
  },
  {
    label: '产品标准规格库',
    children: [
      { key: 'productStandards', label: '标准规格', icon: 'ri-bookmark-line' },
    ],
  },
]

const titles: Record<string, string> = {
  departments: '部门管理',
  shifts: '班次管理',
  positions: '职位管理',
  permissions: '权限说明',
  employees: '人员信息',
  auth: '账号管理',
  machines: '机台档案',
  defectCauses: '不良原因分类库',
  units: '单位库',
  productStandards: '产品标准规格库',
}

const currentTitle = computed(() => titles[activeKey.value] || '')

const departmentData = departments
const shiftData = shifts
const positionData = positions
const employeeData = computed(() =>
  employees.map(e => ({
    ...e,
    department_name: departments.find(d => d.id === e.department_id)?.name || '',
    position_name: positions.find(p => p.id === e.position_id)?.name || '',
    shift_name: shifts.find(s => s.id === e.shift_id)?.name || '',
  }))
)

const permissionData = computed(() =>
  permissions.map(p => ({
    position_id: p.position_id,
    canEditBasicDict: p.canEditBasicDict,
    canEditRelatedData: p.canEditRelatedData,
    position: positions.find(pos => pos.id === p.position_id)?.name || '',
  }))
)

const authData = computed(() =>
  employeeAuth.map(a => {
    const emp = employees.find(e => e.id === a.employee_id)
    return {
      employee_id: a.employee_id,
      username: a.username,
      status: a.status,
      has_face: a.has_face,
      name: emp?.name || '',
      employee_no: emp?.employee_no || '',
      statusLabel: a.status === 'active' ? '启用' : '禁用',
      statusClass: a.status === 'active' ? 'tag-green' : 'tag-gray',
    }
  })
)

const machineData = computed(() =>
  machines.map(m => ({
    ...m,
    department: departments.find(d => d.id === m.department_id)?.name || '',
  }))
)

const defectCauseDepartments = computed(() =>
  [...new Set(defectCauses.map(d => d.department))]
)

const defectCauseByDept = computed(() =>
  defectCauseDepartments.value.map(dept => ({
    department: dept,
    causes: defectCauses.filter(d => d.department === dept).map(d => d.cause),
  }))
)

const unitCategories = computed(() =>
  [...new Set(units.map(u => u.category))]
)

const unitByCategory = computed(() =>
  unitCategories.value.map(cat => ({
    category: cat,
    items: units.filter(u => u.category === cat).map(u => u.unit),
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
  overflow-y: auto;
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
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.content-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 0.85rem;

  i {
    color: var(--color-info);
    font-size: 1rem;
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

.cause-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.cause-dept-title {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.cause-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cause-tag {
  display: inline-block;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text);
  border-radius: 16px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.15s;

  &:hover {
    background: rgba(229, 9, 20, 0.1);
    border-color: rgba(229, 9, 20, 0.3);
  }
}
</style>
