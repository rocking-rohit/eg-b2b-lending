# 🚗 Car Lending Platform - Setup Guide

## Overview
This is a comprehensive car lending platform built with Next.js 15, TypeScript, and Supabase. The platform enables users to register, list vehicles, make bookings, and engage in offer/counteroffer negotiations.

## 🏗️ Core Infrastructure Completed

### ✅ Database Schema
- **Enhanced Users Table**: Extended with car lending specific fields
- **Vehicles Table**: Complete vehicle management with specifications
- **Bookings Table**: Booking system with guest support
- **Offers Table**: Negotiation system for bookings
- **Counteroffers Table**: Counteroffer management
- **Payments Table**: Payment processing (ready for integration)
- **Reviews Table**: User feedback system (ready for integration)
- **Notifications Table**: Real-time notifications (ready for integration)

### ✅ API Endpoints
- **Users API**: Enhanced with car lending fields
- **Vehicles API**: Full CRUD operations with filtering
- **Bookings API**: Complete booking management
- **Offers API**: Offer creation and management
- **Counteroffers API**: Counteroffer system
- **Legacy Loans API**: Maintained for backward compatibility

### ✅ Frontend Integration
- **TypeScript Interfaces**: Complete type definitions
- **API Calls**: Comprehensive frontend API integration
- **Updated UI**: Modern interface with car lending focus

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials from Settings > API
3. Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup
Run the SQL commands from `SUPABASE_SETUP.md` in your Supabase SQL Editor to create all tables.

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3005` to see the platform.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── users/           # User management
│   │   ├── vehicles/        # Vehicle CRUD operations
│   │   ├── bookings/        # Booking management
│   │   ├── offers/          # Offer system
│   │   ├── counteroffers/   # Counteroffer system
│   │   └── loans/           # Legacy loan system
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # App layout
├── components/
│   ├── UserForm.tsx        # User registration
│   ├── UsersList.tsx       # User listing
│   ├── LoanForm.tsx        # Legacy loan form
│   └── LoansList.tsx       # Legacy loan listing
└── lib/
    ├── api.ts              # TypeScript interfaces
    ├── apiCalls.tsx        # Frontend API integration
    └── supabase.ts         # Supabase client
```

## 🎯 Features Implemented

### Core Features
- ✅ User registration with enhanced profiles
- ✅ Vehicle listing and management
- ✅ Booking system (registered + guest users)
- ✅ Offer and counteroffer negotiation system
- ✅ Real-time status updates
- ✅ Comprehensive API layer

### Ready for Implementation
- 🔄 Payment processing integration
- 🔄 Review and rating system
- 🔄 Real-time notifications
- 🔄 Advanced search and filtering
- 🔄 Map integration
- 🔄 Mobile responsiveness

## 🔧 API Usage Examples

### Create a Vehicle
```typescript
import { vehicleApi } from '@/lib/apiCalls'

const newVehicle = await vehicleApi.create({
  ownerId: 'user-uuid',
  name: 'Toyota Camry 2023',
  licensePlate: 'ABC-1234',
  transmission: 'automatic',
  fuelType: 'petrol',
  dailyRate: 1500,
  numberOfSeats: 5,
  airConditioning: true
})
```

### Create a Booking
```typescript
import { bookingApi } from '@/lib/apiCalls'

const newBooking = await bookingApi.create({
  userId: 'user-uuid', // Optional for registered users
  vehicleId: 'vehicle-uuid',
  fromLocation: 'Mumbai Airport',
  toLocation: 'Pune City Center',
  fromDate: '2024-01-15',
  toDate: '2024-01-17',
  fromTime: '10:00',
  toTime: '18:00',
  totalPrice: 3000
})
```

### Make an Offer
```typescript
import { offerApi } from '@/lib/apiCalls'

const newOffer = await offerApi.create({
  bookingId: 'booking-uuid',
  offeredByUserId: 'user-uuid',
  offerAmount: 2500,
  message: 'I can offer ₹2500 for this booking'
})
```

## 🎨 UI Components Ready for Development

The platform includes placeholder sections for:
- **Vehicle Management**: Listing, search, filters
- **Booking Management**: Creation, tracking, offers
- **User Dashboard**: Profile, bookings, vehicles
- **Admin Panel**: User management, analytics

## 🔄 Next Steps

1. **Phase 2**: Implement vehicle listing components
2. **Phase 3**: Build booking management interface
3. **Phase 4**: Add offer/counteroffer UI
4. **Phase 5**: Integrate payment processing
5. **Phase 6**: Add advanced features (reviews, notifications, maps)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 Database Schema Summary

- **8 Tables**: Complete relational structure
- **UUID Primary Keys**: Scalable and secure
- **Foreign Key Relationships**: Proper data integrity
- **Status Enums**: Controlled state management
- **Timestamps**: Full audit trail
- **Flexible Design**: Easy to extend

## 🚀 Ready for Production

The core infrastructure is complete and ready for:
- Frontend component development
- Payment gateway integration
- Real-time features
- Mobile app development
- Advanced analytics

---

**Status**: ✅ Core Infrastructure Complete  
**Next Phase**: Frontend Component Development  
**Estimated Time to MVP**: 2-3 weeks
