#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        PUSHING THREADSBOT TO GITHUB                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Add uncommitted changes
echo "[1/4] Adding uncommitted changes..."
git add -A
echo "✓ Files added"
echo ""

# Step 2: Commit changes
echo "[2/4] Committing changes..."
git commit -m "ThreadsBot Complete Backup - $(date '+%Y-%m-%d %H:%M:%S')" || echo "✓ Already up to date"
echo ""

# Step 3: Setup credential helper
echo "[3/4] Setting up credential helper..."
git config --global credential.helper store
echo "✓ Credential helper configured"
echo ""

# Step 4: Push to GitHub
echo "[4/4] Pushing to GitHub..."
echo "Repository: https://github.com/aburasyidalfatih/threadsbot.git"
echo "Branch: main"
echo ""
echo "Attempting push..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ PUSH SUCCESSFUL!"
  echo ""
  echo "Repository URL: https://github.com/aburasyidalfatih/threadsbot"
  echo "Branch: main"
  echo ""
  git log --oneline -1
else
  echo ""
  echo "⚠️  Push encountered an issue"
  echo ""
  echo "Possible reasons:"
  echo "1. GitHub credentials not provided"
  echo "2. Repository doesn't exist on GitHub"
  echo "3. Network connection issue"
  echo ""
  echo "Solution:"
  echo "1. Create Personal Access Token on GitHub"
  echo "2. Run: git push -u origin main"
  echo "3. Enter username and token when prompted"
fi
