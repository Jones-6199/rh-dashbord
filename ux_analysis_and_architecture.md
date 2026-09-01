# Document de Diagnostic UX & Architecture Technique - TalentPulse

**Auteur :** Développeur Frontend Senior Vue.js  
**Projet :** Application de Gestion du Recrutement & Suivi des Candidatures  
**Framework :** Vue 3 (Composition API, TypeScript, Pinia, Axios, Tailwind CSS)

---

## 1. Partie 1 : Diagnostic UX & Problématiques Métier Identifiées

Les recruteurs et responsables RH manipulent quotidiennement un volume important de données candidat. L'analyse des flux de travail réels met en évidence plusieurs frictions majeures dans l'expérience utilisateur (UX) :

### 1.1 Surcharge d'Informations et Cognitive Overhead
* **Problématique :** L'affichage brut sous forme de tableau dense sans hiérarchie visuelle entraîne une fatigue visuelle et ralentit la prise de décision.
* **Impact Recruteur :** Perte de temps pour repérer l'étape actuelle du candidat ou isoler les informations clés (compétences, prétentions salariales).
* **Solution UX :** 
  * Implémentation d'une vue **Kanban interactive avec Drag & Drop** pour visualiser d'un coup d'œil la ligne de production du recrutement (*pipeline*).
  * Système de badges colorés dynamiques et hiérarchisés selon l'état de la candidature.
  * Modal/Slide-over contextuel affichant l'historique complet et les actions rapides sans perte de contexte.

### 1.2 Latence de Recherche et Perte de Contexte lors des Filtrages
* **Problématique :** Des filtres lents ou nécessitant un rechargement de page brisent le flux de travail. Les recherches textuelles déclenchant une requête à chaque frappe surchargent l'API et génèrent du *flicker* (clignotement).
* **Impact Recruteur :** Frustration, erreurs d'inattention et temps de réponse dégradé.
* **Solution UX :**
  * **Debounce dynamique (300ms)** sur le champ de recherche textuelle (`?q=`).
  * Mise en place de composables réutilisables combinant les paramètres de requête de JSON Server (`statut`, `poste`, `_sort`, `_order`, `_page`, `_limit`).
  * Réinitialisation rapide des filtres (*Clear All*) et badges d'état actifs.

### 1.3 Absence de Retours Visuels Instantanés (Feedback Loop)
* **Problématique :** Attendre le retour d'une requête HTTP lors d'une action fréquente (déplacer un candidat, ajouter une note) donne une impression de lenteur.
* **Impact Recruteur :** Double-clic intempestif ou incertitude quant à la prise en compte de l'action.
* **Solution UX :**
  * **Mises à jour Optimistes (Optimistic UI Updates)** : L'interface s'actualise immédiatement avant la réponse du serveur, avec rollback automatique et notification Toast explicite en cas d'erreur réseau.
  * États de chargement élégants par **Skeleton Loaders** (au lieu de simples spinners bloquants).

### 1.4 Inconfort Visuel & Utilisation Prolongée
* **Problématique :** Une interface fixe trop lumineuse fatigue les yeux lors d'une utilisation continue (8h/jour).
* **Impact Recruteur :** Inconfort ergonomique.
* **Solution UX :**
  * Mode sombre natif (**Dark / Light Mode**) persisté en `localStorage` avec transitions fluides.
  * Largeur d'interface optimisée et contrainte (**80% de la largeur de l'écran**) pour éviter la dispersion visuelle sur écrans ultra-larges.

---

## 2. Architecture Technique Vue 3

### 2.1 Arborescence des Composants

```
src/
├── assets/                  # CSS et styles globaux
├── components/
│   ├── candidatures/
│   │   ├── CandidateDetailModal.vue   # Slide-over/Modal du profil candidat & commentaires
│   │   ├── CandidateFilterBar.vue     # Barre de filtre multi-critères avec debounce
│   │   ├── CandidateGrid.vue          # Vue Tableau / Grille
│   │   └── CandidateKanban.vue        # Vue Kanban Drag & Drop
│   └── common/
│       ├── AppNavbar.vue              # Barre de navigation top (Stats, Mode sombre, View toggle)
│       ├── ErrorState.vue             # Composant d'erreur réseau avec bouton Retry
│       ├── Pagination.vue             # Contrôle de pagination réactif
│       ├── SkeletonLoader.vue         # Squelette de chargement UI
│       └── ToastContainer.vue         # Système de notifications Toast
├── composables/
│   ├── useCandidatures.ts             # Logique métier d'orchestration
│   ├── useDebounce.ts                 # Utility composition debounce
│   ├── useNotification.ts             # Notification store/emitter
│   └── useTheme.ts                    # Gestion du thème sombre/clair
├── services/
│   ├── api.ts                         # Client Axios configuré avec Cache & CancelToken
│   └── candidatures.service.ts        # Encapsulation des endpoints JSON Server REST
├── stores/
│   └── candidatures.ts                # Store Pinia centralisé
├── types/
│   └── candidate.ts                   # Interfaces TypeScript
├── App.vue                            # Composant racine (Layout 80% container)
└── main.ts                            # Entrée de l'application Vue 3
```

---

## 3. Stratégie de Communication avec JSON Server & API Service Layer

### 3.1 Architecture du Service API (`src/services/api.ts`)
* **Client HTTP Axios Centralisé** avec `baseURL: 'http://localhost:3000'`.
* **Mise en Cache Client (TTL Cache)** : Les ressources statiques (`GET /statuts`, `GET /postes`, `GET /competences`) sont conservées en mémoire vive afin d'éviter des appels réseau superflus.
* **Gestion des Annulations (AbortController)** : Lors d'une saisie rapide dans la recherche, les requêtes précédentes non terminées sont annulées pour prévenir le phénomène de *Race Condition*.
* **Parseur de Pagination** : Extraction de l'en-tête `X-Total-Count` renvoyé par JSON Server pour calculer dynamiquement le nombre total de pages.

### 3.2 Implémentation des Query Params JSON Server
* **Recherche Full-Text :** `GET /candidatures?q={searchTerm}`
* **Filtres Multiples :** `GET /candidatures?statut={statut}&poste={poste}`
* **Tri Dynamique :** `GET /candidatures?_sort={field}&_order={asc|desc}`
* **Pagination Négociée :** `GET /candidatures?_page={page}&_limit={limit}`

---

## 4. Gestion d'État et Synchronisation (Pinia Store)

Le store `useCandidaturesStore` sert de **Single Source of Truth** :
1. **État Local Continu** : Stockage du tableau complet des candidatures affichées, des statuts et du candidat sélectionné.
2. **Synchronisation Optimiste** : 
   * Lors d'un changement de statut par Drag & Drop ou via le modal, le store met à jour la donnée en local immédiatement (`optimistic update`).
   * La requête `PATCH /candidatures/:id` est déclenchée en arrière-plan.
   * En cas d'échec HTTP (ex: 500, timeout), la donnée est automatiquement annulée (*rollback*) et un message d'alerte explicite s'affiche.
3. **Persistance des Préférences** : Sauvegarde des filtres actifs, de la vue sélectionnée (Kanban vs Table) et de la taille de page dans le `localStorage`.

---

## 5. Matrice de Couverture des Exigences

| Exigence Technique / UX | Solution Technique Implémentée |
| :--- | :--- |
| **JSON Server REST API** | Axios Service layer (`GET`, `POST`, `PATCH`, `DELETE`) + `_page`, `_limit`, `_sort`, `q` |
| **Gestion des erreurs et loaders** | Skeleton loaders, interceptors HTTP, composant `ErrorState` avec retry |
| **Drag & Drop Status** | HTML5 Drag & Drop native supporté dans la vue Kanban avec mise à jour optimiste |
| **Recherche & Performance** | Composable `useDebounce` sur l'input search `?q=` |
| **Mode Sombre** | Composable `useTheme` avec classe Tailwind `dark` persistée |
| **Accessibility (ARIA)** | Semantics HTML5, rôles ARIA sur modals/buttons, support navigation clavier |
| **Tests Unitaires** | Vitest + Vue Test Utils sur store, composables et filtres |
