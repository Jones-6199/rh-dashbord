# 🌐 Guide d'Hébergement & Déploiement - RH Dashboard

Pour héberger l'application **RH Dashboard** en gardant **JSON Server (`db.json`) et l'API REST fonctionnels en temps réel** (avec persistance des `PATCH`, `POST`, `DELETE`), voici les meilleures options recommandées par les experts.

---

## 🏆 Option 1 : Render.com (Recommandé - 100% Gratuit)

Render permet d'héberger des services Node.js actifs avec stockage persistant.

### Méthode A : Déploiement Unifié (API + Frontend en 1 seul Service)

1. **Créer un fichier `server.js` à la racine** pour servir JSON Server et le build Vite :
```javascript
import jsonServer from 'json-server';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 3000;

app.use(middlewares);
app.use('/api', router); // API REST accessible sur /api/candidatures

// Servir les fichiers statiques générés par Vite (dist)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. **Commandes sur Render.com :**
   - **Build Command :** `npm install && npm run build`
   - **Start Command :** `node server.js`

> 💡 **Note pour Vite Host Security (Render) :**  
> `vite.config.ts` inclut `allowedHosts: true` dans `server` et `preview` afin d'autoriser automatiquement l'accès depuis le domaine Render (`rh-dashbord.onrender.com`).

---

## 🚀 Option 2 : Vercel (Frontend) + Render / Railway (API Backend)

Si vous voulez bénéficier du CDN ultra-rapide de **Vercel** pour le frontend Vue 3 :

### Étape 1 : Héberger l'API sur Render ou Railway
- Déployez votre dépôt sur **Render.com** (Web Service).
- **Start Command :** `npx json-server --watch db.json --port 3000`
- Vous obtiendrez une URL d'API publique : `https://rh-dashboard-api.onrender.com`

### Étape 2 : Héberger le Frontend Vue 3 sur Vercel
- Connectez votre dépôt GitHub à **Vercel.com**.
- Ajoutez la variable d'environnement dans les réglages Vercel :
  ```env
  VITE_API_URL=https://rh-dashboard-api.onrender.com
  ```
- Vercel construira automatiquement l'application Vue 3 et la déploiera sur un domaine gratuit `https://rh-dashboard.vercel.app`.

---

## 🖥️ Option 3 : VPS Dédié (DigitalOcean / Hetzner / OVH)

Pour un contrôle total avec **PM2** et **Nginx** :

1. **Lancer JSON Server en arrière-plan avec PM2 :**
```bash
npm install -g pm2 json-server
pm2 start "json-server --watch db.json --port 3000" --name "rh-api"
pm2 save
```

2. **Compiler le Frontend Vue 3 :**
```bash
npm run build
```

3. **Configurer Nginx pour servir `dist/` et faire un proxy vers l'API :**
```nginx
server {
    listen 80;
    server_name vore-domaine.com;

    location / {
        root /var/www/frontendTask/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /candidatures {
        proxy_pass http://localhost:3000;
    }

    location /statuts {
        proxy_pass http://localhost:3000;
    }
}
```

---

## 📊 Tableau Comparatif

| Plateforme | Frontend (Vue 3) | Backend (JSON Server) | Modifications `db.json` Persistantes | Coût |
| :--- | :--- | :--- | :--- | :--- |
| **Render.com** | ✅ Inclus | ✅ Inclus | ✅ Oui | 🆓 Gratuit |
| **Vercel + Render** | ✅ Ultra-rapide | ✅ Render Web Service | ✅ Oui | 🆓 Gratuit |
| **Railway.app** | ✅ Inclus | ✅ Inclus | ✅ Oui (Volume) | 💲 ~$5/mois |
| **VPS (Nginx + PM2)** | ✅ Sur-mesure | ✅ PM2 Process | ✅ Oui | 💲 ~$4/mois |
