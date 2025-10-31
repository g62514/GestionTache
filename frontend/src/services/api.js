const API_URL = 'http://localhost:5186/api';

/**
 * Récupère la liste paginée des tâches avec filtres optionnels
 * @param {Object} filters - Filtres à appliquer
 * @param {string} [filters.libelle] - Filtre sur le libellé de la tâche
 * @param {number} [filters.utilisateurId] - Filtre sur l'utilisateur assigné
 * @param {number} [filters.statut] - Filtre sur le statut (0: En cours, 1: Bloqué, 2: Terminé)
 * @param {number} [filters.page=1] - Numéro de page
 * @param {number} [filters.pageSize=10] - Nombre d'éléments par page
 * @returns {Promise<Object>} Résultat paginé contenant les tâches
*/
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

/**
 * Récupère une tâche par son identifiant
 * @param {number} id - Identifiant de la tâche
 * @returns {Promise<Object>} Les données de la tâche
*/
export const getTache = async (id) => {
  const response = await fetch(`${API_URL}/Taches/${id}`);
  return response.json();
};

/**
 * Crée une nouvelle tâche
 * @param {Object} tache - Données de la tâche à créer
 * @param {string} tache.libelle - Libellé de la tâche
 * @param {number} tache.statut - Statut de la tâche (0, 1 ou 2)
 * @param {number|null} [tache.utilisateurId] - ID de l'utilisateur assigné
 * @returns {Promise<Object>} La tâche créée
*/
export const createTache = async (tache) => {
  const response = await fetch(`${API_URL}/Taches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tache)
  });
  return response.json();
};

/**
 * Met à jour une tâche existante
 * @param {number} id - Identifiant de la tâche
 * @param {Object} tache - Nouvelles données de la tâche
 * @returns {Promise<Response>} Réponse HTTP
*/
export const updateTache = async (id, tache) => {
  const response = await fetch(`${API_URL}/Taches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tache)
  });
  return response;
};

/**
 * Supprime une tâche
 * @param {number} id - Identifiant de la tâche à supprimer
 * @returns {Promise<Response>} Réponse HTTP
*/
export const deleteTache = async (id) => {
  const response = await fetch(`${API_URL}/Taches/${id}`, {
    method: 'DELETE'
  });
  return response;
};

/**
 * Exporte les tâches filtrées dans un fichier Excel
 * @param {Object} filters - Filtres à appliquer
 * @param {string} [filters.libelle] - Filtre sur le libellé
 * @param {number} [filters.utilisateurId] - Filtre sur l'utilisateur
 * @param {number} [filters.statut] - Filtre sur le statut
*/
export const exportToExcel = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.libelle) params.append('libelle', filters.libelle);
  if (filters.utilisateurId) params.append('utilisateurId', filters.utilisateurId);
  if (filters.statut !== undefined && filters.statut !== '') params.append('statut', filters.statut);

  window.open(`${API_URL}/Taches/export?${params}`, '_blank');
};

/**
 * Récupère la liste de tous les utilisateurs
 * @returns {Promise<Array<Object>>} Liste des utilisateurs
 * @throws {Error} Si la requête échoue
*/
export const getUtilisateurs = async () => {
  const response = await fetch(`${API_URL}/Taches/users`);  // ← Manque "Taches"
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};