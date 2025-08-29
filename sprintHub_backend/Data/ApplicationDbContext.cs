using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using sprintHub.Models;

namespace sprintHub.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Team)
                .WithMany(u => u.Projects)
                 .UsingEntity<Dictionary<string, object>>(
                    "ProjectTeams",
                    j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                    j => j.HasOne<Project>().WithMany().HasForeignKey("ProjectId"),
                    j => j.HasKey("ProjectId", "UserId")
                );

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<ProjectTask>()
                        .HasMany(t => t.Assignees)
                        .WithMany(u => u.Tasks)
                        .UsingEntity<Dictionary<string, object>>(
                            "TaskAssignments",
                            j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                            j => j.HasOne<ProjectTask>().WithMany().HasForeignKey("TaskId"),
                            j => j.HasKey("TaskId", "UserId")
                        );


            modelBuilder.Entity<ProjectTask>()
                .Property(e => e.Labels)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );

            modelBuilder.Entity<ProjectTask>()
                .HasIndex(t => t.Status);

            modelBuilder.Entity<ProjectTask>()
                .HasIndex(t => t.Priority);

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }
        public DbSet<TestCase> TestCases { get; set; }





    }
}
