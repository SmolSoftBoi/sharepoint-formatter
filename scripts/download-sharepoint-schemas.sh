#!/usr/bin/env bash
set -euo pipefail

SCHEMA_DIR="/workspaces/sharepoint-formatter/app/schemas/sharepoint-v2"

mkdir -p "$SCHEMA_DIR"

curl -sSL "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json" -o "$SCHEMA_DIR/column-formatting.json"
curl -sSL "https://developer.microsoft.com/json-schemas/sp/view-formatting.schema.json" -o "$SCHEMA_DIR/view-formatting.json"
curl -sSL "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json" -o "$SCHEMA_DIR/row-formatting.json"
curl -sSL "https://developer.microsoft.com/json-schemas/sp/v2/tile-formatting.schema.json" -o "$SCHEMA_DIR/tile-formatting.json"
curl -sSL "https://developer.microsoft.com/json-schemas/sp/v2/board-formatting.schema.json" -o "$SCHEMA_DIR/board-formatting.json"
curl -sSL "https://developer.microsoft.com/json-schemas/sp/v2/calendar-formatting.schema.json" -o "$SCHEMA_DIR/calendar-formatting.json"

echo "Downloaded SharePoint schemas to $SCHEMA_DIR"
