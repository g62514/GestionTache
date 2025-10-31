# Gestion de Tâches Collaboratif

Application web de gestion collaborative de tâches avec interface React et API ASP.NET Core.

## Fonctionnalités

- CRUD complet (Créer, lire, modifier, supprimer)
- Filtres par libellé, utilisateur et statut
- Pagination backend (10 tâches/page)
- Export Excel avec filtres
- Interface responsive

## Technologies

**Backend** : ASP.NET Core 8.0, Entity Framework Core, SQLite, EPPlus  
**Frontend** : React 18, JavaScript ES6+, CSS3

## Prérequis

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)

Vérifiez :
```bash
dotnet --version
node --version
```

## Installation

### Backend
```bash
cd backend
dotnet restore
dotnet run
```

API : http://localhost:5186  
Swagger : http://localhost:5186/swagger

### Frontend (nouveau terminal)
```bash
cd frontend
npm install
npm start
```

Application : http://localhost:3000

## Base de données

**Tables** :
- `taches` : id, libelle, statut (0=En cours, 1=Bloqué, 2=Terminé), utilisateur_id
- `utilisateurs` : id, nom, prenom

La base SQLite (`app.db`) est incluse avec des données de test.

## Structure
```
GestionTaches/
├── backend/
│   ├── Controllers/TachesController.cs
│   ├── Models/
│   ├── Migrations/
│   └── app.db
└── frontend/
    ├── src/
    │   ├── services/api.js
    │   ├── App.js
    │   └── App.css
    └── package.json
```

## Utilisation

- **Ajouter** : Bouton "➕ Ajouter une tâche"
- **Modifier** : Icône ✏️
- **Supprimer** : Icône 🗑️
- **Filtrer** : Icône ▼ ou barre de recherche
- **Exporter** : Icône 📥

## Dépannage

**Backend ne démarre pas** → Vérifiez que le port 5186 est libre  
**Frontend ne charge pas** → Vérifiez que l'API tourne sur localhost:5186  
**Port 3000 occupé** → Fermez l'app qui l'utilise

## Recréer la base
```bash
cd backend
rm app.db
dotnet ef database update
```