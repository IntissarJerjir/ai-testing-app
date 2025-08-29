using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sprintHub.Migrations
{
    /// <inheritdoc />
    public partial class updateUserKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Tasks_ProjectTaskId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ProjectTaskId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProjectTaskId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "ProjectTaskUser",
                columns: table => new
                {
                    AssigneesId = table.Column<int>(type: "integer", nullable: false),
                    TasksId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTaskUser", x => new { x.AssigneesId, x.TasksId });
                    table.ForeignKey(
                        name: "FK_ProjectTaskUser_Tasks_TasksId",
                        column: x => x.TasksId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTaskUser_Users_AssigneesId",
                        column: x => x.AssigneesId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTaskUser_TasksId",
                table: "ProjectTaskUser",
                column: "TasksId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTaskUser");

            migrationBuilder.AddColumn<int>(
                name: "ProjectTaskId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ProjectTaskId",
                table: "Users",
                column: "ProjectTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Tasks_ProjectTaskId",
                table: "Users",
                column: "ProjectTaskId",
                principalTable: "Tasks",
                principalColumn: "Id");
        }
    }
}
