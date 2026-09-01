export interface Commentaire {
  id: number;
  auteur: string;
  date: string; // ISO 8601
  contenu: string;
}

export interface Candidature {
  id: number;
  nom: string;
  poste: string;
  statut: string;
  competences: string[];
  experience: string;
  dateCandidature: string; // ISO 8601
  email: string;
  telephone: string;
  cv: string;
  lettreMotivation: string;
  salaireSouhaite: number;
  disponibilite: string;
  localisation: string;
  commentaires: Commentaire[];
}

export interface StatutInfo {
  id: number;
  nom: string;
  couleur: string;
  ordre: number;
}

export interface FilterParams {
  q?: string;
  statut?: string;
  poste?: string;
  competences?: string[];
  _sort?: string;
  _order?: 'asc' | 'desc';
  _page?: number;
  _limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ViewMode = 'grid' | 'kanban';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
