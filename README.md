# 🚀 TalentPulse - Plateforme de Gestion des Candidatures Vue 3

[![Vue 3](https://img.shields.io/badge/Vue.js-3.4-4fc08d?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-State_Management-yellow?style=for-the-badge&logo=vue.js)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tested-646cff?style=for-the-badge&logo=vitest)](https://vitest.dev/)

**TalentPulse** est une application web moderne de gestion de recrutement et de suivi de pipeline candidat développée avec **Vue 3 (Composition API + `<script setup>`)**, **TypeScript**, **Pinia**, **Tailwind CSS**, **Lucide Icons** et **Vitest**, consommant les données en temps réel via **JSON Server**.

---

## ⚠️ CONFIGURATION JSON SERVER (OBLIGATOIRE)

L'application consomme exclusivement l'API REST JSON Server alimentée par le fichier `db.json`.

### Étape 1 : Installation des dépendances
```bash
npm install
```

### Étape 2 : Lancement simultané de l'API et du Frontend (Recommandé)
```bash
npm run start
```
> **Explication :** Cette commande lance à la fois JSON Server sur `http://localhost:3000` et Vite sur `http://localhost:5173` grâce à `concurrently`.

---

## 🛠️ Lancement Séparé (Optionnel)

Si vous préférez exécuter l'API et l'application frontend dans deux terminaux distincts :

**Terminal 1 : API JSON Server**
```bash
npm run api
# ou direct: json-server --watch db.json --port 3000
```
*Vérifiez le fonctionnement sur : [http://localhost:3000/candidatures](http://localhost:3000/candidatures)*

**Terminal 2 : Application Vue 3 Frontend**
```bash
npm run dev
```
*Ouvrez votre navigateur sur : [http://localhost:5173](http://localhost:5173)*

---

## 🧪 Tests Unitaires

Exécuter la suite complète de tests unitaires Vitest (Pinia store, composables, filtres) :
```bash
npm run test
```

---

## ⏱️ Suivi du Temps Passé

| Étape | Description | Temps Réel Passé |
| :--- | :--- | :--- |
| **Partie 0** | Setup de l'environnement, Vite, TypeScript, Tailwind, Lucide, `db.json` | 15 min |
| **Partie 1** | Analyse UX, diagnostic des frictions et document d'architecture | 35 min |
| **Partie 2** | Service API Axios, Caching, Query Params (`?q=`, `?_page=`, `?_sort=`), Debounce | 60 min |
| **Partie 2 (Bonus)** | Vue Kanban avec Drag & Drop HTML5, Optimistic UI Updates & Rollback | 45 min |
| **Partie 2 (Design)**| Intégration Mode Sombre/Clair, Container 80% width, Toasts, Skeletons | 45 min |
| **Partie 3** | Écriture des tests unitaires Vitest & Documentation README | 40 min |
| **TOTAL** | | **4h 00 min** |

---

## 📐 Choix Techniques & Justifications

### 1. Composition API & TypeScript Strict
* **Motivation :** Réutilisation maximale de la logique avec les composables (`useDebounce`, `useTheme`, `useNotification`), typage fort prévenant les erreurs de runtime.

### 2. Service Layer API & Caching In-Memory
* **Fichier :** `src/services/api.ts` & `src/services/candidatures.service.ts`
* **Fonctionnalités :** 
  * Axios client centralisé avec `timeout: 10000ms`.
  * **TTL Cache (5 min)** pour la récupération des métadonnées statiques (`GET /statuts`, `GET /postes`, `GET /competences`).
  * **AbortController** pour annuler les requêtes en vol lors d'une saisie rapide dans la recherche textuelle text (`?q=`), évitant les *Race Conditions*.
  * Parsing de l'en-tête HTTP `X-Total-Count` de JSON Server pour le calcul exact des pages.

### 3. Mises à Jour Optimistes (Optimistic UI) & Rollback
* **Fichier :** `src/stores/candidatures.ts`
* **Kanban & Modals :** Lors d'un Drag & Drop d'un candidat ou de l'ajout d'une note, le store Pinia mute l'état local immédiatement sans attendre la réponse du serveur. Si la requête `PATCH /candidatures/:id` échoue (ex: 500, coupure réseau), l'état est automatiquement rétabli (*rollback*) et une alerte Toast informe l'utilisateur.

### 4. Search Bar avec Debounce (350ms)
* **Composable :** `src/composables/useDebounce.ts`
* **Performance :** L'utilisateur peut saisir du texte de manière fluide sans bloquer l'UI et sans déclencher des dizaines de requêtes HTTP inutiles vers `GET /candidatures?q=...`.

### 5. Ergonomie et Design System 80% Container
* **Layout :** La largeur globale de l'application est contrainte à **80% de l'écran (`w-[80%] max-w-[1600px] mx-auto`)** sur grand écran pour offrir une concentration visuelle maximale.
* **Mode Sombre Natif :** Persistance du thème dans `localStorage` avec bascule fluide et icônes Lucide (`lucide-vue-next`).

---

## 📁 Architecture des Composants

```
src/
├── components/
│   ├── candidatures/
│   │   ├── CandidateDetailModal.vue   # Slide-over profil candidat & notes recruteur
│   │   ├── CandidateFilterBar.vue     # Barre de recherche (debounce) & filtres multi-critères
│   │   ├── CandidateGrid.vue          # Vue Grille avec badges et actions rapides
│   │   └── CandidateKanban.vue        # Vue Kanban Drag & Drop
│   └── common/
│       ├── AppNavbar.vue              # Top Navbar (KPIs, View toggle, Theme toggle)
│       ├── ErrorState.vue             # État d'erreur réseau avec Retry
│       ├── Pagination.vue             # Pagination dynamique (_page & _limit)
│       ├── SkeletonLoader.vue         # Chargeurs squelettes fluides
│       └── ToastContainer.vue         # Toasts de notification animés
├── composables/
│   ├── useDebounce.ts
│   ├── useNotification.ts
│   └── useTheme.ts
├── services/
│   ├── api.ts                         # Client Axios & Cache TTL
│   └── candidatures.service.ts        # Encapsulation des endpoints JSON Server
├── stores/
│   └── candidatures.ts                # Store Pinia centralisé
└── types/
    └── candidate.ts                   # Interfaces TypeScript
```

---

## 💡 Réponses aux Questions Bonus (Entretien Technique)

### 1. Comment gérer 10 000 candidatures côté front-end ?
* **Pagination & Infinite Scroll Côté Serveur :** Toujours négocier la quantité de données chargées via des paramètres de requête (`_page` & `_limit`).
* **Virtual Scrolling :** Utiliser des librairies comme `vue-virtual-scroller` ou `@tanstack/vue-virtual` pour ne rendre dans le DOM que les éléments actuellement visibles dans la zone d'affichage (viewport).
* **Web Workers & IndexedDB :** Déporter le filtrage ou l'indexation de recherche locale dans un Web Worker et mettre en cache les résultats dans IndexedDB.

### 2. Quelle stratégie pour les mises à jour temps réel ?
* **WebSockets / Server-Sent Events (SSE) :** Établir une connexion persistante entre le navigateur et le backend pour recevoir les événements de modification (ex: un autre recruteur change le statut d'un candidat).
* **Mise à jour réactive du Store :** Lorsqu'un événement WebSocket `CANDIDATE_STATUS_UPDATED` est reçu, mettre à jour le candidat dans le store Pinia sans recharger toute la liste.

### 3. Comment optimiser les appels API (cache, invalidation) ?
* **Stale-While-Revalidate (SWR) :** Servir immédiatement les données stockées en cache local tout en lançant une requête de vérification en arrière-plan.
* **Invalidation Ciblée :** Effacer le cache des candidatures uniquement lors d'une mutation réussie (`POST`, `PATCH`, `DELETE`).

### 4. Comment tester les composants qui font des appels API ?
* **Mocking HTTP (MSW / Vitest Mocks) :** Intercepter les requêtes HTTP lors des tests avec Mock Service Worker (MSW) ou `vi.mock('../../services/candidatures.service')` pour tester l'affichage des états de succès, de chargement et d'erreur sans dépendre d'un vrai serveur.

### 5. Accessibilité (a11y) : Quelles sont vos priorités ?
* **Bannières et Repères Sémantiques :** Utiliser `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`.
* **Navigation au Clavier :** Assurer un ordre de tabulation cohérent (`tabindex`) et gérer la fermeture des modals avec la touche `Échap` (`Escape`).
* **Rôles ARIA :** Définir `aria-label`, `aria-expanded` sur les boutons de bascule et `role="dialog"` avec `aria-modal="true"` sur le modal candidat.

---

**Développé avec passion pour l'excellence frontend et UX.** 🚀
