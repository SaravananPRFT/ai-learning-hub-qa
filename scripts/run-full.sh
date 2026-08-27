#!/bin/bash
# Run the full test suite (E2E + API + Accessibility)
# Usage: ./scripts/run-full.sh

set -e
cd "$(dirname "$0")/.."

echo "Running FULL test suite..."
npx playwright test --reporter list,allure-playwright,html
echo "Full run complete."
echo "Playwright report: npm run report:pw"
echo "Allure report:     npm run report:allure"
