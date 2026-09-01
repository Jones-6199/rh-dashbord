<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="store.isModalOpen && candidate"
      class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end transition-colors duration-300"
      @click.self="store.closeModal()"
    >
      <Transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div class="w-full sm:max-w-xl md:max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto transition-colors duration-300">
          
          <div>
            <!-- Modal Header: Close button & Avatar Header -->
            <div class="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Fiche Candidat #{{ candidate.id }}
              </span>
              <button
                @click="store.closeModal()"
                class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Profile Summary Header -->
            <div class="my-4 sm:my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div class="flex items-center space-x-3 sm:space-x-4">
                <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-lg shadow-brand-500/20 shrink-0">
                  {{ getInitials(candidate.nom) }}
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{{ candidate.nom }}</h2>
                  <p class="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">{{ candidate.poste }}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
                    <Calendar class="w-3 h-3 shrink-0" />
                    <span>Candidature reçue le {{ formatDate(candidate.dateCandidature) }}</span>
                  </p>
                </div>
              </div>

              <!-- Status Action Modifier -->
              <div class="w-full sm:w-auto">
                <label class="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Changer Statut</label>
                <select
                  :value="candidate.statut"
                  @change="onStatusChange"
                  class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white py-2 px-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              </div>
            </div>

            <!-- Contact & Info Grid Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
                <Mail class="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div class="truncate">
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Email</p>
                  <a :href="`mailto:${candidate.email}`" class="text-xs text-slate-900 dark:text-slate-200 hover:underline font-medium truncate block">
                    {{ candidate.email }}
                  </a>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
                <Phone class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Téléphone</p>
                  <p class="text-xs text-slate-900 dark:text-slate-200 font-medium">{{ candidate.telephone }}</p>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
                <MapPin class="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Localisation</p>
                  <p class="text-xs text-slate-900 dark:text-slate-200 font-medium">{{ candidate.localisation }}</p>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
                <Clock class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Disponibilité</p>
                  <p class="text-xs text-slate-900 dark:text-slate-200 font-medium">{{ candidate.disponibilite }}</p>
                </div>
              </div>
            </div>

            <!-- Experience & Salary -->
            <div class="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0 p-3.5 sm:p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/30 mb-5 sm:mb-6">
              <div>
                <span class="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-400">Expérience Global</span>
                <p class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{{ candidate.experience }}</p>
              </div>
              <div class="hidden xs:block h-8 w-[1px] bg-brand-200 dark:bg-brand-800/40"></div>
              <div>
                <span class="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-400">Prétention Salariale</span>
                <p class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{{ candidate.salaireSouhaite.toLocaleString('fr-FR') }} € / an</p>
              </div>
            </div>

            <!-- Skills List -->
            <div class="mb-5 sm:mb-6">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Compétences Clés</h4>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <span
                  v-for="skill in candidate.competences"
                  :key="skill"
                  class="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-semibold"
                >
                  #{{ skill }}
                </span>
              </div>
            </div>

            <!-- Cover Letter -->
            <div class="mb-5 sm:mb-6">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Lettre de Motivation</h4>
              <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{{ candidate.lettreMotivation }}"
              </div>
            </div>

            <!-- CV Link -->
            <div class="mb-6 sm:mb-8">
              <a
                :href="candidate.cv"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
              >
                <FileText class="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Consulter le CV (PDF)</span>
                <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <!-- Comments Timeline Feed Section -->
            <div class="pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5 sm:mb-4 flex items-center space-x-2">
                <MessageSquare class="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Notes et Historique Recruteurs ({{ candidate.commentaires.length }})</span>
              </h4>

              <!-- Add Comment Input Box -->
              <div class="mb-5 sm:mb-6 space-y-2">
                <textarea
                  v-model="newCommentText"
                  rows="3"
                  placeholder="Ajouter une note ou un compte-rendu d'entretien..."
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    @click="submitComment"
                    :disabled="!newCommentText.trim()"
                    class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-brand-600/20"
                  >
                    <Send class="w-3.5 h-3.5" />
                    <span>Publier la note</span>
                  </button>
                </div>
              </div>

              <!-- Comments List -->
              <div v-if="candidate.commentaires.length > 0" class="space-y-3">
                <div
                  v-for="comment in candidate.commentaires"
                  :key="comment.id"
                  class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5 shadow-sm"
                >
                  <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span class="font-bold text-brand-600 dark:text-brand-300">{{ comment.auteur }}</span>
                    <span>{{ formatDate(comment.date) }}</span>
                  </div>
                  <p class="text-slate-800 dark:text-slate-200 leading-relaxed">{{ comment.contenu }}</p>
                </div>
              </div>

              <div v-else class="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                Aucun commentaire pour le moment.
              </div>

            </div>

          </div>

          <!-- Footer Close Button -->
          <div class="pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 sm:mt-8 flex justify-end">
            <button
              @click="store.closeModal()"
              class="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Fermer la fiche
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-vue-next';
import { useCandidaturesStore } from '@/stores/candidatures';

const store = useCandidaturesStore();
const candidate = computed(() => store.selectedCandidate);
const newCommentText = ref('');

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
  return new Date(isoStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function onStatusChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  if (candidate.value) {
    store.updateStatusOptimistic(candidate.value.id, target.value);
  }
}

function submitComment() {
  if (!newCommentText.value.trim() || !candidate.value) return;
  store.addCommentOptimistic(candidate.value.id, newCommentText.value.trim());
  newCommentText.value = '';
}
</script>
