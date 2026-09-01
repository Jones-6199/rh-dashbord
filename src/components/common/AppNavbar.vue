<template>
  <header class="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 shadow-sm dark:shadow-none">
    <div class="w-full sm:w-[92%] md:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between py-2.5 sm:py-3">
      
      <!-- Brand Logo -->
      <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <div class="min-w-0">
          <div class="flex items-center space-x-1.5 sm:space-x-2">
            <h1 class="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              RH Dashboard
            </h1>
            <span class="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 whitespace-nowrap">
              Pro RH
            </span>
          </div>
          <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[160px] xs:max-w-[240px] sm:max-w-none">
            Gestion du Recrutement & Candidates Pipeline
          </p>
        </div>
      </div>

      <!-- Center KPI Quick Stats (Desktop/Tablet) -->
      <div class="hidden lg:flex items-center space-x-6 bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl px-5 py-2 transition-colors duration-300">
        <div class="flex items-center space-x-2">
          <Users class="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span class="text-xs text-slate-600 dark:text-slate-400">Total Candidats:</span>
          <span class="text-xs font-bold text-slate-900 dark:text-white">{{ store.totalCount }}</span>
        </div>
        <div class="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span class="text-xs text-slate-600 dark:text-slate-400">API Status:</span>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Connecté (JSON Server)</span>
        </div>
      </div>

      <!-- Right Controls: View Switcher & Dark Mode Toggle -->
      <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
        
        <!-- View Switcher Tabs -->
        <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
          <button
            @click="store.setViewMode('grid')"
            :class="[
              'flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              store.viewMode === 'grid'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            ]"
            aria-label="Vue Grille / Tableau"
          >
            <LayoutGrid class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline">Grille</span>
          </button>
          
          <button
            @click="store.setViewMode('kanban')"
            :class="[
              'flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              store.viewMode === 'kanban'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            ]"
            aria-label="Vue Kanban"
          >
            <Kanban class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline">Kanban</span>
          </button>
        </div>

        <!-- Dark/Light Theme Switcher -->
        <button
          @click="toggleTheme"
          class="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
          :title="isDarkMode ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'"
        >
          <Sun v-if="isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <Moon v-else class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        </button>

      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { Users, LayoutGrid, Kanban, Sun, Moon } from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';
import { useTheme } from '@/composables/useTheme';

const store = useCandidaturesStore();
const { isDarkMode, toggleTheme } = useTheme();
</script>
