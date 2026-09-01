import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CandidaturesService } from '@/services/candidatures.service';
import { useNotification } from '@/composables/useNotification';
import type {
  Candidature,
  StatutInfo,
  FilterParams,
  ViewMode,
} from '@/types/candidate';

export const useCandidaturesStore = defineStore('candidatures', () => {
  const { notifySuccess, notifyError } = useNotification();

  // State
  const candidatures = ref<Candidature[]>([]);
  const statuts = ref<StatutInfo[]>([]);
  const postes = ref<string[]>([]);
  const competencesList = ref<string[]>([]);

  const totalCount = ref(0);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const viewMode = ref<ViewMode>(
    (localStorage.getItem('talentpulse_view_mode') as ViewMode) || 'grid'
  );

  const selectedCandidate = ref<Candidature | null>(null);
  const isModalOpen = ref(false);

  // Filters State
  const filters = ref<FilterParams>({
    q: '',
    statut: 'Tous',
    poste: 'Tous',
    competences: [],
    _sort: 'dateCandidature',
    _order: 'desc',
    _page: 1,
    _limit: 9,
  });

  // Current AbortController for race-condition prevention
  let currentAbortController: AbortController | null = null;

  // Actions
  function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
    localStorage.setItem('talentpulse_view_mode', mode);
  }

  function setPage(page: number) {
    filters.value._page = page;
    fetchCandidatures();
  }

  function setFilters(newFilters: Partial<FilterParams>) {
    filters.value = { ...filters.value, ...newFilters, _page: 1 };
    fetchCandidatures();
  }

  function resetFilters() {
    filters.value = {
      q: '',
      statut: 'Tous',
      poste: 'Tous',
      competences: [],
      _sort: 'dateCandidature',
      _order: 'desc',
      _page: 1,
      _limit: 9,
    };
    fetchCandidatures();
  }

  async function initMetaData() {
    try {
      const [fetchedStatuts, fetchedPostes, fetchedSkills] = await Promise.all([
        CandidaturesService.getStatuts(),
        CandidaturesService.getPostes(),
        CandidaturesService.getCompetences(),
      ]);
      statuts.value = fetchedStatuts;
      postes.value = fetchedPostes;
      competencesList.value = fetchedSkills;
    } catch (err: any) {
      console.error('Failed to load static metadata:', err);
    }
  }

  async function fetchCandidatures() {
    // Cancel previous inflight request if searching/filtering rapidly
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    isLoading.value = true;
    error.value = null;

    try {
      const result = await CandidaturesService.getCandidatures(
        filters.value,
        currentAbortController.signal
      );
      candidatures.value = result.data;
      totalCount.value = result.total;
      totalPages.value = result.totalPages;
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return; // Ignore canceled requests
      }
      error.value =
        err.message || 'Impossible de se connecter à JSON Server (http://localhost:3000)';
      notifyError('Erreur Réseau', 'Impossible de récupérer la liste des candidatures.');
    } finally {
      isLoading.value = false;
    }
  }

  function openCandidateDetail(candidate: Candidature) {
    selectedCandidate.value = candidate;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedCandidate.value = null;
  }

  /**
   * OPTIMISTIC UPDATE for status change (Kanban Drag & Drop or Modal dropdown)
   */
  async function updateStatusOptimistic(candidateId: number, newStatut: string) {
    const candidateIndex = candidatures.value.findIndex((c) => c.id === candidateId);
    if (candidateIndex === -1) return;

    const previousStatut = candidatures.value[candidateIndex].statut;

    // 1. Instant local state mutation (Optimistic)
    candidatures.value[candidateIndex].statut = newStatut;
    if (selectedCandidate.value && selectedCandidate.value.id === candidateId) {
      selectedCandidate.value.statut = newStatut;
    }

    try {
      // 2. Server API sync
      await CandidaturesService.updateStatus(candidateId, newStatut);
      notifySuccess('Statut mis à jour', `Statut changé vers "${newStatut}".`);
    } catch (err: any) {
      // 3. Rollback on API failure
      candidatures.value[candidateIndex].statut = previousStatut;
      if (selectedCandidate.value && selectedCandidate.value.id === candidateId) {
        selectedCandidate.value.statut = previousStatut;
      }
      notifyError(
        'Erreur de synchronisation',
        'Échec de la mise à jour du statut. Rétablissement du statut initial.'
      );
    }
  }

  /**
   * OPTIMISTIC UPDATE for adding a comment
   */
  async function addCommentOptimistic(candidateId: number, contenu: string, auteur?: string) {
    const candidateIndex = candidatures.value.findIndex((c) => c.id === candidateId);
    const targetCandidate = candidateIndex !== -1 ? candidatures.value[candidateIndex] : selectedCandidate.value;

    if (!targetCandidate) return;

    const previousComments = [...targetCandidate.commentaires];
    const tempComment = {
      id: Date.now(),
      auteur: auteur || 'Recruteur Connecté',
      date: new Date().toISOString(),
      contenu,
    };

    // 1. Instant local mutation
    targetCandidate.commentaires = [tempComment, ...previousComments];

    try {
      // 2. Sync server
      const updated = await CandidaturesService.addCommentaire(
        candidateId,
        previousComments,
        contenu,
        auteur
      );
      // Replace with server result if needed
      targetCandidate.commentaires = updated.commentaires;
      notifySuccess('Commentaire ajouté', 'Le commentaire a été enregistré.');
    } catch (err: any) {
      // 3. Rollback
      targetCandidate.commentaires = previousComments;
      notifyError(
        'Erreur d\'enregistrement',
        'Impossible de publier le commentaire. Veuillez réessayer.'
      );
    }
  }

  // Kanban groupings helper
  const candidaturesByStatus = computed(() => {
    const map: Record<string, Candidature[]> = {};
    statuts.value.forEach((s) => {
      map[s.nom] = [];
    });

    candidatures.value.forEach((c) => {
      if (!map[c.statut]) {
        map[c.statut] = [];
      }
      map[c.statut].push(c);
    });

    return map;
  });

  return {
    candidatures,
    statuts,
    postes,
    competencesList,
    filters,
    totalCount,
    totalPages,
    isLoading,
    error,
    viewMode,
    selectedCandidate,
    isModalOpen,
    candidaturesByStatus,
    setViewMode,
    setPage,
    setFilters,
    resetFilters,
    initMetaData,
    fetchCandidatures,
    openCandidateDetail,
    closeModal,
    updateStatusOptimistic,
    addCommentOptimistic,
  };
});
