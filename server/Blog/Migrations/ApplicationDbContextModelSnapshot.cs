﻿// <auto-generated />
using System;
using Blog.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Blog.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.9")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Blog.Entities.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid")
                        .HasColumnName("owner_id");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uuid")
                        .HasColumnName("post_id");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("PostId");

                    b.ToTable("comment");
                });

            modelBuilder.Entity("Blog.Entities.LikeComment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<Guid>("CommentId")
                        .HasColumnType("uuid")
                        .HasColumnName("comment_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("CommentId");

                    b.HasIndex("UserId");

                    b.ToTable("like_comment");
                });

            modelBuilder.Entity("Blog.Entities.LikePost", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uuid")
                        .HasColumnName("post_id");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("like_post");
                });

            modelBuilder.Entity("Blog.Entities.Post", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid")
                        .HasColumnName("owner_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("post");
                });

            modelBuilder.Entity("Blog.Entities.PostTag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uuid")
                        .HasColumnName("post_id");

                    b.Property<Guid>("TagId")
                        .HasColumnType("uuid")
                        .HasColumnName("tag_id");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.HasIndex("TagId");

                    b.ToTable("post_tag");
                });

            modelBuilder.Entity("Blog.Entities.Tag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.HasKey("Id");

                    b.ToTable("tags");

                    b.HasData(
                        new
                        {
                            Id = new Guid("0e985f5e-30ff-45c3-9642-a6510f5e9bcd"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3516),
                            Name = "programming",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3518)
                        },
                        new
                        {
                            Id = new Guid("9880df7a-8608-439f-ab09-1e1087383d30"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3521),
                            Name = "c#",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3521)
                        },
                        new
                        {
                            Id = new Guid("3cce05dc-5325-45cb-a77b-067d1fdd13e3"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3523),
                            Name = "sql",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3523)
                        },
                        new
                        {
                            Id = new Guid("05d45f66-4ec8-413c-888b-d8455cefa64c"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3525),
                            Name = "html",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3525)
                        },
                        new
                        {
                            Id = new Guid("d1979a07-c4df-4da1-bb83-b2b68b8243a5"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3527),
                            Name = "css",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3527)
                        },
                        new
                        {
                            Id = new Guid("0919cf2b-7e36-4cd5-abf1-b83be59ab0c6"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3530),
                            Name = "javascript",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3531)
                        },
                        new
                        {
                            Id = new Guid("3153943b-548e-4600-ba7f-ed85a209b7f4"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3532),
                            Name = "python",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3533)
                        },
                        new
                        {
                            Id = new Guid("e55665a4-fd4f-4741-9745-05f9b8b34b85"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3534),
                            Name = "ci/cd",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3534)
                        },
                        new
                        {
                            Id = new Guid("48514c42-25ce-4b9f-b2f0-9e624aeda0fd"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3538),
                            Name = "react",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3539)
                        },
                        new
                        {
                            Id = new Guid("651f398d-6059-4d20-a200-e42c8a5cacd9"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3541),
                            Name = "frontend",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3541)
                        },
                        new
                        {
                            Id = new Guid("6e6d7908-fa7c-40c5-8a50-595c9b52768d"),
                            CreatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3543),
                            Name = "backend",
                            UpdatedAt = new DateTime(2023, 7, 18, 22, 18, 38, 805, DateTimeKind.Utc).AddTicks(3543)
                        });
                });

            modelBuilder.Entity("Blog.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("salt");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.HasKey("Id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("Blog.Entities.UsersInfo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Bio")
                        .HasColumnType("text")
                        .HasColumnName("bio");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .HasColumnType("text")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .HasColumnType("text")
                        .HasColumnName("last_name");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("users_info");
                });

            modelBuilder.Entity("Blog.Entities.Comment", b =>
                {
                    b.HasOne("Blog.Entities.User", "Owner")
                        .WithMany("Comments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Blog.Entities.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Post");
                });

            modelBuilder.Entity("Blog.Entities.LikeComment", b =>
                {
                    b.HasOne("Blog.Entities.Comment", "Comment")
                        .WithMany("Likes")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Blog.Entities.User", "User")
                        .WithMany("LikedComments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Comment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Blog.Entities.LikePost", b =>
                {
                    b.HasOne("Blog.Entities.Post", "Post")
                        .WithMany("Likes")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Blog.Entities.User", "User")
                        .WithMany("LikedPosts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Blog.Entities.Post", b =>
                {
                    b.HasOne("Blog.Entities.User", "Owner")
                        .WithMany("Posts")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Blog.Entities.PostTag", b =>
                {
                    b.HasOne("Blog.Entities.Post", "Post")
                        .WithMany("PostTags")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Blog.Entities.Tag", "Tag")
                        .WithMany("PostTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("Blog.Entities.UsersInfo", b =>
                {
                    b.HasOne("Blog.Entities.User", "User")
                        .WithOne("UsersInfo")
                        .HasForeignKey("Blog.Entities.UsersInfo", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Blog.Entities.Comment", b =>
                {
                    b.Navigation("Likes");
                });

            modelBuilder.Entity("Blog.Entities.Post", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");

                    b.Navigation("PostTags");
                });

            modelBuilder.Entity("Blog.Entities.Tag", b =>
                {
                    b.Navigation("PostTags");
                });

            modelBuilder.Entity("Blog.Entities.User", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("LikedComments");

                    b.Navigation("LikedPosts");

                    b.Navigation("Posts");

                    b.Navigation("UsersInfo");
                });
#pragma warning restore 612, 618
        }
    }
}
