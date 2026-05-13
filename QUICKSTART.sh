#!/bin/bash
# Quick Start Guide for RouteMate Backend

echo "╔════════════════════════════════════════════╗"
echo "║   RouteMate - Quick Start Guide            ║"
echo "║   Member 2: Backend API Implementation    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Install Dependencies${NC}"
echo "Command: npm install"
echo "This will install Express, CORS, and Body-Parser"
echo ""

echo -e "${YELLOW}Step 2: Start the Server${NC}"
echo "Command: npm start"
echo "Server will run on http://localhost:3000"
echo ""

echo -e "${YELLOW}Step 3: Test the API (Optional)${NC}"
echo "Open another terminal and run: npm test"
echo "This will run all API endpoint tests"
echo ""

echo -e "${GREEN}🚀 Getting Started:${NC}"
echo ""
echo "1. Install dependencies:"
echo "   $ npm install"
echo ""
echo "2. Start server in one terminal:"
echo "   $ npm start"
echo ""
echo "3. In another terminal, run tests:"
echo "   $ npm test"
echo ""

echo -e "${BLUE}📡 API Quick Reference:${NC}"
echo ""
echo "Authentication:"
echo "  POST   /auth/login              - Login user"
echo "  POST   /auth/logout             - Logout user"
echo "  GET    /auth/users              - Get all users"
echo ""
echo "Attendance:"
echo "  POST   /attendance              - Mark attendance"
echo "  GET    /attendance/student/:id  - Get student attendance"
echo "  GET    /attendance/parent/:id   - Get parent's children attendance"
echo ""
echo "Payment:"
echo "  POST   /payment                 - Create payment"
echo "  POST   /payment/:id/process     - Process payment"
echo "  GET    /payment/:id/receipt     - Generate receipt"
echo "  GET    /payment/parent/:id      - Get parent's payments"
echo ""
echo "Bus:"
echo "  GET    /bus                     - Get all buses"
echo "  GET    /bus/:id                 - Get bus details"
echo "  GET    /bus/:id/students        - Get bus students"
echo "  POST   /bus/:id/location        - Update bus location"
echo "  GET    /bus/:id/location        - Get bus location"
echo ""
echo "Dashboard:"
echo "  GET    /dashboard/parent/:id    - Parent dashboard"
echo "  GET    /dashboard/driver/:id    - Driver dashboard"
echo ""

echo -e "${BLUE}💡 Sample Credentials:${NC}"
echo ""
echo "Parents:"
echo "  ID: P001, Email: parent1@routemate.com (Mr. Khan)"
echo "  ID: P002, Email: parent2@routemate.com (Mrs. Ahmed)"
echo ""
echo "Drivers:"
echo "  ID: D001, Email: akram@routemate.com (Akram Khan)"
echo "  ID: D002, Email: bilal@routemate.com (Bilal Ahmad)"
echo ""

echo -e "${BLUE}🧪 Example cURL Commands:${NC}"
echo ""
echo "1. Login as parent:"
echo '   curl -X POST http://localhost:3000/auth/login \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"userId\":\"P001\",\"email\":\"parent1@routemate.com\"}"'
echo ""
echo "2. Mark attendance:"
echo '   curl -X POST http://localhost:3000/attendance \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"parentId\":\"P001\",\"studentId\":\"S001\",\"morningStatus\":true,\"afternoonStatus\":false}"'
echo ""
echo "3. Create payment:"
echo '   curl -X POST http://localhost:3000/payment \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"parentId\":\"P001\",\"studentId\":\"S001\",\"amount\":5000}"'
echo ""
echo "4. Get parent dashboard:"
echo '   curl http://localhost:3000/dashboard/parent/P001'
echo ""
echo "5. Update bus location:"
echo '   curl -X POST http://localhost:3000/bus/B001/location \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"latitude\":31.53,\"longitude\":74.36}"'
echo ""

echo -e "${GREEN}✅ Ready to use!${NC}"
echo ""
echo "Documentation:"
echo "  - README.md                          - Full project documentation"
echo "  - API_DOCUMENTATION.md               - Complete API reference"
echo "  - MEMBER2_COMPLETION_REPORT.md       - Implementation details"
echo ""
