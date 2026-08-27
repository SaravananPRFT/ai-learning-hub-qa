#!/bin/bash
# Run all API tests against the backend
# Usage: ./scripts/run-api.sh

set -e
cd "$(dirname "$0")/.."

echo "Running API tests..."
npx playwright test tests/api --project api --reporter list,html
echo "API tests complete."
