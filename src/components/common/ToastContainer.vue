<template>
  <div class="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col space-y-2.5 max-w-full sm:max-w-sm w-full pointer-events-none">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in notifications"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start p-3.5 sm:p-4 rounded-xl shadow-2xl border backdrop-blur-lg transition-all duration-200',
          toastBgClass(toast.type)
        ]"
      >
        <div class="mr-3 flex-shrink-0 mt-0.5">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-500 dark:text-rose-400" />
          <AlertCircle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <Info v-else class="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
        </div>
        <div class="flex-1 mr-2">
          <h4 class="text-xs font-bold text-slate-900 dark:text-white tracking-wide uppercase">{{ toast.title }}</h4>
          <p class="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{{ toast.message }}</p>
        </div>
        <button
          @click="removeNotification(toast.id)"
          class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next';
import { useNotification } from '@/composables/useNotification';

const { notifications, removeNotification } = useNotification();

function toastBgClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-white/95 dark:bg-slate-900/95 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-emerald-500/10';
    case 'error':
      return 'bg-white/95 dark:bg-slate-900/95 border-rose-500/40 text-rose-950 dark:text-rose-100 shadow-rose-500/10';
    case 'warning':
      return 'bg-white/95 dark:bg-slate-900/95 border-amber-500/40 text-amber-950 dark:text-amber-100 shadow-amber-500/10';
    default:
      return 'bg-white/95 dark:bg-slate-900/95 border-cyan-500/40 text-cyan-950 dark:text-cyan-100 shadow-cyan-500/10';
  }
}
</script>
