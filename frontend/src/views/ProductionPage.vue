<template>
  <div class="production-page">
    <div class="page-header">
      <h2>生产录入</h2>
      <div class="header-actions">
        <span class="record-count">共 {{ filteredOrders.length }} 条记录</span>
      </div>
    </div>

    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:140px">工作单号</th>
            <th style="width:100px">生产机台</th>
            <th
              class="filter-th"
              style="width:110px"
              :class="{ 'has-filter': hasActiveFilter('customerCode') }"
            >
              <div class="th-label" @click="toggleDropdown('customerCode')">
                客户代号
                <i class="ri-arrow-down-s-line"></i>
              </div>
              <div v-if="openDropdown === 'customerCode'" class="filter-dropdown" @click.stop>
                <label class="filter-all">
                  <input
                    type="checkbox"
                    :checked="isAllSelected('customerCode')"
                    @change="toggleAll('customerCode')"
                  />
                  全选
                </label>
                <label v-for="opt in filterOptions.customerCode" :key="opt" class="filter-item">
                  <input type="checkbox" :value="opt" v-model="filters.customerCode" />
                  {{ opt }}
                </label>
              </div>
            </th>
            <th
              class="sort-th"
              style="width:100px;cursor:pointer"
              @click="toggleSort"
            >
              <div class="th-label">
                排单日期
                <i class="sort-arrow" :class="sortArrowClass"></i>
              </div>
            </th>
            <th
              class="filter-th"
              :class="{ 'has-filter': hasActiveFilter('productName') }"
            >
              <div class="th-label" @click="toggleDropdown('productName')">
                品名
                <i class="ri-arrow-down-s-line"></i>
              </div>
              <div v-if="openDropdown === 'productName'" class="filter-dropdown" @click.stop>
                <label class="filter-all">
                  <input
                    type="checkbox"
                    :checked="isAllSelected('productName')"
                    @change="toggleAll('productName')"
                  />
                  全选
                </label>
                <label v-for="opt in filterOptions.productName" :key="opt" class="filter-item">
                  <input type="checkbox" :value="opt" v-model="filters.productName" />
                  {{ opt }}
                </label>
              </div>
            </th>
            <th
              class="filter-th"
              :class="{ 'has-filter': hasActiveFilter('specification') }"
            >
              <div class="th-label" @click="toggleDropdown('specification')">
                规格
                <i class="ri-arrow-down-s-line"></i>
              </div>
              <div v-if="openDropdown === 'specification'" class="filter-dropdown" @click.stop>
                <label class="filter-all">
                  <input
                    type="checkbox"
                    :checked="isAllSelected('specification')"
                    @change="toggleAll('specification')"
                  />
                  全选
                </label>
                <label v-for="opt in filterOptions.specification" :key="opt" class="filter-item">
                  <input type="checkbox" :value="opt" v-model="filters.specification" />
                  {{ opt }}
                </label>
              </div>
            </th>
            <th
              class="filter-th"
              style="width:80px"
              :class="{ 'has-filter': hasActiveFilter('colorName') }"
            >
              <div class="th-label" @click="toggleDropdown('colorName')">
                颜色
                <i class="ri-arrow-down-s-line"></i>
              </div>
              <div v-if="openDropdown === 'colorName'" class="filter-dropdown" @click.stop>
                <label class="filter-all">
                  <input
                    type="checkbox"
                    :checked="isAllSelected('colorName')"
                    @change="toggleAll('colorName')"
                  />
                  全选
                </label>
                <label v-for="opt in filterOptions.colorName" :key="opt" class="filter-item">
                  <input type="checkbox" :value="opt" v-model="filters.colorName" />
                  {{ opt }}
                </label>
              </div>
            </th>
            <th
              class="filter-th"
              style="width:120px"
              :class="{ 'has-filter': hasActiveFilter('ironTapeStatusId') }"
            >
              <div class="th-label" @click="toggleDropdown('ironTapeStatusId')">
                烫带状态
                <i class="ri-arrow-down-s-line"></i>
              </div>
              <div v-if="openDropdown === 'ironTapeStatusId'" class="filter-dropdown" @click.stop>
                <label class="filter-all">
                  <input
                    type="checkbox"
                    :checked="isAllSelected('ironTapeStatusId')"
                    @change="toggleAll('ironTapeStatusId')"
                  />
                  全选
                </label>
                <label v-for="s in ironTapeStatuses" :key="s.id" class="filter-item">
                  <input type="checkbox" :value="s.id" v-model="filters.ironTapeStatusId" />
                  {{ s.name }}
                </label>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, i) in filteredOrders" :key="row.id">
            <tr :style="rowStyle(i)" class="clickable-row" @click="toggleExpand(row.id)">
              <td>{{ row.workOrderNo }}</td>
              <td>{{ row.machineCode }}</td>
              <td>{{ row.customerCode }}</td>
              <td>{{ row.scheduleDate }}</td>
              <td>{{ row.productName }}</td>
              <td>{{ row.specification }}</td>
              <td>
                <span class="color-dot" :style="{ backgroundColor: row.colorHex }"></span>
              {{ row.colorName }}
              </td>
              <td>
                <span class="status-tag" :class="tapeStatusMap[row.ironTapeStatusId]?.cssClass || ''">
                  {{ row.ironTapeStatusName }}
                </span>
              </td>
            </tr>
            <tr v-if="expandedIds.has(row.id)" class="expand-row">
              <td colspan="8">
                <div class="expand-body">
                  <div class="expand-grid">
                    <div class="expand-item">
                      <span class="label">创建时间</span>
                      <span class="value">{{ row.createdAt }}</span>
                    </div>
                    <div class="expand-item">
                      <span class="label">更新时间</span>
                      <span class="value">{{ row.updatedAt }}</span>
                    </div>
                    <div class="expand-item">
                      <span class="label">拉力测试</span>
                      <span class="value">{{ row.tensionTest || '未测试' }}</span>
                    </div>
                    <div class="expand-item">
                      <span class="label">确认状态</span>
                      <span class="value">
                        <span class="status-tag-sm" :class="getConfirmationClass(row)">{{ getConfirmationStatus(row) }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { productionApi } from '../api/production'
import { ironTapeStatuses, firstArticleStatuses } from '../mock/data'
import type { WorkOrder } from '../mock/data'

const workOrders = ref<WorkOrder[]>([])

const sortDirection = ref<'asc' | 'desc' | null>(null)

const filters = reactive<Record<string, string[]>>({
  customerCode: [],
  productName: [],
  specification: [],
  colorName: [],
  ironTapeStatusId: [],
})

const openDropdown = ref<string | null>(null)

const filterOptions = computed(() => {
  const options: Record<string, string[]> = {}
  for (const key of Object.keys(filters)) {
    const values = [...new Set(workOrders.value.map(w => (w as any)[key] as string))].filter(Boolean)
    options[key] = values
  }
  return options
})

const hasActiveFilter = (key: string) => filters[key].length > 0

const isAllSelected = (key: string) =>
  filters[key].length === filterOptions.value[key].length

const toggleAll = (key: string) => {
  if (isAllSelected(key)) {
    filters[key] = []
  } else {
    filters[key] = [...filterOptions.value[key]]
  }
}

const toggleDropdown = (key: string) => {
  openDropdown.value = openDropdown.value === key ? null : key
}

const handleOutsideClick = (e: MouseEvent) => {
  if (!openDropdown.value) return
  const target = e.target as HTMLElement
  if (target.closest('.th-label') || target.closest('.filter-dropdown')) return
  openDropdown.value = null
}

const toggleSort = () => {
  if (sortDirection.value === null) sortDirection.value = 'asc'
  else if (sortDirection.value === 'asc') sortDirection.value = 'desc'
  else sortDirection.value = null
}

const sortArrowClass = computed(() => {
  if (sortDirection.value === 'asc') return 'arrow-up'
  if (sortDirection.value === 'desc') return 'arrow-down'
  return ''
})

const filteredOrders = computed(() => {
  let list = [...workOrders.value]

  for (const [key, selected] of Object.entries(filters)) {
    if (selected.length > 0) {
      list = list.filter(item => selected.includes((item as any)[key]))
    }
  }

  if (sortDirection.value) {
    list.sort((a, b) => {
      const cmp = a.scheduleDate.localeCompare(b.scheduleDate)
      return sortDirection.value === 'asc' ? cmp : -cmp
    })
  }

  return list
})

const expandedIds = ref(new Set<number>())

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) expandedIds.value.delete(id)
  else expandedIds.value.add(id)
}

const tapeStatusMap = Object.fromEntries(ironTapeStatuses.map(s => [s.id, s]))
const faStatusMapProd = Object.fromEntries(firstArticleStatuses.map(s => [s.id, s]))



const getConfirmationStatus = (row: WorkOrder) => row.firstArticleStatusName || '待确认'
const getConfirmationClass = (row: WorkOrder) => faStatusMapProd[row.firstArticleStatusId]?.prodCssClass || ''

const rowStyle = (i: number) =>
  i % 2 === 1 ? { backgroundColor: 'rgba(255, 255, 255, 0.04)' } as const : {}

onMounted(async () => {
  workOrders.value = await productionApi.getWorkOrders()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped lang="scss">
.production-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.record-count {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.tbl-wrap {
  flex: 1;
  overflow-y: auto;
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
    user-select: none;
  }

  td {
    padding: 10px 12px;
    color: #e5e7eb;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    vertical-align: middle;
  }

  tr.clickable-row {
    cursor: pointer;

    &:hover td {
      background: rgba(229, 9, 20, 0.08);
    }
  }
}

.expand-row td {
  padding: 0;
  border-bottom: none;
}

.expand-body {
  padding: 0.7rem 1rem 0.9rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.expand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem 1.5rem;
}

.expand-item {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .label {
    color: var(--color-text-secondary);
    font-size: 0.78rem;
  }

  .value {
    color: var(--color-text);
    font-size: 0.88rem;
  }
}

.status-tag-sm {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;

  &.status-no { color: #9ca3af; background: rgba(156, 163, 175, 0.15); }
  &.status-qc { color: #3b82f6; background: rgba(59, 130, 246, 0.15); }
  &.status-leader { color: #a855f7; background: rgba(168, 85, 247, 0.15); }
  &.status-biz { color: #14b8a6; background: rgba(20, 184, 166, 0.15); }
  &.status-done { color: #10b981; background: rgba(16, 185, 129, 0.15); }
}

.th-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  i {
    font-size: 1rem;
    transition: transform 0.2s;
  }
}

.filter-th {
  position: relative;
}

.filter-th.has-filter i {
  color: var(--color-primary);
}

.sort-th {
  &:hover .sort-arrow {
    opacity: 0.6;
  }
}

.sort-arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  opacity: 0.25;
  transition: opacity 0.2s;

  &.arrow-up {
    border-bottom: 6px solid var(--color-primary);
    opacity: 1;
  }

  &.arrow-down {
    border-top: 6px solid var(--color-primary);
    opacity: 1;
  }
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  max-height: 240px;
  overflow-y: auto;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px 0;
  z-index: 100;
  box-shadow: var(--shadow-lg);

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    color: var(--color-text);
    font-size: 0.85rem;
    font-weight: 400;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    input[type="checkbox"] {
      accent-color: var(--color-primary);
      flex-shrink: 0;
    }
  }
}

.filter-all {
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 4px;
  padding-bottom: 6px;
  color: var(--color-text-secondary) !important;
  font-weight: 500 !important;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;

  &.status-no {
    color: #6b7280;
    background: rgba(107, 114, 128, 0.15);
  }

  &.status-yes {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.15);
  }

  &.status-wait {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.15);
  }

  &.status-done {
    color: #10b981;
    background: rgba(16, 185, 129, 0.15);
  }
}
</style>
