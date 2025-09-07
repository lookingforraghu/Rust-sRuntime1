# PowerShell script to install and setup MongoDB
Write-Host "🚀 Setting up MongoDB for Citizen Grievance System..." -ForegroundColor Green

# Check if MongoDB is already installed
$mongodPath = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongodPath) {
    Write-Host "✅ MongoDB is already installed at: $($mongodPath.Source)" -ForegroundColor Green
} else {
    Write-Host "📦 MongoDB not found. Please install MongoDB Community Server:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
    Write-Host "2. Download MongoDB Community Server for Windows" -ForegroundColor Cyan
    Write-Host "3. Run the installer with default settings" -ForegroundColor Cyan
    Write-Host "4. Make sure to install MongoDB as a Windows Service" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use MongoDB Atlas (cloud) for easier setup:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://www.mongodb.com/atlas" -ForegroundColor Cyan
    Write-Host "2. Create a free account" -ForegroundColor Cyan
    Write-Host "3. Create a new cluster" -ForegroundColor Cyan
    Write-Host "4. Get your connection string" -ForegroundColor Cyan
    Write-Host "5. Update the MONGODB_URI in your .env file" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Green
Write-Host "1. Start MongoDB service (if installed locally)" -ForegroundColor White
Write-Host "2. Run: npm run seed (to populate database with sample data)" -ForegroundColor White
Write-Host "3. Run: npm run dev (to start the server)" -ForegroundColor White
Write-Host ""
Write-Host "📝 Environment Variables:" -ForegroundColor Green
Write-Host "MONGODB_URI=mongodb://localhost:27017/citizen-grievance" -ForegroundColor White
Write-Host "JWT_SECRET=your-super-secret-jwt-key-here" -ForegroundColor White
Write-Host "JWT_EXPIRE=7d" -ForegroundColor White