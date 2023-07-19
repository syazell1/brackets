using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Blog.Migrations
{
    /// <inheritdoc />
    public partial class AddLikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("0b879c56-205d-488f-9fbf-11f5770e40e5"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("2210856d-57c9-46f6-b161-55f458e4b3fe"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("38f0acc1-2f37-4efd-a514-7cf7cb5f210c"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("751725cf-c32b-408b-bbec-8e5bc29bf99c"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("7d3a5a0f-20ef-4341-a732-9cc3b99119a8"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("8a2790bb-96b0-4830-9d29-526b3aa73811"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("9cfae79f-c8af-4f2d-b982-d11f370b87de"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("c16731db-b29e-4302-b655-3e7c7b132d12"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("dc40283f-b295-4947-bd70-089222737c11"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("df7f19b4-11d5-4ed8-89f4-1082a12a635a"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("ebd23296-b33a-472d-9156-a8a9fb12c68a"));

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Salt",
                table: "users",
                newName: "salt");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "users",
                newName: "password");

            migrationBuilder.CreateTable(
                name: "like_comment",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    comment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_like_comment", x => x.id);
                    table.ForeignKey(
                        name: "FK_like_comment_comment_comment_id",
                        column: x => x.comment_id,
                        principalTable: "comment",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_like_comment_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "like_post",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    post_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_like_post", x => x.id);
                    table.ForeignKey(
                        name: "FK_like_post_post_post_id",
                        column: x => x.post_id,
                        principalTable: "post",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_like_post_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "tags",
                columns: new[] { "id", "created_at", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("05d45f66-4ec8-413c-888b-d8455cefa64c"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3525), "html", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3525) },
                    { new Guid("0919cf2b-7e36-4cd5-abf1-b83be59ab0c6"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3530), "javascript", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3531) },
                    { new Guid("0e985f5e-30ff-45c3-9642-a6510f5e9bcd"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3516), "programming", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3518) },
                    { new Guid("3153943b-548e-4600-ba7f-ed85a209b7f4"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3532), "python", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3533) },
                    { new Guid("3cce05dc-5325-45cb-a77b-067d1fdd13e3"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3523), "sql", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3523) },
                    { new Guid("48514c42-25ce-4b9f-b2f0-9e624aeda0fd"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3538), "react", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3539) },
                    { new Guid("651f398d-6059-4d20-a200-e42c8a5cacd9"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3541), "frontend", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3541) },
                    { new Guid("6e6d7908-fa7c-40c5-8a50-595c9b52768d"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3543), "backend", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3543) },
                    { new Guid("9880df7a-8608-439f-ab09-1e1087383d30"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3521), "c#", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3521) },
                    { new Guid("d1979a07-c4df-4da1-bb83-b2b68b8243a5"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3527), "css", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3527) },
                    { new Guid("e55665a4-fd4f-4741-9745-05f9b8b34b85"), new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3534), "ci/cd", new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3534) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_like_comment_comment_id",
                table: "like_comment",
                column: "comment_id");

            migrationBuilder.CreateIndex(
                name: "IX_like_comment_user_id",
                table: "like_comment",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_like_post_post_id",
                table: "like_post",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_like_post_user_id",
                table: "like_post",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "like_comment");

            migrationBuilder.DropTable(
                name: "like_post");

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("05d45f66-4ec8-413c-888b-d8455cefa64c"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("0919cf2b-7e36-4cd5-abf1-b83be59ab0c6"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("0e985f5e-30ff-45c3-9642-a6510f5e9bcd"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("3153943b-548e-4600-ba7f-ed85a209b7f4"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("3cce05dc-5325-45cb-a77b-067d1fdd13e3"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("48514c42-25ce-4b9f-b2f0-9e624aeda0fd"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("651f398d-6059-4d20-a200-e42c8a5cacd9"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("6e6d7908-fa7c-40c5-8a50-595c9b52768d"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("9880df7a-8608-439f-ab09-1e1087383d30"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("d1979a07-c4df-4da1-bb83-b2b68b8243a5"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "id",
                keyValue: new Guid("e55665a4-fd4f-4741-9745-05f9b8b34b85"));

            migrationBuilder.RenameColumn(
                name: "username",
                table: "users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "salt",
                table: "users",
                newName: "Salt");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "users",
                newName: "Password");

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
        }
    }
}
