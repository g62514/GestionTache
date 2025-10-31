namespace backend.Models
{
    /// <summary>
    /// Représente une tâche dans le système
    /// </summary>
    public class Tache
    {
        /// <summary>
        /// Identifiant unique de la tâche
        /// </summary>  
        public int Id { get; set; }

        /// <summary>
        /// Description de la tâche
        /// </summary>
        public string Libelle { get; set; }

        /// <summary>
        /// Statut de la tâche (0: En cours, 1: Bloqué, 2: Terminé)
        /// </summary>
        public int Statut { get; set; }

        /// <summary>
        /// Identifiant de l'utilisateur assigné à la tâche (nullable)
        /// </summary>
        public int? UtilisateurId { get; set; }

        /// <summary>
        /// Utilisateur assigné à cette tâche (relation de navigation)
        /// </summary>
        public Utilisateur? Utilisateur { get; set; }
    }
}