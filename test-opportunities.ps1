# Test Setup Script for Opportunities Integration

Write-Host "🚀 Setting up Tresno Boedoyo Opportunities Integration Test" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "nextjs-frontend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
Set-Location backend
npm install

Write-Host "🗄️ Setting up database..." -ForegroundColor Blue
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name "opportunities_integration"

# Seed the database with sample data
Write-Host "🌱 Seeding database with sample opportunities..." -ForegroundColor Blue
npx prisma db seed

Write-Host "🔧 Starting backend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

# Wait for backend to start
Start-Sleep 5

# Go to frontend
Set-Location ..\nextjs-frontend

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

Write-Host "🌐 Starting frontend development server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test Accounts:" -ForegroundColor Yellow
Write-Host "   Coordinator: coordinator@tresno-boedoyo.com / coordinator123" -ForegroundColor White
Write-Host "   Volunteer: volunteer@tresno-boedoyo.com / volunteer123" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Test the integration by:" -ForegroundColor Yellow
Write-Host "   1. Login as volunteer at http://localhost:3000/login" -ForegroundColor White
Write-Host "   2. Navigate to Opportunities page" -ForegroundColor White
Write-Host "   3. View real opportunities from database" -ForegroundColor White
Write-Host "   4. Apply to an opportunity" -ForegroundColor White
Write-Host ""
Write-Host "📊 Sample opportunities created:" -ForegroundColor Yellow
Write-Host "   • Borobudur Temple Documentation" -ForegroundColor White
Write-Host "   • Prambanan Stone Conservation" -ForegroundColor White
Write-Host "   • Traditional Batik Research" -ForegroundColor White
Write-Host "   • Heritage Education Program" -ForegroundColor White
Write-Host "   • Digital Archive Project" -ForegroundColor White

# Return to root
Set-Location ..
