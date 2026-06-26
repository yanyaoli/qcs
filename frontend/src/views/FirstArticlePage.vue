<template>
  <div class="first-article-page">
    <div class="left-panel">
      <div class="panel-header">
        <div class="header-left">
          <h2>待首件确认</h2>
          <span class="count">{{ displayGroups.length }} 项</span>
        </div>
        <button class="btn-text" @click="showAll = !showAll">
          {{ showAll ? '只看待确认' : '查看全部' }}
        </button>
      </div>
      <div class="list-wrap">
        <div
          v-for="group in displayGroups"
          :key="group.key"
          class="order-card"
          :class="{ active: selectedKey === group.key }"
          @click="selectGroup(group)"
        >
          <div class="card-top">
            <span class="card-title">{{ group.productName }}</span>
            <span class="card-spec">{{ group.specification }}</span>
            <span class="status-label" :class="statusLabelClass(group.status)">{{ group.status }}</span>
          </div>
          <div class="card-mid">
            <span class="order-count">{{ group.orders.length }} 单</span>
            <span class="sub-info" v-if="group.confirmedBy">{{ group.confirmedBy }}</span>
            <span class="sub-info" v-if="group.businessConfirmedBy"> / {{ group.businessConfirmedBy }}</span>
          </div>
        </div>
        <div v-if="displayGroups.length === 0" class="empty">暂无待确认项</div>
      </div>
    </div>

    <div class="right-panel">
      <div v-if="!selectedGroup" class="placeholder">
        <i class="ri-file-list-3-line"></i>
        <p>请选择待确认项</p>
      </div>

      <template v-else>
        <div class="panel-header">
          <div class="header-left">
            <h2>{{ selectedGroup.productName }}</h2>
            <span class="spec">{{ selectedGroup.specification }}</span>
          </div>
          <span class="timestamp">{{ currentTimestamp }}</span>
        </div>

        <div class="detail-area">
          <div class="detail-section">
            <div class="section-title">
              生产详情
              <span class="order-total">共 {{ selectedGroup.orders.length }} 单</span>
            </div>
            <div class="table-wrap-inner">
              <table class="mini-tbl">
                <thead>
                  <tr>
                    <th style="width:100px">工作单号</th>
                    <th style="width:90px">客户代号</th>
                    <th style="width:80px">排单日期</th>
                    <th style="width:60px">颜色</th>
                    <th style="width:70px">机台</th>
                    <th style="width:80px">烫带状态</th>
                    <th style="width:60px"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(row, i) in selectedGroup.orders" :key="row.id">
                    <tr :class="{ alt: i % 2 === 1 }" class="clickable-row" @click="toggleRowExpand(row.id)">
                      <td>{{ row.workOrderNo }}</td>
                      <td>{{ row.customerCode }}</td>
                      <td>{{ row.scheduleDate }}</td>
                      <td>
                        <span class="color-dot" :style="{ backgroundColor: colorMap[row.color] || '#999' }"></span>
                        {{ row.color }}
                      </td>
                      <td>{{ row.machineCode }}</td>
                      <td>
                        <span class="status-tag" :class="statusClass(row.ironTapeStatus)">{{ row.ironTapeStatus }}</span>
                      </td>
                      <td>
                        <i class="ri-arrow-down-s-line expand-icon" :class="{ open: expandedRows.has(row.id) }"></i>
                      </td>
                    </tr>
                    <tr v-if="expandedRows.has(row.id)" class="expand-row">
                      <td colspan="7">
                        <div class="expand-content">
                          <div class="expand-grid">
                            <div class="expand-item">
                              <span class="label">品名</span>
                              <span class="value">{{ row.productName }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="label">规格</span>
                              <span class="value">{{ row.specification }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="label">机台编号</span>
                              <span class="value">{{ row.machineCode }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="label">物理位置</span>
                              <span class="value">{{ getMachineLocation(row.machineCode) || '—' }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="label">所属部门</span>
                              <span class="value">{{ getMachineDept(row.machineCode) || '—' }}</span>
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
        </div>

        <div class="operation-area">
          <div class="op-section">
            <div class="section-title">首件判定</div>
            <div class="judge-row">
              <button class="btn btn-ok" :class="{ active: judgeResult === 'OK' }" @click="judgeResult = 'OK'">
                <i class="ri-check-line"></i> OK
              </button>
              <div class="judge-ng" :class="{ active: judgeResult === 'NG' }">
                <button class="btn btn-ng" @click="judgeResult = 'NG'">
                  <i class="ri-close-line"></i> NG
                </button>
                <select v-if="judgeResult === 'NG'" v-model="selectedDefect" class="defect-select">
                  <option value="">选择不良原因</option>
                  <option v-for="d in defectCauses" :key="d.id" :value="d.cause">{{ d.cause }}</option>
                </select>
              </div>
            </div>
            <div class="judge-actions">
              <button class="btn btn-confirm" :disabled="!canConfirm" @click="confirmFirstArticle">确认首件</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { workOrders, machines, departments, defectCauses, firstArticleConfirmations } from '../mock/data'
import type { WorkOrder, FirstArticleConfirmation } from '../mock/data'

const colorMap: Record<string, string> = {
  '红色': '#ef4444',
  '蓝色': '#3b82f6',
  '黑色': '#111827',
  '银色': '#9ca3af',
  '金色': '#f59e0b',
  '白色': '#f3f4f6',
  '灰色': '#6b7280',
  '绿色': '#10b981',
}

const statusClass = (status: string) => {
  switch (status) {
    case '不需要': return 'status-no'
    case '需要': return 'status-yes'
    case '等待烫带': return 'status-wait'
    case '烫带完成': return 'status-done'
    default: return ''
  }
}

interface PendingGroup {
  key: string
  productName: string
  specification: string
  orders: WorkOrder[]
  status: string
  confirmedBy?: string
  confirmedAt?: string
  businessConfirmed?: boolean
  businessConfirmedBy?: string
  businessConfirmedAt?: string
}

const confirmationMap = computed(() => {
  const map = new Map<string, FirstArticleConfirmation>()
  for (const c of firstArticleConfirmations) {
    map.set(c.productKey, c)
  }
  return map
})

const allGroups = computed<PendingGroup[]>(() => {
  const map = new Map<string, WorkOrder[]>()
  for (const wo of workOrders) {
    const key = `${wo.productName}|${wo.specification}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(wo)
  }
  return Array.from(map.entries()).map(([key, orders]) => {
    const [productName, specification] = key.split('|')
    const conf = confirmationMap.value.get(key)
    return {
      key,
      productName,
      specification,
      orders,
      status: conf?.status || '待确认',
      confirmedBy: conf?.confirmedBy,
      confirmedAt: conf?.confirmedAt,
      businessConfirmed: conf?.businessConfirmed,
      businessConfirmedBy: conf?.businessConfirmedBy,
      businessConfirmedAt: conf?.businessConfirmedAt,
    }
  })
})

const showAll = ref(false)

const displayGroups = computed(() => {
  if (showAll.value) return allGroups.value
  return allGroups.value.filter(g => g.status === '待确认')
})

const selectedKey = ref<string | null>(null)
const selectedGroup = computed(() =>
  displayGroups.value.find(g => g.key === selectedKey.value) ?? null
)

const expandedRows = ref(new Set<number>())

const toggleRowExpand = (id: number) => {
  if (expandedRows.value.has(id)) expandedRows.value.delete(id)
  else expandedRows.value.add(id)
}

const getMachineLocation = (code: string) =>
  machines.find(m => m.code === code)?.location ?? ''

const getMachineDept = (code: string) => {
  const m = machines.find(m => m.code === code)
  if (!m) return ''
  return departments.find(d => d.id === m.department_id)?.name ?? ''
}

const statusLabelClass = (status: string) => {
  switch (status) {
    case '待确认': return 'label-pending'
    case '品管确认': return 'label-qc'
    case '组长确认': return 'label-leader'
    case '业务确认': return 'label-biz'
    case '已确认': return 'label-done'
    default: return ''
  }
}

const currentTimestamp = ref('')

const updateTimestamp = () => {
  const now = new Date()
  const y = now.getFullYear()
  const mo = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTimestamp.value = `${y}-${mo}-${d} ${h}:${m}:${s}`
}

const selectGroup = (group: PendingGroup) => {
  selectedKey.value = group.key
  judgeResult.value = null
  selectedDefect.value = ''
  expandedRows.value = new Set()
}

const judgeResult = ref<'OK' | 'NG' | null>(null)
const selectedDefect = ref('')

const canConfirm = computed(() => {
  if (!judgeResult.value) return false
  if (judgeResult.value === 'NG' && !selectedDefect.value) return false
  return true
})

const confirmFirstArticle = () => {
  alert(`首件确认完成：${selectedGroup.value?.productName} - ${judgeResult.value}${judgeResult.value === 'NG' ? ' (' + selectedDefect.value + ')' : ''}`)
}

onMounted(() => {
  if (displayGroups.value.length > 0) {
    selectGroup(displayGroups.value[0])
  }
  updateTimestamp()
  setInterval(updateTimestamp, 1000)
})
</script>

<style scoped lang="scss">
.first-article-page {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 1.5rem;
}

.left-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.15rem;
    font-weight: 600;
  }

  .count {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
  }

  .spec {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
}

.timestamp {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  font-family: monospace;
}

.btn-text {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.list-wrap {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.order-card {
  padding: 0.6rem 0.85rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: rgba(229, 9, 20, 0.3);
  }

  &.active {
    border-color: var(--color-primary);
    background: rgba(229, 9, 20, 0.08);
  }
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.card-title {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
}

.card-spec {
  color: var(--color-text-secondary);
  font-size: 0.78rem;
}

.status-label {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 1px 8px;
  border-radius: 8px;
  font-weight: 500;
  flex-shrink: 0;

  &.label-pending { color: #9ca3af; background: rgba(156, 163, 175, 0.15); }
  &.label-qc { color: #3b82f6; background: rgba(59, 130, 246, 0.15); }
  &.label-leader { color: #a855f7; background: rgba(168, 85, 247, 0.15); }
  &.label-biz { color: #14b8a6; background: rgba(20, 184, 166, 0.15); }
  &.label-done { color: #10b981; background: rgba(16, 185, 129, 0.15); }
}

.card-mid {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-count {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
}

.sub-info {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
}

.empty {
  color: var(--color-text-secondary);
  text-align: center;
  padding: 3rem 0;
  font-size: 0.9rem;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  p {
    font-size: 0.95rem;
  }
}

.detail-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-section {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
}

.section-title {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-total {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 400;
}

.table-wrap-inner {
  overflow-x: auto;
}

.mini-tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  th {
    background: rgba(255, 255, 255, 0.05);
    color: #9ca3af;
    font-weight: 600;
    text-align: left;
    padding: 6px 8px;
    white-space: nowrap;
  }

  td {
    padding: 6px 8px;
    color: #e5e7eb;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  tr.alt td {
    background: rgba(255, 255, 255, 0.02);
  }

  tr.clickable-row {
    cursor: pointer;

    &:hover td {
      background: rgba(229, 9, 20, 0.08);
    }
  }
}

.expand-icon {
  font-size: 1rem;
  transition: transform 0.2s;
  display: block;

  &.open {
    transform: rotate(180deg);
  }
}

.expand-row td {
  padding: 0;
  border-bottom: none;
}

.expand-content {
  padding: 0.6rem 1rem 0.8rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.expand-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem 1rem;
}

.expand-item {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .label {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .value {
    color: var(--color-text);
    font-size: 0.85rem;
  }
}

.color-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.status-tag {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  &.status-no { color: #6b7280; background: rgba(107, 114, 128, 0.15); }
  &.status-yes { color: #f59e0b; background: rgba(245, 158, 11, 0.15); }
  &.status-wait { color: #3b82f6; background: rgba(59, 130, 246, 0.15); }
  &.status-done { color: #10b981; background: rgba(16, 185, 129, 0.15); }
}

.operation-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.op-section {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.judge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.judge-ng {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.active .btn-ng {
    border-color: var(--color-error);
    background: rgba(239, 68, 68, 0.15);
    color: var(--color-error);
  }
}

.defect-select {
  padding: 0.45rem 0.6rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.judge-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1.2rem;
  font-size: 0.85rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid transparent;
  font-family: inherit;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.btn-ok {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.25);

  &.active {
    background: rgba(16, 185, 129, 0.2);
    border-color: var(--color-success);
  }

  &:hover {
    background: rgba(16, 185, 129, 0.2);
  }
}

.btn-ng {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
  border-color: rgba(239, 68, 68, 0.25);

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
}

.btn-confirm {
  background: var(--color-primary);
  color: #fff;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
}
</style>
