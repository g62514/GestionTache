namespace backend.Models
{
    /// <summary>
    /// Représente un résultat paginé générique
    /// </summary>
    /// <typeparam name="T">Type des éléments de la liste</typeparam>
    public class PaginatedResult<T>
    {
        /// <summary>
        /// Liste des éléments de la page courante
        /// </summary>
        public List<T> Data { get; set; } = new List<T>();

        /// <summary>
        /// Nombre total d'éléments (toutes pages confondues)
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// Numéro de la page courante
        /// </summary>   
        public int Page { get; set; }

        /// <summary>
        /// Nombre d'éléments par page
        /// </summary>   
        public int PageSize { get; set; }

        /// <summary>
        /// Nombre total de pages
        /// </summary>        
        public int TotalPages { get; set; }
    }
}