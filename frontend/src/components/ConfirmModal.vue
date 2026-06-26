<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="cancel">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="cancel"><i class="ri-close-line"></i></button>
        </div>
        <div class="modal-body">
          <slot>{{ message }}</slot>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancel">取消</button>
          <button class="btn btn-confirm" @click="confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  visible: boolean
  title?: string
  message?: string
  confirmText?: string
}>(), {
  title: '确认',
  message: '',
  confirmText: '确认',
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const cancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const confirm = () => {
  emit('update:visible', false)
  emit('confirm')
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  min-width: 320px;
  max-width: 420px;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.1rem;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    display: flex;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.modal-body {
  padding: var(--spacing-lg);
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  min-height: 40px;
}

.btn-cancel {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);

  &:hover {
    color: var(--color-text);
    border-color: var(--color-text-secondary);
  }
}

.btn-confirm {
  background: var(--color-primary);
  color: white;
  border: none;

  &:hover {
    background: #ff3b47;
    box-shadow: 0 0 12px rgba(229, 9, 20, 0.4);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
