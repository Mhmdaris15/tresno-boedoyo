# 🏛️ Opportunities Integration Guide

## Overview
The opportunities page has been successfully integrated with the backend database and API. Users can now view real heritage preservation opportunities, filter them, search, and apply directly through the interface.

## 🚀 Quick Start

### 1. Run the Test Setup Script
```powershell
.\test-opportunities.ps1
```

This script will:
- Install all dependencies
- Set up the database with migrations
- Seed sample opportunities
- Start both backend and frontend servers

### 2. Test Accounts
- **Volunteer**: `volunteer@tresno-boedoyo.com` / `volunteer123`
- **Coordinator**: `coordinator@tresno-boedoyo.com` / `coordinator123`

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎯 Features Implemented

### Frontend (`/opportunities`)
- ✅ Real-time data fetching from backend API
- ✅ Filter by status (All, Active, Completed, Cancelled)
- ✅ Search by title, description, or location
- ✅ Apply to opportunities with one click
- ✅ Enhanced opportunity cards showing:
  - Coordinator information
  - Required skills
  - Duration and participant counts
  - Real-time application status
- ✅ Error handling and loading states
- ✅ Detailed opportunity view (`/opportunities/[id]`)

### Backend API (`/api/opportunities`)
- ✅ `GET /opportunities` - List all opportunities with filtering
- ✅ `GET /opportunities/:id` - Get single opportunity details
- ✅ `POST /opportunities/:id/apply` - Apply to opportunity
- ✅ `POST /opportunities` - Create new opportunity (coordinators only)
- ✅ Proper authentication and authorization
- ✅ Data validation and error handling
- ✅ Database integration with Prisma

### Database Schema
- ✅ Complete opportunities table with all fields
- ✅ Skills and opportunity-skill relationships
- ✅ Applications tracking
- ✅ User roles (volunteers/coordinators)
- ✅ Sample data seeding

## 📊 Sample Opportunities Created

1. **Borobudur Temple Documentation** (Magelang, Central Java)
   - Photography and cataloging of ancient reliefs
   - Skills: Photography, Cataloging
   - 20 max participants

2. **Prambanan Stone Conservation** (Yogyakarta)
   - Stone restoration and conservation work
   - Skills: Stone Conservation
   - 15 max participants

3. **Traditional Batik Research** (Solo, Central Java)
   - Research and documentation of batik techniques
   - Skills: Cultural Research
   - 10 max participants

4. **Heritage Education Program** (Jakarta)
   - Educational programs for schools
   - Skills: Teaching
   - 25 max participants

5. **Digital Archive Project** (Bandung, West Java)
   - Digitizing historical documents
   - Skills: Cataloging, Photography
   - 12 max participants

## 🔧 API Endpoints

### Opportunities
```
GET    /opportunities              # List opportunities with filters
GET    /opportunities/:id          # Get opportunity details
POST   /opportunities/:id/apply    # Apply to opportunity (auth required)
POST   /opportunities              # Create opportunity (coordinators only)
```

### Query Parameters for Listing
- `status`: Filter by status (PUBLISHED, COMPLETED, CANCELLED)
- `location`: Filter by location
- `search`: Search in title, description, location
- `limit`: Number of results per page
- `offset`: Pagination offset

## 🎨 UI/UX Enhancements

### Opportunity Cards
- Indonesian heritage color scheme
- Clear status indicators
- Skill badges
- Coordinator information
- Participant progress bars
- Smart apply/full/completed states

### Loading States
- Spinner with heritage colors
- Contextual loading messages
- Error handling with retry options

### Responsive Design
- Mobile-friendly layouts
- Touch-friendly buttons
- Responsive grid system

## 🔐 Security Features

- JWT authentication for all protected endpoints
- Role-based access control
- Input validation and sanitization
- SQL injection prevention via Prisma
- CORS configuration
- Rate limiting

## 🧪 Testing

### Manual Testing Steps
1. **Login as volunteer**
   - Go to `/login`
   - Use: `volunteer@tresno-boedoyo.com` / `volunteer123`

2. **Browse opportunities**
   - Navigate to `/opportunities`
   - Test filtering by status
   - Test search functionality

3. **View opportunity details**
   - Click "Learn More" on any opportunity
   - View detailed information
   - Check skills, requirements, benefits

4. **Apply to opportunity**
   - Click "Apply Now" on an active opportunity
   - Verify application success message
   - Check participant count updates

5. **Test full opportunities**
   - Try applying to full opportunities
   - Verify button states change appropriately

### API Testing
```bash
# Get all opportunities
curl http://localhost:3001/opportunities

# Get specific opportunity
curl http://localhost:3001/opportunities/:id

# Apply to opportunity (requires auth token)
curl -X POST http://localhost:3001/opportunities/:id/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to participate"}'
```

## 🚀 Deployment

The opportunities integration is ready for deployment with the existing CI/CD pipeline:

1. **Database Migration**: Run `npx prisma migrate deploy` in production
2. **Seed Data**: Run `npx prisma db seed` for initial data
3. **Environment Variables**: Ensure `DATABASE_URL` is configured
4. **Health Checks**: API endpoints include health check support

## 🔄 Future Enhancements

### Planned Features
- [ ] Advanced filtering (date range, skill requirements)
- [ ] Application status tracking for volunteers
- [ ] Coordinator dashboard for managing applications
- [ ] Email notifications for applications
- [ ] Calendar integration
- [ ] Batch application approval
- [ ] Analytics and reporting
- [ ] Mobile app support

### Performance Optimizations
- [ ] Implement pagination for large datasets
- [ ] Add caching for frequently accessed data
- [ ] Optimize database queries
- [ ] Add search indexing

## 📝 Notes

- All mock data has been replaced with real database integration
- The Indonesian heritage color palette is maintained throughout
- Error handling includes user-friendly messages
- The codebase follows TypeScript best practices
- Database schema supports all planned features

## 🎉 Success!

The opportunities page is now fully integrated with the backend database! Users can browse, filter, search, and apply to real heritage preservation opportunities with a seamless experience. 🇮🇩
