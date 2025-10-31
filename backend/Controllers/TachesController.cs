using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TachesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TachesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Tache>>> GetTaches(
            [FromQuery] string? libelle,
            [FromQuery] int? utilisateurId,
            [FromQuery] int? statut,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // Commence par toutes les tâches
            var query = _context.Taches.Include(t => t.Utilisateur).AsQueryable();
            query = ApplyFilters(query, libelle, utilisateurId, statut);

            // Compte total (AVANT pagination)
            var totalCount = await query.CountAsync();

            // Pagination
            var taches = await query
                .Skip((page - 1) * pageSize)  // Saute les pages précédentes
                .Take(pageSize)                // Prend seulement pageSize éléments
                .ToListAsync();

            // Calcul du nombre total de pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Résultat paginé
            var result = new PaginatedResult<Tache>
            {
                Data = taches,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Ok(result);
        }

    

        // POST: api/taches
        [HttpPost]
        public async Task<ActionResult<Tache>> CreateTache(Tache tache)
        {
            _context.Taches.Add(tache);
            await _context.SaveChangesAsync();

            return Ok(tache);
        }

        // PUT: api/taches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTache(int id, Tache tache)
        {
            if (id != tache.Id)
            {
                return BadRequest();
            }

            _context.Entry(tache).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TacheExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/taches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTache(int id)
        {
            var tache = await _context.Taches.FindAsync(id);
            if (tache == null)
            {
                return NotFound();
            }

            _context.Taches.Remove(tache);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/taches/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportToExcel(
            [FromQuery] string? libelle,
            [FromQuery] int? utilisateurId,
            [FromQuery] int? statut)
        {
            // Applique les mêmes filtres que GetTaches
            var query = _context.Taches.Include(t => t.Utilisateur).AsQueryable();
            query = ApplyFilters(query, libelle, utilisateurId, statut);

            var taches = await query.ToListAsync();



            var package = new OfficeOpenXml.ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Taches");

            // En-têtes
            worksheet.Cells[1, 1].Value = "Libellé de la tâche";
            worksheet.Cells[1, 2].Value = "Attribution";
            worksheet.Cells[1, 3].Value = "Statut";

            // Données
            int row = 2;
            foreach (var tache in taches)
            {
                worksheet.Cells[row, 1].Value = tache.Libelle;
                worksheet.Cells[row, 2].Value = tache.Utilisateur?.Prenom ?? "";

                // Convertir le statut en texte
                worksheet.Cells[row, 3].Value = tache.Statut switch
                {
                    0 => "En cours",
                    1 => "Bloqué",
                    2 => "Terminé",
                    _ => ""
                };

                row++;
            }

            // Auto-ajuster les colonnes
            worksheet.Cells.AutoFitColumns();

            // Nom du fichier avec la date
            var fileName = $"taches_{DateTime.Now:yyyyMMdd}.xlsx";

            // Retourner le fichier
            var stream = new MemoryStream();
            package.SaveAs(stream);
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
        
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<Utilisateur>>> GetUtilisateurs()
        {
            var utilisateurs = await _context.Utilisateurs.ToListAsync();
            return Ok(utilisateurs);
        }


        private bool TacheExists(int id)
        {
            return _context.Taches.Any(t => t.Id == id);
        }



        private IQueryable<Tache> ApplyFilters(
            IQueryable<Tache> query,
            string? libelle,
            int? utilisateurId,
            int? statut)
        {
            if (!string.IsNullOrEmpty(libelle))
                query = query.Where(t => t.Libelle.ToLower().Contains(libelle.ToLower()));

            if (utilisateurId.HasValue)
                query = query.Where(t => t.UtilisateurId == utilisateurId);

            if (statut.HasValue)
                query = query.Where(t => t.Statut == statut);

            return query;
        }
    
    

        
    }
    
    
}