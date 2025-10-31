public class Tache
{
    public int Id { get; set; }
    public string Libelle { get; set; }
    public int Statut { get; set; }
    
    
    public int? UtilisateurId { get; set; }  
    public Utilisateur? Utilisateur { get; set; }
}