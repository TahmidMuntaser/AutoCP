#!/bin/bash

# AutoCP Judge System Test Script

echo "🧪 Testing AutoCP Judge System"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Python3
echo -n "1. Checking Python3... "
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Python3 not found${NC}"
    echo "   Install: sudo apt install python3"
fi

# Test 2: Check G++
echo -n "2. Checking G++... "
if command -v g++ &> /dev/null; then
    VERSION=$(g++ --version | head -1)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${YELLOW}⚠${NC} G++ not found (optional for C++ support)"
    echo "   Install: sudo apt install g++"
fi

# Test 3: Check Java
echo -n "3. Checking Java compiler... "
if command -v javac &> /dev/null; then
    VERSION=$(javac -version 2>&1)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${YELLOW}⚠${NC} Javac not found (optional for Java support)"
    echo "   Install: sudo apt install default-jdk"
fi

# Test 4: Check MongoDB
echo -n "4. Checking MongoDB... "
if pgrep -x mongod > /dev/null; then
    echo -e "${GREEN}✓${NC} Running"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "   Start: sudo systemctl start mongod"
fi

# Test 5: Check Backend Dependencies
echo -n "5. Checking backend dependencies... "
cd "$(dirname "$0")/backend" 2>/dev/null || cd backend 2>/dev/null
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${RED}✗ Not installed${NC}"
    echo "   Run: cd backend && npm install"
fi

# Test 6: Check Backend Server
echo -n "6. Checking backend server... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running on port 3000"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "   Start: cd backend && node server.js"
fi

# Test 7: Check temp directory
echo -n "7. Checking temp directory... "
if [ -d "temp" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${YELLOW}⚠${NC} Creating temp directory..."
    mkdir -p temp
    echo -e "${GREEN}✓${NC} Created"
fi

# Test 8: Check Frontend
echo -n "8. Checking frontend server... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running on port 5173"
else
    echo -e "${YELLOW}⚠${NC} Not running"
    echo "   Start: cd frontend && npm run dev"
fi

echo ""
echo "================================"
echo "📋 Summary:"
echo ""
echo "To run the complete system:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  node server.js"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
echo "📖 Read JUDGE_TESTING_GUIDE.md for detailed instructions"
echo ""
