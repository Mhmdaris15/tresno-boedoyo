# Tresno Boedoyo Deployment Script for Windows
# Usage: .\deploy.ps1 -Environment [staging|production]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment
)

# Color functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Info "Starting deployment for $Environment environment..."

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Success "Docker is running"
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Check if docker-compose file exists
$ComposeFile = "docker-compose.$Environment.yml"
if (-not (Test-Path $ComposeFile)) {
    Write-Error "Docker compose file $ComposeFile not found"
    exit 1
}

# Check if environment file exists
$EnvFile = ".env.$Environment"
if (-not (Test-Path $EnvFile)) {
    Write-Error "Environment file $EnvFile not found"
    Write-Warning "Please copy .env.$Environment.example to .env.$Environment and configure it"
    exit 1
}

# Load environment variables
Write-Info "Loading environment variables from $EnvFile"
Get-Content $EnvFile | Where-Object { $_ -match "^[^#]" } | ForEach-Object {
    $name, $value = $_ -split '=', 2
    if ($name -and $value) {
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Create necessary directories
Write-Info "Creating necessary directories..."
$directories = @("nginx", "ssl", "database\backup", "monitoring", "scripts")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Pull latest images
Write-Info "Pulling latest Docker images..."
docker-compose -f $ComposeFile pull

# Stop existing containers
Write-Info "Stopping existing containers..."
docker-compose -f $ComposeFile down

# Start database first and wait for it to be ready
Write-Info "Starting database services..."
docker-compose -f $ComposeFile up -d postgres redis

# Wait for database to be ready
Write-Info "Waiting for database to be ready..."
$timeout = 60
$counter = 0
$dbUser = if ($Environment -eq "production") { $env:PROD_DB_USER } else { $env:STAGING_DB_USER }

do {
    try {
        docker-compose -f $ComposeFile exec -T postgres pg_isready -U $dbUser | Out-Null
        $dbReady = $true
        break
    } catch {
        $dbReady = $false
        Start-Sleep 1
        $counter++
    }
} while ($counter -lt $timeout -and -not $dbReady)

if (-not $dbReady) {
    Write-Error "Database failed to start within $timeout seconds"
    exit 1
}

Write-Success "Database is ready!"

# Start all services
Write-Info "Starting all services..."
docker-compose -f $ComposeFile up -d

# Wait for all services to be healthy
Write-Info "Waiting for services to be healthy..."
Start-Sleep 30

# Health check for each service
$services = @(
    @{name="frontend"; port=3000},
    @{name="backend"; port=3001},
    @{name="web3-service"; port=3003}
)

foreach ($service in $services) {
    Write-Info "Checking health of $($service.name)..."
    
    $timeout = 60
    $counter = 0
    $healthy = $false
    
    do {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$($service.port)/health" -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $healthy = $true
                break
            }
        } catch {
            Start-Sleep 1
            $counter++
        }
    } while ($counter -lt $timeout)
    
    if ($healthy) {
        Write-Success "$($service.name) is healthy!"
    } else {
        Write-Warning "$($service.name) health check failed, but continuing..."
    }
}

# Show running containers
Write-Info "Current running containers:"
docker-compose -f $ComposeFile ps

# Show logs for a few seconds
Write-Info "Recent logs:"
docker-compose -f $ComposeFile logs --tail=10

# Display important URLs
Write-Success "Deployment completed successfully!"
Write-Host ""
Write-Host "📱 Application URLs:" -ForegroundColor Cyan
if ($Environment -eq "staging") {
    Write-Host "   Frontend: https://staging.tresno-boedoyo.com"
    Write-Host "   Backend API: https://api-staging.tresno-boedoyo.com"
    Write-Host "   Web3 Service: https://web3-staging.tresno-boedoyo.com"
} else {
    Write-Host "   Frontend: https://tresno-boedoyo.com"
    Write-Host "   Backend API: https://api.tresno-boedoyo.com"
    Write-Host "   Web3 Service: https://web3.tresno-boedoyo.com"
}
Write-Host ""
Write-Host "📊 Monitoring URLs:" -ForegroundColor Cyan
Write-Host "   Grafana: http://localhost:3030 (admin/$env:GRAFANA_ADMIN_PASSWORD)"
Write-Host "   Prometheus: http://localhost:9090"
Write-Host ""
Write-Host "🔧 Management Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose -f $ComposeFile logs -f [service]"
Write-Host "   Stop services: docker-compose -f $ComposeFile down"
Write-Host "   Restart service: docker-compose -f $ComposeFile restart [service]"
Write-Host ""

if ($Environment -eq "production") {
    Write-Host "💾 Backup Information:" -ForegroundColor Cyan
    Write-Host "   Database backups are stored in: .\database\backup\"
    Write-Host "   Automatic backups run daily at midnight"
    Write-Host "   Manual backup: docker-compose -f $ComposeFile exec db-backup /backup.sh"
    Write-Host ""
}

Write-Success "🎉 Tresno Boedoyo is now running in $Environment mode!"
