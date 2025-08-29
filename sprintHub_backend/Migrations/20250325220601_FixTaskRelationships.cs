using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sprintHub.Migrations
{
    /// <inheritdoc />
    public partial class FixTaskRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeams_Projects_ProjectsId",
                table: "ProjectTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeams_Users_TeamId",
                table: "ProjectTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Tasks_TasksId",
                table: "TaskAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Users_AssigneesId",
                table: "TaskAssignments");

            migrationBuilder.RenameColumn(
                name: "TasksId",
                table: "TaskAssignments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "AssigneesId",
                table: "TaskAssignments",
                newName: "TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignments_TasksId",
                table: "TaskAssignments",
                newName: "IX_TaskAssignments_UserId");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "ProjectTeams",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "ProjectsId",
                table: "ProjectTeams",
                newName: "ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTeams_TeamId",
                table: "ProjectTeams",
                newName: "IX_ProjectTeams_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeams_Projects_ProjectId",
                table: "ProjectTeams",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeams_Users_UserId",
                table: "ProjectTeams",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Tasks_TaskId",
                table: "TaskAssignments",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Users_UserId",
                table: "TaskAssignments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeams_Projects_ProjectId",
                table: "ProjectTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeams_Users_UserId",
                table: "ProjectTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Tasks_TaskId",
                table: "TaskAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Users_UserId",
                table: "TaskAssignments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TaskAssignments",
                newName: "TasksId");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "TaskAssignments",
                newName: "AssigneesId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignments_UserId",
                table: "TaskAssignments",
                newName: "IX_TaskAssignments_TasksId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ProjectTeams",
                newName: "TeamId");

            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "ProjectTeams",
                newName: "ProjectsId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTeams_UserId",
                table: "ProjectTeams",
                newName: "IX_ProjectTeams_TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeams_Projects_ProjectsId",
                table: "ProjectTeams",
                column: "ProjectsId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeams_Users_TeamId",
                table: "ProjectTeams",
                column: "TeamId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Tasks_TasksId",
                table: "TaskAssignments",
                column: "TasksId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Users_AssigneesId",
                table: "TaskAssignments",
                column: "AssigneesId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
