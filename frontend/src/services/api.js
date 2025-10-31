const API_URL = 'http://localhost:5186/api';

// Récupérer toutes les tâches avec filtres et pagination
export const getTaches = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.libelle) params.append('libelle', filters.libelle);
  if (filters.utilisateurId) params.append('utilisateurId', filters.utilisateurId);
  if (filters.statut !== undefined && filters.statut !== '') params.append('statut', filters.statut);
  if (filters.page) params.append('page', filters.page);
  if (filters.pageSize) params.append('pageSize', filters.pageSize);

  const response = await fetch(`${API_URL}/Taches?${params}`);
  return response.json();
};

// Récupérer une tâche par ID
export const getTache = async (id) => {
  const response = await fetch(`${API_URL}/Taches/${id}`);
  return response.json();
};

// Créer une nouvelle tâche
export const createTache = async (tache) => {
  const response = await fetch(`${API_URL}/Taches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tache)
  });
  return response.json();
};

// Modifier une tâche
export const updateTache = async (id, tache) => {
  const response = await fetch(`${API_URL}/Taches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tache)
  });
  return response;
};

// Supprimer une tâche
export const deleteTache = async (id) => {
  const response = await fetch(`${API_URL}/Taches/${id}`, {
    method: 'DELETE'
  });
  return response;
};

// Exporter en Excel
export const exportToExcel = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.libelle) params.append('libelle', filters.libelle);
  if (filters.utilisateurId) params.append('utilisateurId', filters.utilisateurId);
  if (filters.statut !== undefined && filters.statut !== '') params.append('statut', filters.statut);

  window.open(`${API_URL}/Taches/export?${params}`, '_blank');
};

// Get all users
export const getUtilisateurs = async () => {
  const response = await fetch(`${API_URL}/Taches/users`);  // ← Manque "Taches"
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};