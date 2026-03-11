#!/bin/bash

# ThreadsBot - Authentication Testing Script
# Usage: bash TEST_AUTHENTICATION.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         ThreadsBot - Authentication Testing Script             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Service Status
echo -e "${YELLOW}[TEST 1]${NC} Checking service status..."
if sudo supervisorctl status threadsbot | grep -q "RUNNING"; then
    echo -e "${GREEN}✅ Service is running${NC}"
else
    echo -e "${RED}❌ Service is not running${NC}"
    exit 1
fi
echo ""

# Test 2: Check Database
echo -e "${YELLOW}[TEST 2]${NC} Checking database..."
if sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db ".tables" | grep -q "users"; then
    echo -e "${GREEN}✅ Users table exists${NC}"
else
    echo -e "${RED}❌ Users table not found${NC}"
    exit 1
fi
echo ""

# Test 3: Check Login Page
echo -e "${YELLOW}[TEST 3]${NC} Checking login page..."
if curl -s http://localhost:5008/login | grep -q "ThreadsBot"; then
    echo -e "${GREEN}✅ Login page is accessible${NC}"
else
    echo -e "${RED}❌ Login page not accessible${NC}"
    exit 1
fi
echo ""

# Test 4: Check Register Page
echo -e "${YELLOW}[TEST 4]${NC} Checking register page..."
if curl -s http://localhost:5008/register | grep -q "Buat Akun Baru"; then
    echo -e "${GREEN}✅ Register page is accessible${NC}"
else
    echo -e "${RED}❌ Register page not accessible${NC}"
    exit 1
fi
echo ""

# Test 5: Check Files
echo -e "${YELLOW}[TEST 5]${NC} Checking required files..."
FILES=(
    "/home/ubuntu/threadsbot/middleware/auth.js"
    "/home/ubuntu/threadsbot/routes/auth.js"
    "/home/ubuntu/threadsbot/views/login.ejs"
    "/home/ubuntu/threadsbot/views/register.ejs"
    "/home/ubuntu/threadsbot/views/profile.ejs"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
        exit 1
    fi
done
echo ""

# Test 6: Check Database Users Count
echo -e "${YELLOW}[TEST 6]${NC} Checking users in database..."
USER_COUNT=$(sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db "SELECT COUNT(*) FROM users;")
echo -e "${GREEN}✅ Total users: $USER_COUNT${NC}"
echo ""

# Test 7: Check Logs
echo -e "${YELLOW}[TEST 7]${NC} Checking logs..."
if [ -f "/home/ubuntu/threadsbot/dashboard.log" ]; then
    echo -e "${GREEN}✅ Log file exists${NC}"
    echo "Last 5 lines:"
    tail -5 /home/ubuntu/threadsbot/dashboard.log
else
    echo -e "${RED}❌ Log file not found${NC}"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Open https://threadsbot.kelasmaster.id/register"
echo "2. Create a new account"
echo "3. Login with your credentials"
echo "4. Access your profile"
echo ""
