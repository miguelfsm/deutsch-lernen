# Azure auth for Claude Code cloud sessions

`session-start.sh` is a **SessionStart** hook (registered in `.claude/settings.json`).
It logs the Azure CLI in as a least-privilege **service principal** so Claude Code
can use Azure from ephemeral cloud-container sessions (Claude Code on the web,
including iPad/iPhone).

## Behavior

- Runs **only** in remote sessions (`CLAUDE_CODE_REMOTE=true`). Local sessions are
  skipped because local `az login` state already persists on disk.
- Skips gracefully if the service-principal secrets are not set.
- Installs the Azure CLI (apt-based) if it is missing in the container.
- Never echoes any secret value.

## Required environment secrets

Set these in Claude Code's environment/secrets config (NOT in the repo):

| Variable                  | Source                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `AZURE_CLIENT_ID`         | `appId` from `az ad sp create-for-rbac`                       |
| `AZURE_CLIENT_SECRET`     | `password` from `az ad sp create-for-rbac`                   |
| `AZURE_TENANT_ID`         | `tenant` from `az ad sp create-for-rbac`                     |
| `AZURE_SUBSCRIPTION_ID`   | your subscription id (optional; pins the active subscription) |

The service principal is scoped to a **single resource group** with the
`Contributor` role — not subscription-wide.

> The hook only takes effect for **future** sessions once this is merged to the
> repository's default branch.
