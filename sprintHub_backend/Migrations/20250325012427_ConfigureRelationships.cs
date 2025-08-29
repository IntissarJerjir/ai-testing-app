using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sprintHub.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTaskUser_Tasks_TasksId",
                table: "ProjectTaskUser");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTaskUser_Users_AssigneesId",
                table: "ProjectTaskUser");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUser_Projects_ProjectsId",
                table: "ProjectUser");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUser_Users_TeamId",
                table: "ProjectUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectUser",
                table: "ProjectUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectTaskUser",
                table: "ProjectTaskUser");

            migrationBuilder.RenameTable(
                name: "ProjectUser",
                newName: "ProjectTeams");

            migrationBuilder.RenameTable(
                name: "ProjectTaskUser",
                newName: "TaskAssignments");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectUser_TeamId",
                table: "ProjectTeams",
                newName: "IX_ProjectTeams_TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTaskUser_TasksId",
                table: "TaskAssignments",
                newName: "IX_TaskAssignments_TasksId");

            migrationBuilder.AlterColumn<string>(
                name: "Labels",
                table: "Tasks",
                type: "text",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectTeams",
                table: "ProjectTeams",
                columns: new[] { "ProjectsId", "TeamId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskAssignments",
                table: "TaskAssignments",
                columns: new[] { "AssigneesId", "TasksId" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_Priority",
                table: "Tasks",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_Status",
                table: "Tasks",
                column: "Status");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_Priority",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_Status",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskAssignments",
                table: "TaskAssignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectTeams",
                table: "ProjectTeams");

            migrationBuilder.RenameTable(
                name: "TaskAssignments",
                newName: "ProjectTaskUser");

            migrationBuilder.RenameTable(
                name: "ProjectTeams",
                newName: "ProjectUser");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignments_TasksId",
                table: "ProjectTaskUser",
                newName: "IX_ProjectTaskUser_TasksId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTeams_TeamId",
                table: "ProjectUser",
                newName: "IX_ProjectUser_TeamId");

            migrationBuilder.AlterColumn<List<string>>(
                name: "Labels",
                table: "Tasks",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectTaskUser",
                table: "ProjectTaskUser",
                columns: new[] { "AssigneesId", "TasksId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectUser",
                table: "ProjectUser",
                columns: new[] { "ProjectsId", "TeamId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTaskUser_Tasks_TasksId",
                table: "ProjectTaskUser",
                column: "TasksId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTaskUser_Users_AssigneesId",
                table: "ProjectTaskUser",
                column: "AssigneesId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectUser_Projects_ProjectsId",
                table: "ProjectUser",
                column: "ProjectsId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectUser_Users_TeamId",
                table: "ProjectUser",
                column: "TeamId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
