# MATIÈRE GRISE — Frontend

Interface web pour la plateforme de recherche-création.

Esthétique : **Mounir Fatmi** / Archive / Archéologie  
Noir et blanc strict, typographie comme matière.

---

## Déploiement sur Vercel (5 minutes)

### Étape 1 : Push vers GitHub

1. Va sur **https://github.com/new**
2. Crée un nouveau repository : `matiere-grise-frontend`
3. Dans PowerShell :

```powershell
cd C:\Users\ouali\matiere-grise\matiere-grise-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/matiere-grise-frontend.git
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. Va sur **https://vercel.com**
2. Connecte-toi avec ton compte GitHub
3. Clique **"Add New Project"**
4. Sélectionne `matiere-grise-frontend`
5. Clique **"Deploy"**

Tu obtiendras une URL comme : `https://matiere-grise-frontend.vercel.app`

---

## Configuration de l'API

Dans `MatiereGrise.jsx`, ligne 12, change l'URL de l'API :

```javascript
// Pour le développement local :
const API_URL = 'http://localhost:8000';

// Pour la production (ton tunnel Cloudflare) :
const API_URL = 'https://ton-tunnel.trycloudflare.com';
```

---

## Développement local

```powershell
npm install
npm run dev
```

Ouvre http://localhost:3000

---

## Structure

```
matiere-grise-frontend/
├── app/
│   ├── layout.js      ← Layout HTML
│   └── page.js        ← Page principale
├── MatiereGrise.jsx   ← Composant principal
├── package.json
└── next.config.js
```

---

## Esthétique

- **Typographies** : EB Garamond (texte), JetBrains Mono (labels), Amiri (arabe)
- **Couleurs** : Noir #0A0A0A, Blanc #FAFAFA, Gris #666
- **Principe** : Espace blanc généreux, zéro décoration superflue

---

## Comptes de test

- `pedagogue1@ensp-arles.fr` / `pedagogue12026`
- `chercheur1@recherche.org` / `chercheur12026`
- `admin@matiere-grise.org` / `admin2026`
