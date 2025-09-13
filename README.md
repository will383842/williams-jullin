# Williams Jullin - Personal Branding Website

Un site web moderne de personal branding construit avec Vite, React, TypeScript, Tailwind CSS et Firebase.

## 🚀 Installation

### Prérequis
- Node.js >= 18
- npm ou yarn
- Compte Firebase avec projet configuré

### Installation des dépendances
```bash
npm install
```

### Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez Firestore Database
3. Activez Firebase Hosting
4. Copiez `.env.example` vers `.env` et remplissez vos variables Firebase :

```bash
cp .env.example .env
```

Éditez `.env` avec vos clés Firebase :
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Configuration Firestore

#### En développement local
```bash
# Démarrer l'émulateur Firestore (optionnel)
npx firebase emulators:start --only firestore
```

#### En production
Déployez les règles de sécurité Firestore :
```bash
# Authentification Firebase CLI
npx firebase login

# Déploiement des règles
firebase deploy --only firestore:rules
```

Les règles permettent :
- ✅ Écriture publique dans la collection `contacts` avec validation
- ❌ Lecture publique interdite (sécurité des données)
- ✅ Validation des champs requis et tailles maximales

## 🛠 Scripts de développement

```bash
# Serveur de développement
npm run dev

# Build de production
npm run build

# Aperçu du build
npm run preview

# Vérification TypeScript
npm run type-check

# Linting
npm run lint

# Tests
npm run test
```

## 🌐 Internationalisation (i18n)

Le site supporte 7 langues :
- 🇬🇧 Anglais (par défaut)
- 🇫🇷 Français
- 🇩🇪 Allemand
- 🇪🇸 Espagnol
- 🇵🇹 Portugais
- 🇷🇺 Russe
- 🇨🇳 Chinois

Les traductions sont dans `src/i18n/locales/`.

## 📱 Navigation SPA

Le site utilise une navigation maison sans react-router. Les routes supportées :
- `/` - Accueil
- `/mon-histoire` - Mon Histoire
- `/blog` - Blog
- `/media` - Médias
- `/contact` - Contact
- `/investors` - Investisseurs

## 🔥 Déploiement Firebase Hosting

### Configuration initiale
```bash
# Installation Firebase CLI
npm install -g firebase-tools

# Connexion à Firebase
firebase login

# Initialisation (si pas déjà fait)
firebase init hosting
```

### Déploiement
```bash
# Build + déploiement
npm run build
firebase deploy --only hosting
```

### Fallback SPA
Le fichier `firebase.json` configure les rewrites pour que tous les chemins retombent sur `index.html`, permettant le refresh sur les deep links.

## 📧 Formulaire de contact

Le formulaire de contact persiste les données dans Firestore :

### Structure des données
```typescript
interface ContactSubmission {
  purpose: string;        // Obligatoire
  fullName: string;       // Obligatoire  
  email: string;          // Obligatoire
  title?: string;         // Optionnel
  message: string;        // Obligatoire
  country?: string;       // Optionnel
  createdAt: Timestamp;   // Auto-généré
}
```

### Extension pour emails
Point d'extension prévu dans `src/services/contactService.ts` pour déclencher l'envoi d'emails via Firebase Cloud Functions.

## 🧪 Tests

Tests configurés avec Vitest :
- Tests unitaires des services
- Tests de rendu des composants
- Tests de validation i18n

```bash
npm run test
```

## 🔧 CI/CD

GitHub Actions configuré dans `.github/workflows/ci.yml` :
- ✅ Type checking
- ✅ Linting  
- ✅ Tests
- ✅ Build
- ✅ Support Node.js 18+ et 20+

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
├── services/           # Services (Firebase, API)
├── lib/               # Configuration (Firebase)
├── i18n/              # Internationalisation
│   └── locales/       # Fichiers de traduction
├── test/              # Configuration des tests
└── utils/             # Utilitaires

public/
├── favicon.ico        # Favicon du site
└── ...

firebase.json          # Configuration Firebase
firestore.rules       # Règles de sécurité Firestore
.env.example          # Template variables d'environnement
```

## 🔒 Sécurité

- Variables d'environnement pour les clés Firebase
- Règles Firestore restrictives
- Validation côté client et serveur
- HTTPS obligatoire en production

## 📞 Support

Pour toute question technique, consultez :
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Vite](https://vitejs.dev)
- [Documentation React](https://react.dev)

---

Développé avec ❤️ par Williams Jullin