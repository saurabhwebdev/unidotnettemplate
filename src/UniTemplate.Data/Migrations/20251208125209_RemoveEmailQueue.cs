using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniTemplate.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEmailQueue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailQueue");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailQueue",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    EmailType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    FailedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsHtml = table.Column<bool>(type: "bit", nullable: false),
                    MaxRetries = table.Column<int>(type: "int", nullable: false),
                    RetryCount = table.Column<int>(type: "int", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ToEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ToName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TriggeredByUserEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    TriggeredByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailQueue", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_CreatedAt",
                table: "EmailQueue",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_EmailType",
                table: "EmailQueue",
                column: "EmailType");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_ScheduledAt",
                table: "EmailQueue",
                column: "ScheduledAt");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_Status",
                table: "EmailQueue",
                column: "Status");
        }
    }
}
