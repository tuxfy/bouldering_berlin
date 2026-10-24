#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE="${IMAGE:-ai-agents}"
WORKSPACE_DIR="$(cd "${WORKSPACE_DIR:-$PWD}" && pwd -P)"
HOME_VOLUME="${HOME_VOLUME:-ai-agents}"

# GitHub-Token aus dem macOS-Schlüsselbund (nie in Dateien): zuerst projekteigener
# Eintrag "ai-agents-github-<ordnername>", sonst "ai-agents-github". Ohne Eintrag
# läuft der Container ohne Token (Push und Pull Requests gehen dann nicht).
project="$(basename "$WORKSPACE_DIR")"
GH_TOKEN="$(security find-generic-password -s "ai-agents-github-$project" -w 2>/dev/null \
  || security find-generic-password -s ai-agents-github -w 2>/dev/null || true)"
env_args=()
if [ -n "$GH_TOKEN" ]; then
  export GH_TOKEN
  env_args+=(-e GH_TOKEN)   # Wert kommt aus der Umgebung, steht nicht in der Befehlszeile
else
  echo "hinweis: kein GitHub-Token im Schlüsselbund gefunden" >&2
fi

mounts=(
  --mount "type=bind,source=$WORKSPACE_DIR,target=/workspace"
  --mount "type=volume,source=$HOME_VOLUME,target=/home/agent"
  # Projektspeicher von Claude Code (Verläufe, Gedächtnis) nur für diesen Lauf:
  # Alle Projekte liegen unter /workspace und hätten sonst denselben Speicher.
  --mount "type=tmpfs,target=/home/agent/.claude/projects,tmpfs-mode=1777"
  # Container-eigenes node_modules nur für diesen Lauf (anonymes Volume, mit --rm entfernt):
  # schattet das vom Mac-Host gebindmountete Verzeichnis ab, damit linux-native
  # Binaries (Rollup/esbuild/...) genutzt werden. Installiert wird bei jedem Start.
  --mount "type=volume,target=/workspace/node_modules"
)

if [ -f "$WORKSPACE_DIR/config/secrets" ]; then
  mounts+=(
    --mount "type=bind,source=$WORKSPACE_DIR/config/secrets,target=/workspace/config/secrets"
  )
fi

while IFS= read -r -d '' file; do
  filename="$(basename "$file")"
  mounts+=(
    --mount "type=bind,source=/dev/null,target=/workspace/$filename,ro"
  )
done < <(find "$WORKSPACE_DIR" -maxdepth 1 -type f -name '.env*' -print0)

exec docker run --rm -it \
  --network bridge \
  --add-host=host.docker.internal:host-gateway \
  "${mounts[@]}" \
  ${env_args[@]+"${env_args[@]}"} \
  "$IMAGE"
