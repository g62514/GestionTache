import React, { useState, useEffect } from 'react';
import { getTaches, createTache, updateTache, deleteTache, exportToExcel, getUtilisateurs } from './services/api';
import './App.css';
import './Modal.css';

function App() {
  const [taches, setTaches] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filtres, setFiltres] = useState({
    libelle: '',
    utilisateurId: '',
    statut: '',
    page: 1,
    pageSize: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTache, setEditingTache] = useState(null);
  const [formData, setFormData] = useState({
    libelle: '',
    statut: 0,
    utilisateurId: null
  });

  const [confirmDialog, setConfirmDialog] = useState(null);

  /**
   * Charge la liste des utilisateurs depuis l'API
  */ 
  const chargerUtilisateurs = async () => {
    try {
      const data = await getUtilisateurs();
      setUtilisateurs(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des utilisateurs');
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  /**
   * Charge la liste paginée des tâches selon les filtres actifs
  */
  const chargerTaches = async () => {
    setLoading(true);
    try {
      const data = await getTaches(filtres);
      setTaches(data.data);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des tâches');
    }
    setLoading(false);
  };

  useEffect(() => {
    chargerTaches();
  }, [filtres]);

  /**
   * Gère le changement des filtres
   * @param {Event} e - Événement de changement
   */  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltres({ ...filtres, [name]: value, page: 1 });
  };

  /**
   * Réinitialise les filtres utilisateur et statut
   */  
  const reinitialiserFiltres = () => {
    setFiltres({
      ...filtres,
      utilisateurId: '',
      statut: '',
      page: 1
    });
    setShowFilterModal(false);
  };

  /**
   * Change la page active
   * @param {number} newPage - Numéro de la nouvelle page
   */
  const changerPage = (newPage) => {
    setFiltres({ ...filtres, page: newPage });
  };

  /**
   * Ouvre la modal pour ajouter une nouvelle tâche
   */
  const ouvrirModalAjout = () => {
    setEditingTache(null);
    setFormData({ libelle: '', statut: 0, utilisateurId: null });
    setShowModal(true);
  };

  /**
   * Ouvre la modal pour modifier une tâche existante
   * @param {Object} tache - Tâche à modifier
   */
  const ouvrirModalModif = (tache) => {
    setEditingTache(tache);
    setFormData({
      libelle: tache.libelle,
      statut: tache.statut,
      utilisateurId: tache.utilisateurId
    });
    setShowModal(true);
  };

  /**
   * Gère la soumission du formulaire d'ajout/modification
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTache) {
        await updateTache(editingTache.id, { id: editingTache.id, ...formData });
        alert('Tâche modifiée avec succès !');
      } else {
        await createTache(formData);
        alert('Tâche créée avec succès !');
      }
      setShowModal(false);
      chargerTaches();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  /**
   * Affiche la modal de confirmation avant suppression
   * @param {number} id - Identifiant de la tâche à supprimer
   */
  const supprimerTache = (id) => {
    setConfirmDialog({
      message: 'Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await deleteTache(id);
          alert('Tâche supprimée avec succès !');
          chargerTaches();
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de la suppression');
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  /**
   * Lance l'export Excel des tâches filtrées
   */
  const handleExport = () => {
    exportToExcel(filtres);
  };

  return (
    <div className="App">
      
      {confirmDialog && (
        <div className="confirm-modal-overlay" onClick={confirmDialog.onCancel}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">⚠️</div>
            <h3>Supprimer la tâche ?</h3>
            <p>{confirmDialog.message}</p>
            <div className="confirm-modal-buttons">
              <button className="confirm-cancel" onClick={confirmDialog.onCancel}>
                Annuler
              </button>
              <button className="confirm-delete" onClick={confirmDialog.onConfirm}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilterModal && (
        <div 
          className="filter-backdrop" 
          onClick={() => setShowFilterModal(false)}
        ></div>
      )}

      <header className="App-header">
        <h1>📋 Gestion des Tâches</h1>
      </header>

      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            name="libelle"
            placeholder="Rechercher sur le libellé"
            value={filtres.libelle}
            onChange={handleFilterChange}
          />
          
          <div className="filter-container">
            <button 
              className="btn-filter" 
              onClick={() => setShowFilterModal(!showFilterModal)} 
              title="Filtres"
            >
              ▼
            </button>
            
            {showFilterModal && (
              <div className="filter-dropdown">
                <h3>Filtres</h3>
                
                <label className="filter-label">
                  Attribution
                  <select 
                    name="utilisateurId" 
                    value={filtres.utilisateurId} 
                    onChange={handleFilterChange}
                  >
                    <option value="">Veuillez sélectionner un utilisateur</option>
                    {utilisateurs.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="filter-label">
                  Statut
                  <select 
                    name="statut" 
                    value={filtres.statut} 
                    onChange={handleFilterChange}
                  >
                    <option value="">Veuillez sélectionner un statut</option>
                    <option value="0">En cours</option>
                    <option value="1">Bloqué</option>
                    <option value="2">Terminé</option>
                  </select>
                </label>

                <button className="btn-reinitialiser" onClick={reinitialiserFiltres}>
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
          
          <button className="btn-excel" onClick={handleExport} title="Exporter Excel">
            📥
          </button>
        </div>

        <div className="actions">
          <button onClick={ouvrirModalAjout}>➕ Ajouter une tâche</button>
          <span className="count">Total : {totalCount} tâche(s)</span>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Libellé</th>
                <th>Utilisateur</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taches.length === 0 ? (
                <tr><td colSpan="4">Aucune tâche trouvée</td></tr>
              ) : (
                taches.map(tache => (
                  <tr key={tache.id}>
                    <td>{tache.libelle}</td>
                    <td>{tache.utilisateur ? `${tache.utilisateur.prenom} ${tache.utilisateur.nom}` : '-'}</td>
                    <td>
                      <span className={`badge badge-${tache.statut}`}>
                        {tache.statut === 0 ? 'En cours' : tache.statut === 1 ? 'Bloqué' : 'Terminé'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => ouvrirModalModif(tache)}>✏️</button>
                      <button onClick={() => supprimerTache(tache.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => changerPage(filtres.page - 1)} 
              disabled={filtres.page === 1}
            >
              ← Précédent
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={filtres.page === i + 1 ? 'active' : ''}
                onClick={() => changerPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => changerPage(filtres.page + 1)} 
              disabled={filtres.page === totalPages}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTache ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Libellé de la tâche *
                <input
                  type="text"
                  value={formData.libelle}
                  onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                  required
                />
              </label>
              <label>
                Utilisateur
                <select
                  value={formData.utilisateurId || ''}
                  onChange={(e) => setFormData({ ...formData, utilisateurId: e.target.value ? parseInt(e.target.value) : null })}
                >
                  <option value="">Non attribué</option>
                  {utilisateurs.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Statut
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: parseInt(e.target.value) })}
                >
                  <option value="0">En cours</option>
                  <option value="1">Bloqué</option>
                  <option value="2">Terminé</option>
                </select>
              </label>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;