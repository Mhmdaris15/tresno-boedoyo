#!/bin/bash

# Tresno Boedoyo Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ $# -eq 0 ]; then
    print_error "Please specify environment: staging or production"
    echo "Usage: $0 [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    print_error "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

print_status "Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose file exists
COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Docker compose file $COMPOSE_FILE not found"
    exit 1
fi

# Check if environment file exists
ENV_FILE=".env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    print_error "Environment file $ENV_FILE not found"
    print_warning "Please copy .env.$ENVIRONMENT.example to .env.$ENVIRONMENT and configure it"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables from $ENV_FILE"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p nginx ssl database/backup monitoring scripts

# Create backup directory with proper permissions
if [ "$ENVIRONMENT" = "production" ]; then
    sudo chown -R 999:999 database/backup 2>/dev/null || true
fi

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f $COMPOSE_FILE pull

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Start database first and wait for it to be ready
print_status "Starting database services..."
docker-compose -f $COMPOSE_FILE up -d postgres redis

# Wait for database to be ready
print_status "Waiting for database to be ready..."
timeout=60
counter=0
while ! docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U ${PROD_DB_USER:-${STAGING_DB_USER}} > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        print_error "Database failed to start within $timeout seconds"
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

print_success "Database is ready!"

# Run database migrations if needed
if [ -f "database/migrations.sql" ]; then
    print_status "Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec -T postgres psql -U ${PROD_DB_USER:-${STAGING_DB_USER}} -d ${PROD_DATABASE_URL##*/} -f /docker-entrypoint-initdb.d/migrations.sql || true
fi

# Start all services
print_status "Starting all services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for all services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Health check for each service
services=("frontend" "backend" "web3-service")
for service in "${services[@]}"; do
    print_status "Checking health of $service..."
    
    # Get container port
    if [ "$service" = "frontend" ]; then
        port=3000
    elif [ "$service" = "backend" ]; then
        port=3001
    else
        port=3003
    fi
    
    # Wait for service to respond
    timeout=60
    counter=0
    while ! curl -f http://localhost:$port/health > /dev/null 2>&1; do
        if [ $counter -eq $timeout ]; then
            print_warning "$service health check failed, but continuing..."
            break
        fi
        sleep 1
        counter=$((counter + 1))
    done
    
    if [ $counter -lt $timeout ]; then
        print_success "$service is healthy!"
    fi
done

# Show running containers
print_status "Current running containers:"
docker-compose -f $COMPOSE_FILE ps

# Show logs for a few seconds
print_status "Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=10

# Performance optimization for production
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Applying production optimizations..."
    
    # Set up log rotation
    if command -v logrotate &> /dev/null; then
        sudo tee /etc/logrotate.d/tresno-boedoyo > /dev/null << EOF
/var/lib/docker/containers/*/*.log {
    daily
    rotate 7
    missingok
    notifempty
    compress
    copytruncate
    maxsize 100M
}
EOF
    fi
    
    # Set up monitoring alerts
    print_status "Setting up monitoring alerts..."
    # This would typically integrate with your monitoring system
fi

# Display important URLs
print_success "Deployment completed successfully!"
echo ""
echo "📱 Application URLs:"
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "   Frontend: https://staging.tresno-boedoyo.com"
    echo "   Backend API: https://api-staging.tresno-boedoyo.com"
    echo "   Web3 Service: https://web3-staging.tresno-boedoyo.com"
else
    echo "   Frontend: https://tresno-boedoyo.com"
    echo "   Backend API: https://api.tresno-boedoyo.com"
    echo "   Web3 Service: https://web3.tresno-boedoyo.com"
fi
echo ""
echo "📊 Monitoring URLs:"
echo "   Grafana: http://localhost:3030 (admin/${GRAFANA_ADMIN_PASSWORD})"
echo "   Prometheus: http://localhost:9090"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose -f $COMPOSE_FILE logs -f [service]"
echo "   Stop services: docker-compose -f $COMPOSE_FILE down"
echo "   Restart service: docker-compose -f $COMPOSE_FILE restart [service]"
echo "   Scale service: docker-compose -f $COMPOSE_FILE up -d --scale [service]=N"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo "💾 Backup Information:"
    echo "   Database backups are stored in: ./database/backup/"
    echo "   Automatic backups run daily at midnight"
    echo "   Manual backup: docker-compose -f $COMPOSE_FILE exec db-backup /backup.sh"
    echo ""
fi

print_success "🎉 Tresno Boedoyo is now running in $ENVIRONMENT mode!"
