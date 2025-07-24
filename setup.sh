#!/bin/bash

# Tresno Boedoyo Setup Script
echo "🚀 Setting up Tresno Boedoyo Microservices..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install dependencies for all services
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo "📦 Installing web3-service dependencies..."
cd web3-service && npm install
cd ..

# Copy environment files
echo "📋 Setting up environment files..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp web3-service/.env.example web3-service/.env

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env files with your API keys and configuration"
echo "2. Start PostgreSQL database (or use Docker Compose)"
echo "3. Run 'npm run dev:all' to start all services"
echo ""
echo "For detailed setup instructions, see SETUP.md"
