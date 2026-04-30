#!/usr/bin/env bash
# Full-stack deploy for EclecticPickup (run from the repo root on the server):
#
#   1. git pull                    — latest frontend/backend/compose/Dockerfiles
#   2. Prune stopped project containers only (does not touch other sites)
#   3. docker compose build        — rebuild API + nginx frontend images
#   4. docker compose down         — stop current stack (--remove-orphans)
#   5. docker compose run …        — apply Alembic DB migrations (one-off, new image)
#   6. Prune dangling images, BuildKit cache, unused networks (no volume prune)
#   7. docker compose up -d        — start API + app (init_script runs flask db upgrade)
#   Then: show container status + quick HTTP checks (API + app ports).
#
# Disk cleanup does NOT: stop other running containers, run docker volume prune, or remove
# tagged images still referenced by any container.
#
# ---------------------------------------------------------------------------
# WHERE YOUR DATA LIVES (Admin UI content is in these — they are NOT reset by this script)
# ---------------------------------------------------------------------------
# • SQLite (settings, gigs, band members, socials, etc.):
#     ./backend/instance/database.db  on the host, bind-mounted into the API container.
#     Survives: docker compose down, rebuild, applyUpdate. Lost only if you delete that
#     file/dir, clone the repo to a new path without copying instance/, or run on a fresh
#     server without restoring a backup.
# • Uploaded images (band pictures, member photos, etc.):
#     Docker named volume "ep_files" → /home/appuser/app/files inside the API container.
#     Survives normal down/up. DO NOT run:  docker compose down -v
#     Renaming the repo directory can change COMPOSE_PROJECT_NAME and create a NEW empty
#     ep_files volume — keep one stable project name/path, or set COMPOSE_PROJECT_NAME.
# • Back up before risky operations, e.g.:
#     cp -a backend/instance/database.db ~/backup/ep-database-$(date +%F).db
#     docker run --rm -v eclecticpickup_ep_files:/v -v ~/backup:/out alpine tar czf /out/ep-files-$(date +%F).tgz -C /v .
#   (Replace volume name: docker volume ls | grep ep_files)
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ -n "${COMPOSE_PROJECT_NAME:-}" ]]; then
  PROJECT_NAME="$(printf '%s' "$COMPOSE_PROJECT_NAME" | tr '[:upper:]' '[:lower:]')"
else
  PROJECT_NAME="$(basename "$SCRIPT_DIR" | tr '[:upper:]' '[:lower:]')"
fi
export COMPOSE_PROJECT_NAME="$PROJECT_NAME"

echo "==> [1/9] git pull"
git pull

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
else
  DC=(docker-compose)
fi

echo "==> [2/9] Prune stopped containers for compose project '${PROJECT_NAME}' only"
docker container prune -f --filter "label=com.docker.compose.project=${PROJECT_NAME}" || true

echo "==> [3/9] Build images (backend API + frontend static bundle in nginx image)"
"${DC[@]}" build

echo "==> [4/9] Stop stack"
"${DC[@]}" down --remove-orphans

echo "==> [5/9] Apply database migrations (Flask-Migrate / Alembic)"
# One-off container from the newly built API image; uses compose env_file + instance volume.
# Requires backend/.backend.env (from install.sh). Idempotent if already at head.
if [[ ! -f ./backend/.backend.env ]]; then
  echo "WARNING: backend/.backend.env missing — migration step may fail. Create it with install.sh or copy from backup."
fi
"${DC[@]}" run --rm --no-deps api flask db upgrade

echo "==> [6/9] Prune dangling Docker images"
docker image prune -f

echo "==> [7/9] Prune BuildKit build cache (host-wide unused cache only)"
if docker buildx version >/dev/null 2>&1; then
  docker buildx prune -f
else
  docker builder prune -f
fi

echo "==> [8/9] Prune unused Docker networks"
docker network prune -f

echo "==> [9/9] Start stack"
"${DC[@]}" up -d

echo "==> Status and health"
"${DC[@]}" ps

API_PORT="${API_HEALTH_PORT:-8081}"
APP_PORT="${APP_HEALTH_PORT:-3001}"
if curl -sf --max-time 5 "http://127.0.0.1:${API_PORT}/" >/dev/null; then
  echo "OK: API responded on http://127.0.0.1:${API_PORT}/"
else
  echo "NOTE: API check failed or not ready yet (http://127.0.0.1:${API_PORT}/). Inspect logs: ${DC[*]} logs api"
fi
if curl -sf --max-time 5 "http://127.0.0.1:${APP_PORT}/" >/dev/null; then
  echo "OK: App responded on http://127.0.0.1:${APP_PORT}/"
else
  echo "NOTE: App check failed or not ready yet (http://127.0.0.1:${APP_PORT}/). Inspect logs: ${DC[*]} logs app"
fi

echo "Done. Tail logs: ${DC[*]} logs -f api app"
