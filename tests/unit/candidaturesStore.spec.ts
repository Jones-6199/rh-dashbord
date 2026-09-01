import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCandidaturesStore } from '../../src/stores/candidatures';
import { CandidaturesService } from '../../src/services/candidatures.service';

vi.mock('../../src/services/candidatures.service');

describe('Candidatures Pinia Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default state values', () => {
    const store = useCandidaturesStore();
    expect(store.candidatures).toEqual([]);
    expect(store.viewMode).toBe('grid');
    expect(store.filters._page).toBe(1);
    expect(store.filters._limit).toBe(9);
  });

  it('updates view mode correctly', () => {
    const store = useCandidaturesStore();
    store.setViewMode('kanban');
    expect(store.viewMode).toBe('kanban');
  });

  it('performs optimistic status update and rolls back on server error', async () => {
    const store = useCandidaturesStore();
    
    
    store.candidatures = [
      {
        id: 1,
        nom: 'Sophie Martin',
        poste: 'Développeur Vue.js',
        statut: 'En attente',
        competences: ['Vue 3'],
        experience: '4 ans',
        dateCandidature: '2026-08-28T09:30:00.000Z',
        email: 'sophie@example.com',
        telephone: '+3360000000',
        cv: 'cv.pdf',
        lettreMotivation: 'Motivation text',
        salaireSouhaite: 48000,
        disponibilite: 'Immédiate',
        localisation: 'Paris',
        commentaires: [],
      },
    ];

    (CandidaturesService.updateStatus as any).mockRejectedValueOnce(new Error('Network Failure'));

    // Trigger optimistic update
    const promise = store.updateStatusOptimistic(1, 'Accepté');

    // Instantly updated in store before promise resolves
    expect(store.candidatures[0].statut).toBe('Accepté');

    await promise;

    // Rollback to initial status after API rejection
    expect(store.candidatures[0].statut).toBe('En attente');
  });
});
