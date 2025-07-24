# Tresno Boedoyo Project Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete Tresno Boedoyo microservice ecosystem in just a few steps.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **Expo CLI** - Install with `npm install -g expo-cli`

### 📦 Installation Steps

#### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd IHS-Connect

# Install root dependencies
npm install

# Install all service dependencies
npm run install:all
```

#### 2. Environment Configuration

Copy the example environment files and fill in your configuration:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# Web3 Service
cp web3-service/.env.example web3-service/.env
```

**Important:** Update the following in your `.env` files:
- `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `THIRDWEB_SECRET_KEY` - Get from [Thirdweb Dashboard](https://thirdweb.com/dashboard)
- `PRIVATE_KEY` - Your wallet private key for blockchain operations
- `DATABASE_URL` - PostgreSQL connection string

#### 3. Database Setup

```bash
# Start PostgreSQL with Docker
docker run --name ihs-postgres -e POSTGRES_PASSWORD=ihs_password -e POSTGRES_USER=ihs_user -e POSTGRES_DB=ihs_connect -p 5432:5432 -d postgres:15-alpine

# Navigate to backend and setup database
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

#### 4. Start Development Environment

**Option A: Using Docker Compose (Recommended)**
```bash
npm run docker:dev
```

**Option B: Manual Start**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Web3 Service
npm run dev:web3

# Terminal 3: Frontend
npm run dev:frontend
```

### 🌐 Service Endpoints

Once running, your services will be available at:

- **Backend API**: http://localhost:3001
  - Swagger Docs: http://localhost:3001/api-docs
  - Health Check: http://localhost:3001/health

- **Web3 Service**: http://localhost:3003
  - Swagger Docs: http://localhost:3003/api-docs
  - Health Check: http://localhost:3003/health

- **Frontend App**: http://localhost:19006 (Expo dev server)

### 📱 Mobile Development

To run on physical devices:

```bash
cd frontend

# For Android
npm run android

# For iOS (Mac only)
npm run ios

# For web
npm run web
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run web3 service tests only
npm run test:web3
```

### 🚢 Production Deployment

```bash
# Build all services
npm run build:all

# Deploy with Docker Compose
npm run docker:prod
```

### 📚 API Documentation

The project includes comprehensive API documentation:

- **Backend API**: Swagger UI at `/api-docs`
- **Web3 Service**: Swagger UI at `/api-docs`

### 🔧 Development Tools

- **ESLint**: Code linting
- **TypeScript**: Type safety
- **Prisma**: Database ORM and migrations
- **Jest**: Testing framework
- **Swagger**: API documentation

### 🎯 Project Structure

```
IHS-Connect/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   └── config/          # Configuration
│   └── prisma/              # Database schema & migrations
├── frontend/                # React Native mobile app
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── navigation/      # Navigation setup
├── web3-service/            # Blockchain service
│   ├── src/
│   │   ├── routes/          # Web3 API routes
│   │   ├── services/        # Blockchain logic
│   │   └── contracts/       # Smart contracts
└── docker/                  # Docker configuration
```

### 🔑 Key Features Implementation Status

- ✅ **Project Structure**: Complete microservice architecture
- ✅ **Authentication**: JWT-based auth system
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **API Documentation**: Swagger integration
- ✅ **Docker**: Development and production containers
- 🔄 **AI Matching**: Gemini API integration (placeholder)
- 🔄 **Web3 Integration**: Thirdweb setup (placeholder)
- 🔄 **Mobile UI**: React Native screens (placeholder)
- 🔄 **Push Notifications**: Expo notifications (placeholder)

### 🆘 Troubleshooting

**Common Issues:**

1. **Port already in use**: Change ports in `.env` files
2. **Database connection failed**: Ensure PostgreSQL is running
3. **Expo CLI not found**: Install with `npm install -g expo-cli`
4. **Docker issues**: Restart Docker Desktop

**Getting Help:**
- Check the service logs: `docker-compose logs [service-name]`
- Verify environment variables are set correctly
- Ensure all dependencies are installed

### 🎉 Next Steps

1. **Complete Authentication**: Implement registration and login flows
2. **Build Volunteer Profiles**: Create profile management screens
3. **Implement AI Matching**: Integrate Gemini API for volunteer matching
4. **Add Web3 Features**: Deploy smart contracts and implement SBT minting
5. **Create Mobile UI**: Design and implement mobile screens
6. **Add Push Notifications**: Set up Expo push notifications
7. **Deploy to Production**: Set up CI/CD pipeline

---

**Built with ❤️ for the Indonesia Heritage Society**

For questions or support, please open an issue in the repository.
