# Tresno Boedoyo - Indonesia Heritage Society Volunteer Management Platform

## Overview

Tresno Boedoyo is an AI-powered microservice platform designed to transform how the Indonesia Heritage Society manages, engages, and sustains its volunteer community. The platform consists of three main services working together to provide intelligent volunteer matching, seamless coordination, and blockchain-based recognition.

## Architecture

This project follows a microservice architecture with the following components:

### 🎯 **Backend Service** (`/backend`)
- **Technology**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: Gemini API for intelligent volunteer matching
- **Features**:
  - User authentication and authorization
  - Volunteer profile management
  - Opportunity creation and management
  - AI-powered volunteer matching
  - RESTful API endpoints

### 📱 **Frontend Service** (`/frontend`)
- **Technology**: React.js with Material-UI
- **Features**:
  - Responsive web application (desktop & mobile)
  - Modern React with TypeScript
  - Material-UI design system
  - React Router for navigation
  - React Query for data fetching
  - Web3 wallet integration
  - Progressive Web App (PWA) capabilities

### ⛓️ **Web3 Service** (`/web3-service`)
- **Technology**: Node.js with Thirdweb SDK
- **Blockchain**: Polygon (for low transaction fees)
- **Features**:
  - Soulbound Token (SBT) smart contract management
  - Automated achievement minting
  - Wallet integration
  - Contribution verification

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Docker and Docker Compose
- Expo CLI
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd IHS-Connect
```

2. **Install dependencies for all services**
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Web3 Service
cd ../web3-service && npm install
```

3. **Set up environment variables**
- Copy `.env.example` to `.env` in each service directory
- Fill in the required API keys and configuration

4. **Start the development environment**
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or start services individually
npm run dev:backend
npm run dev:frontend
npm run dev:web3
```

## API Documentation

### Backend Service
- **Base URL**: `http://localhost:3001/api`
- **Documentation**: Available at `http://localhost:3001/api-docs` (Swagger)

### Web3 Service
- **Base URL**: `http://localhost:3003/api`
- **Documentation**: Available at `http://localhost:3003/api-docs`

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/ihs_connect
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
WEB3_SERVICE_URL=http://localhost:3003
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WEB3_SERVICE_URL=http://localhost:3003/api
REACT_APP_ENV=development
```

### Web3 Service (.env)
```
PRIVATE_KEY=your-wallet-private-key
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=your-deployed-contract-address
THIRDWEB_SECRET_KEY=your-thirdweb-secret
```

## Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Core Features

### 🎯 CAPTURE: Smart Volunteer Profiles
- Conversational onboarding process
- Skills, interests, and availability tracking
- Dynamic profile updates

### 🔄 TRANSLATE: Opportunity Management
- Structured opportunity creation
- Requirements specification
- Impact tracking

### 🤖 ENGAGE: AI-Powered Matching
- Intelligent volunteer-opportunity matching
- Personalized notifications
- Real-time availability checking

### 🏆 SUSTAIN: Blockchain Recognition
- Soulbound Token achievements
- Contribution verification
- Long-term engagement incentives

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in each service directory

---

**Built with ❤️ for the Indonesia Heritage Society**
