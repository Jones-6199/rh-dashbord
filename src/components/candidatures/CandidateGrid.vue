<template>
  <div>
    <!-- Empty State -->
    <div
      v-if="store.candidatures.length === 0 && !store.isLoading"
      class="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <UserX class="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">Aucune candidature trouvée</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Aucun candidat ne correspond à vos critères de recherche actuels. Essayez de réinitialiser vos filtres.
      </p>
      <button
        @click="store.resetFilters()"
        class="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-600/20"
      >
        Réinitialiser les filtres
      </button>
    </div>

    <!-- Candidate Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="candidate in store.candidatures"
        :key="candidate.id"
        class="group relative bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <!-- Header: Avatar + Candidate Info + Status Pill -->
          <div class="flex items-start justify-between gap-2.5 mb-3.5">
            <div class="flex items-center space-x-2.5 min-w-0 flex-1">
              <div class="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                {{ getInitials(candidate.nom) }}
              </div>
              <div class="min-w-0 flex-1">
                <h3
                  @click="store.openCandidateDetail(candidate)"
                  class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors truncate"
                  :title="candidate.nom"
                >
                  {{ candidate.nom }}
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5 truncate" :title="candidate.poste">
                  <Briefcase class="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span class="truncate">{{ candidate.poste }}</span>
                </p>
              </div>
            </div>

            <!-- Status Pill Badge - SINGLE LINE ALWAYS -->
            <span :class="['px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border whitespace-nowrap shrink-0 self-start leading-none shadow-sm', statusBadgeClass(candidate.statut)]">
              {{ candidate.statut }}
            </span>
          </div>

          <!-- Attributes Summary: Experience, Location, Salary -->
          <div class="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-slate-800/80 my-3 text-[11px]">
            <div class="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 truncate">
              <Award class="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
              <span class="truncate">Exp: <strong>{{ candidate.experience }}</strong></span>
            </div>
            <div class="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 truncate">
              <MapPin class="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
              <span class="truncate" :title="candidate.localisation">{{ candidate.localisation }}</span>
            </div>
            <div class="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 truncate">
              <Euro class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span class="truncate"><strong>{{ candidate.salaireSouhaite.toLocaleString('fr-FR') }} €</strong>/an</span>
            </div>
            <div class="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 truncate">
              <Calendar class="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span class="truncate">{{ formatDate(candidate.dateCandidature) }}</span>
            </div>
          </div>

          <!-- Competences Badges -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="skill in candidate.competences"
              :key="skill"
              class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-[9.5px] font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          
          <!-- Quick Status Select Dropdown (Optimistic update) -->
          <select
            :value="candidate.statut"
            @change="onStatusSelectChange($event, candidate.id)"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] text-slate-800 dark:text-slate-200 py-1 px-1.5 font-medium focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option
              v-for="s in store.statuts"
              :key="s.id"
              :value="s.nom"
              class="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              ➔ {{ s.nom }}
            </option>
          </select>

          <!-- View Profile Button -->
          <button
            @click="store.openCandidateDetail(candidate)"
            class="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-600/20 hover:bg-brand-100 dark:hover:bg-brand-600/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 text-[11px] font-semibold transition-all hover:translate-x-0.5"
          >
            <span>Fiche</span>
            <ArrowRight class="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserX,
  Briefcase,
  Award,
  MapPin,
  Euro,
  Calendar,
  ArrowRight,
} from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';

const store = useCandidaturesStore();

function getInitials(name: string): string {
  if (!name) return 'CN';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(isoStr: string): string {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'En attente':
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    case 'Entretien RH':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40';
    case 'Test Technique':
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40';
    case 'Entretien Client':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40';
    case 'Accepté':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40';
    case 'Refusé':
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  }
}

function onStatusSelectChange(e: Event, candidateId: number) {
  const target = e.target as HTMLSelectElement;
  store.updateStatusOptimistic(candidateId, target.value);
}
</script>
