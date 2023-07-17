using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Blog.Migrations
{
    /// <inheritdoc />
    public partial class DbInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Salt = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "post",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_post", x => x.id);
                    table.ForeignKey(
                        name: "FK_post_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users_info",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    last_name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    bio = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_info", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_info_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comment",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    post_id = table.Column<Guid>(type: "uuid", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comment", x => x.id);
                    table.ForeignKey(
                        name: "FK_comment_post_post_id",
                        column: x => x.post_id,
                        principalTable: "post",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comment_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "post_tag",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tag_id = table.Column<Guid>(type: "uuid", nullable: false),
                    post_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_post_tag", x => x.id);
                    table.ForeignKey(
                        name: "FK_post_tag_post_post_id",
                        column: x => x.post_id,
                        principalTable: "post",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_post_tag_tags_tag_id",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "tags",
                columns: new[] { "id", "created_at", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("0b879c56-205d-488f-9fbf-11f5770e40e5"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7170), "ci/cd", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7170) },
                    { new Guid("2210856d-57c9-46f6-b161-55f458e4b3fe"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7176), "frontend", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7176) },
                    { new Guid("38f0acc1-2f37-4efd-a514-7cf7cb5f210c"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7163), "css", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7164) },
                    { new Guid("751725cf-c32b-408b-bbec-8e5bc29bf99c"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7159), "sql", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7160) },
                    { new Guid("7d3a5a0f-20ef-4341-a732-9cc3b99119a8"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7152), "programming", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7155) },
                    { new Guid("8a2790bb-96b0-4830-9d29-526b3aa73811"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7166), "javascript", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7166) },
                    { new Guid("9cfae79f-c8af-4f2d-b982-d11f370b87de"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7178), "backend", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7178) },
                    { new Guid("c16731db-b29e-4302-b655-3e7c7b132d12"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7174), "react", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7174) },
                    { new Guid("dc40283f-b295-4947-bd70-089222737c11"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7157), "c#", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7158) },
                    { new Guid("df7f19b4-11d5-4ed8-89f4-1082a12a635a"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7161), "html", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7162) },
                    { new Guid("ebd23296-b33a-472d-9156-a8a9fb12c68a"), new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7168), "python", new DateTime(2023, 7, 17, 11, 23, 3, 44, DateTimeKind.Utc).AddTicks(7169) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_comment_owner_id",
                table: "comment",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "IX_comment_post_id",
                table: "comment",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_post_owner_id",
                table: "post",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "IX_post_tag_post_id",
                table: "post_tag",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_post_tag_tag_id",
                table: "post_tag",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_info_user_id",
                table: "users_info",
                column: "user_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "comment");

            migrationBuilder.DropTable(
                name: "post_tag");

            migrationBuilder.DropTable(
                name: "users_info");

            migrationBuilder.DropTable(
                name: "post");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
