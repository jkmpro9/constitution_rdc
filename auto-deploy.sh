#!/bin/bash
# Auto-deploy: watch GitHub pour nouveaux commits, rebuild Docker sur Easypanel
# S'exécute depuis le VPS 2

REPO_DIR="/etc/easypanel/projects/apps/constitution_rdc/code"

cd "$REPO_DIR" || { echo "REPO_DIR introuvable"; exit 1; }

# Pull les changements
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "$(date): Nouveau commit détecté — déploiement..."
  git pull origin main
  # Rebuild Docker via Easypanel (le même que le bouton Deploy)
  easypanel deploy constitution_rdc 2>&1 || echo "easypanel CLI failed, essayant docker directement..."
  # Fallback: rebuild Docker manuellement
  docker buildx build --network host -f "$REPO_DIR/Dockerfile" -t easypanel/apps/constitution_rdc --label keep=true "$REPO_DIR" 2>&1 && \
  docker service update --force easypanel_apps_constitution_rdc 2>&1
  echo "$(date): Déploiement terminé"
else
  echo "$(date): Aucun changement"
fi
