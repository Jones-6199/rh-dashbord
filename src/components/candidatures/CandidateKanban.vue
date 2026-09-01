<template>
  <div class="overflow-x-auto pb-6 snap-x snap-mandatory">
    <div class="flex space-x-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4 md:space-x-0 min-w-[300px] md:min-w-[1100px]">
      
      <!-- Kanban Columns by Status -->
      <div
        v-for="statut in store.statuts"
        :key="statut.id"
        @dragover.prevent
        @dragenter.prevent="draggedOverColumn = statut.nom"
        @dragleave="draggedOverColumn = null"
        @drop="onDrop($event, statut.nom)"
        :class="[
          'bg-slate-100/80 dark:bg-slate-900/80 border rounded-2xl p-3 flex flex-col min-h-[500px] sm:min-h-[550px] w-[85vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-center transition-all duration-200',
          draggedOverColumn === statut.nom
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 shadow-xl shadow-brand-500/10 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800'
        ]"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <div :class="['w-2.5 h-2.5 rounded-full', columnDotClass(statut.nom)]"></div>
            <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
              {{ statut.nom }}
            </h3>
          </div>
          <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
            {{ getCandidatesForStatus(statut.nom).length }}
          </span>
        </div>

        <!-- Draggable Cards List -->
        <div class="flex-1 space-y-3">
          <div
            v-for="candidate in getCandidatesForStatus(statut.nom)"
            :key="candidate.id"
            draggable="true"
            @dragstart="onDragStart($event, candidate.id)"
            @click="store.openCandidateDetail(candidate)"
            class="group bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 hover:border-brand-500/60 rounded-xl p-3.5 shadow-sm dark:shadow-md hover:shadow-xl transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
          >
            <!-- Card Name & Position -->
            <div class="flex items-start justify-between gap-1">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate">
                {{ candidate.nom }}
              </h4>
              <GripVertical class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0" />
            </div>
            
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {{ candidate.poste }}
            </p>

            <!-- Card Tags -->
            <div class="flex flex-wrap gap-1 mt-2.5">
              <span
                v-for="skill in candidate.competences.slice(0, 2)"
                :key="skill"
                class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[9px] rounded font-medium border border-slate-200 dark:border-slate-700/50"
              >
                {{ skill }}
              </span>
            </div>

            <!-- Footer: Exp & Date -->
            <div class="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/40">
              <span>Exp: {{ candidate.experience }}</span>
              <span>{{ formatDate(candidate.dateCandidature) }}</span>
            </div>
          </div>

          <!-- Empty Column Drop Hint -->
          <div
            v-if="getCandidatesForStatus(statut.nom).length === 0"
            class="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-500 text-center p-2"
          >
            Déposez un candidat ici
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GripVertical } from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';
import type { Candidature } from '@/types/candidate';

const store = useCandidaturesStore();
const draggedOverColumn = ref<string | null>(null);

function getCandidatesForStatus(statusName: string): Candidature[] {
  return store.candidatures.filter((c) => c.statut === statusName);
}

function formatDate(isoStr: string): string {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
}

function columnDotClass(status: string): string {
  switch (status) {
    case 'En attente':
      return 'bg-slate-400';
    case 'Entretien RH':
      return 'bg-amber-400';
    case 'Test Technique':
      return 'bg-blue-400';
    case 'Entretien Client':
      return 'bg-purple-400';
    case 'Accepté':
      return 'bg-emerald-400';
    case 'Refusé':
      return 'bg-rose-400';
    default:
      return 'bg-slate-400';
  }
}

function onDragStart(e: DragEvent, candidateId: number) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', candidateId.toString());
    e.dataTransfer.effectAllowed = 'move';
  }
}

function onDrop(e: DragEvent, newStatus: string) {
  draggedOverColumn.value = null;
  if (!e.dataTransfer) return;

  const candidateIdStr = e.dataTransfer.getData('text/plain');
  const candidateId = parseInt(candidateIdStr, 10);

  if (candidateId) {
    store.updateStatusOptimistic(candidateId, newStatus);
  }
}
</script>
