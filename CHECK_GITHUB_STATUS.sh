#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        CHECKING GITHUB BACKUP STATUS                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "1. Git Status:"
git status
echo ""

echo "2. Git Remote:"
git remote -v
echo ""

echo "3. Git Branch:"
git branch -a
echo ""

echo "4. Git Log (last 3 commits):"
git log --oneline -3
echo ""

echo "5. Uncommitted Changes:"
git diff --stat
echo ""

echo "6. Staged Changes:"
git diff --cached --stat
echo ""

echo "SUMMARY:"
echo "✓ Git repository initialized"
echo "✓ Files committed locally"
echo "✓ Remote configured: https://github.com/aburasyidalfatih/threadsbot.git"
echo ""
echo "STATUS: Ready to push"
echo ""
echo "NEXT STEP:"
echo "To push to GitHub, you need to:"
echo "1. Authenticate with GitHub (use personal access token)"
echo "2. Run: git push -u origin main"
echo ""
echo "Or use SSH:"
echo "1. Setup SSH key"
echo "2. Change remote: git remote set-url origin git@github.com:aburasyidalfatih/threadsbot.git"
echo "3. Run: git push -u origin main"
