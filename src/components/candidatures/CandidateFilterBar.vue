<template>
  <div class="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-sm dark:shadow-xl backdrop-blur-md mb-5 sm:mb-6 transition-colors duration-300">
    <div class="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-start lg:items-center">
      
      <!-- Search Input with Debounce -->
      <div class="relative flex-1 w-full">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchInput"
          type="text"
          placeholder="Rechercher un candidat, compétence, email... (ex: Vue 3)"
          class="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-10 py-2 sm:py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Dropdown Filters: Statut, Poste, Tri (Responsive Grid on Mobile) -->
      <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
        
        <!-- Filter Status -->
        <div class="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1.5">
          <Filter class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
          <span class="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:inline shrink-0">Statut:</span>
          <select
            :value="store.filters.statut || 'Tous'"
            @change="onStatutChange"
            class="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-medium w-full truncate"
          >
            <option value="Tous" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Tous les Statuts</option>
            <option
              v-for="s in store.statuts"
              :key="s.id"
              :value="s.nom"
              class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              {{ s.nom }}
            </option>
          </select>
        </div>

        <!-- Filter Poste -->
        <div class="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1.5">
          <Briefcase class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span class="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:inline shrink-0">Poste:</span>
          <select
            :value="store.filters.poste || 'Tous'"
            @change="onPosteChange"
            class="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-medium w-full truncate"
          >
            <option value="Tous" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Tous les Postes</option>
            <option
              v-for="p in store.postes"
              :key="p"
              :value="p"
              class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              {{ p }}
            </option>
          </select>
        </div>

        <!-- Sort Order -->
        <div class="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1.5 col-span-1 xs:col-span-2 sm:col-span-1">
          <ArrowUpDown class="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <select
            :value="`${store.filters._sort}:${store.filters._order}`"
            @change="onSortChange"
            class="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-medium w-full truncate"
          >
            <option value="dateCandidature:desc" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Date (Plus récente)</option>
            <option value="dateCandidature:asc" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Date (Plus ancienne)</option>
            <option value="nom:asc" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Nom (A-Z)</option>
            <option value="salaireSouhaite:desc" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Salaire (Plus élevé)</option>
          </select>
        </div>

        <!-- Clear Filters Button -->
        <button
          v-if="hasActiveFilters"
          @click="resetAll"
          class="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs transition-colors col-span-1 xs:col-span-2 sm:col-span-1"
          title="Réinitialiser les filtres"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span class="text-[11px]">Effacer</span>
        </button>

      </div>

    </div>

    <!-- Skills Multi-Select Pills -->
    <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 sm:gap-2">
      <span class="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1 shrink-0">Compétences :</span>
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 max-h-24 sm:max-h-none overflow-y-auto pr-1">
        <button
          v-for="skill in store.competencesList"
          :key="skill"
          @click="toggleSkill(skill)"
          :class="[
            'px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 border whitespace-nowrap',
            isSkillSelected(skill)
              ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border-brand-500/50 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/60'
          ]"
        >
          #{{ skill }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Search, Filter, Briefcase, ArrowUpDown, RotateCcw, X } from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';
import { useDebounce } from '@/composables/useDebounce';

const store = useCandidaturesStore();

const searchInput = ref(store.filters.q || '');
const debouncedSearch = useDebounce(searchInput, 350);

// Sync debounced search with Pinia store filter query `?q=`
watch(debouncedSearch, (newVal) => {
  if (newVal !== store.filters.q) {
    store.setFilters({ q: newVal });
  }
});

const hasActiveFilters = computed(() => {
  return (
    !!store.filters.q ||
    store.filters.statut !== 'Tous' ||
    store.filters.poste !== 'Tous' ||
    (store.filters.competences && store.filters.competences.length > 0)
  );
});

function onStatutChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  store.setFilters({ statut: target.value });
}

function onPosteChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  store.setFilters({ poste: target.value });
}

function onSortChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  const [sort, order] = target.value.split(':');
  store.setFilters({ _sort: sort, _order: order as 'asc' | 'desc' });
}

function isSkillSelected(skill: string) {
  return store.filters.competences?.includes(skill);
}

function toggleSkill(skill: string) {
  const currentSkills = [...(store.filters.competences || [])];
  const index = currentSkills.indexOf(skill);

  if (index > -1) {
    currentSkills.splice(index, 1);
  } else {
    currentSkills.push(skill);
  }

  store.setFilters({ competences: currentSkills });
}

function resetAll() {
  searchInput.value = '';
  store.resetFilters();
}
</script>
