#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY ["server/Blog/Blog.csproj", "server/Blog/"]
COPY ["server/Blog.API/Blog.API.csproj", "server/Blog.API/"]
RUN dotnet restore "server/Blog.API/Blog.API.csproj"
COPY . .
WORKDIR "/src/server/Blog.API"
RUN dotnet build "Blog.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Blog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Blog.API.dll"]


EXPOSE 3000
ENV ASPNETCORE_URLS=http://*:3000