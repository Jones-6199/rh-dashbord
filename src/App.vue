<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white transition-colors duration-300">
    
    <!-- Top Navbar -->
    <AppNavbar />

    <!-- Main Responsive Container: Full width on mobile px-3.5, 80% on desktop -->
    <main class="w-full sm:w-[92%] md:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
      
      <!-- Candidate Filter Bar -->
      <CandidateFilterBar />

      <!-- Loading Skeleton State -->
      <SkeletonLoader v-if="store.isLoading && store.candidatures.length === 0" :view-mode="store.viewMode" />

      <!-- Network Error State -->
      <ErrorState v-else-if="store.error" :error-message="store.error" @retry="onRetry" />

      <!-- Main Content Views -->
      <div v-else class="flex-1">
        <!-- Grid View -->
        <div v-if="store.viewMode === 'grid'">
          <CandidateGrid />
          <Pagination v-if="store.candidatures.length > 0" class="mt-5 sm:mt-6" />
        </div>

        <!-- Kanban Board View -->
        <div v-else-if="store.viewMode === 'kanban'">
          <CandidateKanban />
        </div>
      </div>

    </main>

    <!-- Global Modals & Notifications -->
    <CandidateDetailModal />
    <ToastContainer />

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-4 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
      <div class="w-full sm:w-[92%] md:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto px-3.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 RH Dashboard - Plateforme de Recrutement Senior Vue 3</p>
        <p class="text-[11px] font-mono text-slate-500 dark:text-slate-600">Connecté à REST API ({{ API_URL }})</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavbar from '@/components/common/AppNavbar.vue';
import CandidateFilterBar from '@/components/candidatures/CandidateFilterBar.vue';
import CandidateGrid from '@/components/candidatures/CandidateGrid.vue';
import CandidateKanban from '@/components/candidatures/CandidateKanban.vue';
import CandidateDetailModal from '@/components/candidatures/CandidateDetailModal.vue';
import Pagination from '@/components/common/Pagination.vue';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import { useCandidaturesStore } from '@/stores/candidatures';
import { API_URL } from '@/services/api';

const store = useCandidaturesStore();

onMounted(async () => {
  await store.initMetaData();
  await store.fetchCandidatures();
});

function onRetry() {
  store.initMetaData();
  store.fetchCandidatures();
}
</script>
