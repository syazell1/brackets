#!/usr/bin/env bash

set -x
set -eo pipefail

if ! [ -x "$(command -v sqlx)" ]; then
    echo >&2 "Error: sqlx is not installed."
    echo >&2 "Use:"
    echo >&2 " cargo install --version=0.5.7 sqlx-cli --no-default-features --features postgres"
    echo >&2 "to install it."
    exit 1 
fi

if [[ -z "${SKIP_DOCKER}" ]] 
then
    docker compose -f docker-compose.yml up -d --build
fi

sqlx database create
sqlx migrate run