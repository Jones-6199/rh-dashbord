<template>
  <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
    <div
      v-for="i in 6"
      :key="i"
      class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 animate-pulse flex flex-col space-y-4 shadow-sm"
    >
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700/60"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-slate-300 dark:bg-slate-700/80 rounded w-3/4"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/2"></div>
        </div>
      </div>
      <div class="h-6 bg-slate-200 dark:bg-slate-700/40 rounded-full w-1/3"></div>
      <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/30">
        <div class="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-5/6"></div>
      </div>
      <div class="flex space-x-2 pt-2">
        <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-lg"></div>
        <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-lg"></div>
        <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-lg"></div>
      </div>
    </div>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 py-4">
    <div
      v-for="col in 6"
      :key="col"
      class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-3 h-96 flex flex-col space-y-3 animate-pulse shadow-sm"
    >
      <div class="h-6 bg-slate-300 dark:bg-slate-700/80 rounded w-3/4 mb-2"></div>
      <div v-for="card in 3" :key="card" class="h-24 bg-slate-200 dark:bg-slate-700/40 rounded-xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ViewMode } from '@/types/candidate';

defineProps<{
  viewMode: ViewMode;
}>();
</script>
