#!/bin/bash
# One-command deploy to GitHub Pages
# Usage: bash deploy.sh "your-github-username"
# Requires: gh auth login (run this first)

set -e

GH_USER="${1:-}"
if [ -z "$GH_USER" ]; then
    echo "Usage: bash deploy.sh YOUR_GITHUB_USERNAME"
    echo "First run: gh auth login"
    exit 1
fi

REPO_NAME="ai-config-generator"
DIR="/home/allnoworg/ai-config-generator"

echo "=> Checking GitHub auth..."
gh auth status > /dev/null 2>&1 || { echo "ERROR: Run 'gh auth login' first"; exit 1; }

echo "=> Creating repo: $GH_USER/$REPO_NAME ..."
gh repo create "$GH_USER/$REPO_NAME" --public --source "$DIR" --remote origin --push 2>/dev/null || {
    echo "=> Repo exists, pushing to it..."
    cd "$DIR"
    git init 2>/dev/null || true
    git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git" 2>/dev/null || true
    git add -A
    git commit -m "Deploy AI Config Generator" || true
    git push -u origin main --force
}

echo "=> Enabling GitHub Pages..."
sleep 3
gh api repos/$GH_USER/$REPO_NAME/pages \
    --method POST \
    -f source='{"branch":"main","path":"/"}' 2>/dev/null || echo "(Pages may already be enabled)"

echo ""
echo "=> DONE! Your site will be live at:"
echo "   https://$GH_USER.github.io/$REPO_NAME/"
echo ""
echo "   (Takes 1-2 minutes to propagate)"
echo ""
echo "=> Update index.html with your Gumroad URL:"
echo "   Open $DIR/index.html"
echo "   Search for: https://gumroad.com"
echo "   Replace with your actual Gumroad product link"
echo "   Then: cd $DIR && git push"
