#!/bin/bash
# Run smoke tests (P0) — fast, < 3 minutes
# Usage: ./scripts/run-smoke.sh

set -e
cd "$(dirname "$0")/.."

echo "Running SMOKE tests..."
npx playwright test --grep @smoke --reporter list,html
echo "Smoke run complete. Report: npx playwright show-report test-results/html"
