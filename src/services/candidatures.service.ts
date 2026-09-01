import { apiClient, getCachedOrFetch } from './api';
import type {
  Candidature,
  Commentaire,
  StatutInfo,
  FilterParams,
  PaginatedResponse,
} from '@/types/candidate';

export class CandidaturesService {
  /**
   * Fetches paginated, filtered, and searched candidatures from JSON Server
   */
  static async getCandidatures(
    params: FilterParams = {},
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Candidature>> {
    const page = params._page || 1;
    const limit = params._limit || 9;

    const queryParams: Record<string, any> = {
      _page: page,
      _limit: limit,
      _sort: params._sort || 'dateCandidature',
      _order: params._order || 'desc',
    };

    if (params.q && params.q.trim()) {
      queryParams.q = params.q.trim();
    }

    if (params.statut && params.statut !== 'Tous') {
      queryParams.statut = params.statut;
    }

    if (params.poste && params.poste !== 'Tous') {
      queryParams.poste = params.poste;
    }

    const response = await apiClient.get<Candidature[]>('/candidatures', {
      params: queryParams,
      signal,
    });

    // Parse X-Total-Count header provided by JSON Server
    const totalCountHeader = response.headers['x-total-count'];
    const total = totalCountHeader ? parseInt(totalCountHeader, 10) : response.data.length;

    // Optional client-side filtering for skills if specified
    let data = response.data;
    if (params.competences && params.competences.length > 0) {
      data = data.filter((c) =>
        params.competences!.every((skill) => c.competences.includes(skill))
      );
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  /**
   * Fetch single candidate by ID
   */
  static async getCandidatureById(id: number): Promise<Candidature> {
    const response = await apiClient.get<Candidature>(`/candidatures/${id}`);
    return response.data;
  }

  /**
   * Create a new candidate
   */
  static async createCandidature(candidature: Partial<Candidature>): Promise<Candidature> {
    const response = await apiClient.post<Candidature>('/candidatures', {
      ...candidature,
      dateCandidature: new Date().toISOString(),
      commentaires: candidature.commentaires || [],
    });
    return response.data;
  }

  /**
   * Update status via PATCH /candidatures/:id
   */
  static async updateStatus(id: number, statut: string): Promise<Candidature> {
    const response = await apiClient.patch<Candidature>(`/candidatures/${id}`, { statut });
    return response.data;
  }

  /**
   * Add comment to candidate via PATCH /candidatures/:id
   */
  static async addCommentaire(
    id: number,
    existingComments: Commentaire[],
    contenu: string,
    auteur = 'Recruteur Connecté'
  ): Promise<Candidature> {
    const newComment: Commentaire = {
      id: Date.now(),
      auteur,
      date: new Date().toISOString(),
      contenu,
    };

    const updatedComments = [newComment, ...existingComments];

    const response = await apiClient.patch<Candidature>(`/candidatures/${id}`, {
      commentaires: updatedComments,
    });
    return response.data;
  }

  /**
   * Delete candidate
   */
  static async deleteCandidature(id: number): Promise<void> {
    await apiClient.delete(`/candidatures/${id}`);
  }

  /**
   * Fetch all candidate status categories (cached)
   */
  static async getStatuts(): Promise<StatutInfo[]> {
    return getCachedOrFetch<StatutInfo[]>('/statuts');
  }

  /**
   * Fetch all available job position titles (cached)
   */
  static async getPostes(): Promise<string[]> {
    const raw = await getCachedOrFetch<any[]>('/postes');
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object' && raw[0].nom) {
      return raw.map((item) => item.nom);
    }
    return raw;
  }

  /**
   * Fetch all available skill tags (cached)
   */
  static async getCompetences(): Promise<string[]> {
    const raw = await getCachedOrFetch<any[]>('/competences');
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object' && raw[0].nom) {
      return raw.map((item) => item.nom);
    }
    return raw;
  }
}
