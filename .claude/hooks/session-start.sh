#!/usr/bin/env bash
# SessionStart hook: authenticate the Azure CLI as a least-privilege service
# principal inside ephemeral Claude Code cloud-container sessions (Claude Code
# on the web, incl. iPad/iPhone).
#
# Design notes:
#   - Runs ONLY in remote/cloud sessions ($CLAUDE_CODE_REMOTE == "true").
#     Local sessions are skipped: `az login` state already persists on disk
#     locally, so re-authenticating there is unnecessary.
#   - Skips gracefully (exit 0, no error) if the service-principal secrets
#     are not present in the environment.
#   - Installs the Azure CLI via the official apt-based installer if missing
#     (the cloud container is Ubuntu).
#   - Never echoes any secret value.

set -euo pipefail

# 1. Only run in remote (cloud-container) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  echo "session-start: local session detected, skipping Azure service-principal login."
  exit 0
fi

# 2. Require the service-principal credentials; skip gracefully if any are missing.
if [ -z "${AZURE_CLIENT_ID:-}" ] || [ -z "${AZURE_CLIENT_SECRET:-}" ] || [ -z "${AZURE_TENANT_ID:-}" ]; then
  echo "session-start: Azure service-principal secrets not set, skipping Azure login."
  exit 0
fi

# 3. Install the Azure CLI if it is not already available (Ubuntu/apt container).
if ! command -v az >/dev/null 2>&1; then
  echo "session-start: Azure CLI not found, installing (apt-based)..."
  if ! curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash >/dev/null 2>&1; then
    echo "session-start: Azure CLI install failed; skipping Azure login." >&2
    exit 0
  fi
fi

# 4. Log in as the service principal. --output none suppresses any token/output.
#    The secret is passed by reference ($AZURE_CLIENT_SECRET); it is never printed.
echo "session-start: authenticating to Azure as service principal..."
az login --service-principal \
  -u "$AZURE_CLIENT_ID" \
  -p "$AZURE_CLIENT_SECRET" \
  --tenant "$AZURE_TENANT_ID" \
  --output none

# 5. Optionally pin the active subscription.
if [ -n "${AZURE_SUBSCRIPTION_ID:-}" ]; then
  az account set --subscription "$AZURE_SUBSCRIPTION_ID"
  echo "session-start: active subscription set."
fi

echo "session-start: Azure CLI authenticated successfully."
