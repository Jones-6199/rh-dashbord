<template>
  <div class="my-8 p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-center max-w-xl mx-auto backdrop-blur-md shadow-lg transition-colors duration-300">
    <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
      <AlertTriangle class="w-7 h-7 text-rose-600 dark:text-rose-400" />
    </div>
    <h3 class="text-lg font-bold text-rose-900 dark:text-white mb-2">Erreur de Connexion API</h3>
    <p class="text-xs text-rose-700 dark:text-rose-200/80 mb-6 leading-relaxed">
      {{ errorMessage || 'Impossible d\'accéder aux données sur http://localhost:3000. Veuillez vérifier que JSON Server est bien démarré.' }}
    </p>
    
    <div class="p-3 bg-white dark:bg-slate-900/80 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 mb-6 text-left shadow-inner">
      <p class="text-slate-500 dark:text-slate-400 mb-1"># Command pour démarrer JSON Server :</p>
      <p class="text-emerald-600 dark:text-emerald-400 font-semibold">json-server --watch db.json --port 3000</p>
    </div>

    <button
      @click="$emit('retry')"
      class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 mx-auto"
    >
      <RefreshCw class="w-4 h-4 animate-spin-hover" />
      <span>Réessayer la Connexion</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';

defineProps<{
  errorMessage?: string | null;
}>();

defineEmits(['retry']);
</script>
