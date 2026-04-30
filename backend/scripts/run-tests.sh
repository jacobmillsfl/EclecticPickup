#!/usr/bin/env bash
# Run backend tests in a local venv (avoids PEP 668 / system Python issues on macOS).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
# shellcheck source=/dev/null
source .venv/bin/activate
pip install -q -r requirements.txt -r requirements-dev.txt
exec pytest -q "$@"
