using System.Text.Json.Serialization;

public class Utilisateur
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public string Prenom { get; set; }

    [JsonIgnore]
    public List<Tache>? Taches { get; set; }
}