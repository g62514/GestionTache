using System.Text.Json.Serialization;

namespace backend.Models
{
    /// <summary>
    /// Représente un utilisateur dans le système.
    /// </summary>
    public class Utilisateur
    {
        /// <summary>
        /// Identifiant unique de l'utilisateur
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nom de famille de l'utilisateur
        /// </summary>
        public string Nom { get; set; }
        /// <summary>
        /// Prénom de l'utilisateur
        /// </summary>
        public string Prenom { get; set; }

        /// <summary>
        /// Liste des tâches attribuées à cet utilisateur
        /// (Ignoré lors de la sérialisation JSON pour éviter les références circulaires)
        /// </summary>
        [JsonIgnore]
        public List<Tache>? Taches { get; set; }
    }
}