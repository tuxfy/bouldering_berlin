#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE="${IMAGE:-ai-agents}"
WORKSPACE_DIR="$(cd "${WORKSPACE_DIR:-$PWD}" && pwd -P)"
HOME_VOLUME="${HOME_VOLUME:-ai-agents}"

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
  "$IMAGE"
