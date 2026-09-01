<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl transition-colors duration-300">
    
    <!-- Left: Items counter info -->
    <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
      Affichage de 
      <span class="font-bold text-slate-800 dark:text-slate-200">{{ startItem }}</span>
      à
      <span class="font-bold text-slate-800 dark:text-slate-200">{{ endItem }}</span>
      sur
      <span class="font-bold text-brand-600 dark:text-brand-400">{{ store.totalCount }}</span> candidatures
    </div>

    <!-- Right: Page Controls -->
    <div class="flex items-center space-x-4">
      
      <!-- Limit Selector -->
      <div class="flex items-center space-x-2">
        <span class="text-xs text-slate-500 dark:text-slate-400">Par page :</span>
        <select
          :value="store.filters._limit || 9"
          @change="onLimitChange"
          class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 py-1 px-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option :value="6" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">6</option>
          <option :value="9" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">9</option>
          <option :value="12" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">12</option>
          <option :value="24" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">24</option>
        </select>
      </div>

      <!-- Pagination Buttons -->
      <div class="flex items-center space-x-1.5">
        <button
          @click="store.setPage(store.filters._page! - 1)"
          :disabled="store.filters._page === 1"
          class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Page Précédente"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/60">
          Page {{ store.filters._page }} / {{ store.totalPages }}
        </span>

        <button
          @click="store.setPage(store.filters._page! + 1)"
          :disabled="store.filters._page! >= store.totalPages"
          class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Page Suivante"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';

const store = useCandidaturesStore();

const startItem = computed(() => {
  if (store.totalCount === 0) return 0;
  return ((store.filters._page || 1) - 1) * (store.filters._limit || 9) + 1;
});

const endItem = computed(() => {
  return Math.min(
    (store.filters._page || 1) * (store.filters._limit || 9),
    store.totalCount
  );
});

function onLimitChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  store.setFilters({ _limit: parseInt(target.value, 10), _page: 1 });
}
</script>
