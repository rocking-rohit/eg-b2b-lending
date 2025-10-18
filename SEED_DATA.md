# 🌱 Seed Data Guide

This guide explains how to populate your car lending platform database with sample data for development and testing.

## 📊 What's Included

The seed data includes:

### 👥 **Users (5 users)**
- **John Doe** - TechCorp Solutions (Both borrower & lender)
- **Sarah Wilson** - Wilson Motors (Lender)
- **Mike Chen** - Chen Enterprises (Borrower)
- **Emma Rodriguez** - Rodriguez Fleet (Lender)
- **Alex Kumar** - Kumar Logistics (Borrower)

### 🚗 **Vehicles (6 vehicles)**
- **Toyota Camry 2023** - Medium sedan, automatic, petrol
- **Honda Civic 2022** - Small car, manual, petrol
- **BMW X5 2023** - Large SUV, automatic, petrol
- **Tesla Model 3 2023** - Electric vehicle, automatic
- **Ford Transit Van 2022** - XL van, manual, diesel
- **Mercedes-Benz E-Class 2023** - Luxury sedan, automatic

### 📅 **Bookings (4 bookings)**
- **Confirmed booking** - John's airport pickup
- **Pending booking** - Alex's LA trip (with offers)
- **Guest booking** - Robert's Miami trip
- **In-progress booking** - Executive airport service

### 💰 **Offers & Counteroffers**
- **2 pending offers** for Alex's booking
- **1 counteroffer** negotiation in progress

### 💳 **Payments (3 payments)**
- **Completed payments** for confirmed bookings
- **Pending payment** for in-progress booking

### ⭐ **Reviews (2 reviews)**
- **5-star review** for Toyota Camry
- **4-star review** for BMW X5

### 🔔 **Notifications (3 notifications)**
- **Offer received** notification
- **Offer countered** notification
- **Booking confirmed** notification

## 🚀 How to Use

### Method 1: SQL Script (Recommended)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste the contents of `seed.sql`
4. Click **Run** to execute the script

### Method 2: TypeScript Script
1. Make sure you have your environment variables set in `.env.local`
2. Install tsx if not already installed:
   ```bash
   npm install tsx --save-dev
   ```
3. Run the seed script:
   ```bash
   npm run seed
   ```

## 🔧 Environment Setup

Before running the TypeScript seed script, ensure you have:

```env
# In your .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📋 Sample Data Details

### User Types
- **Borrowers**: Users who book vehicles
- **Lenders**: Users who list vehicles for rent
- **Both**: Users who can both book and list vehicles

### Vehicle Categories
- **Small**: Compact cars (Honda Civic)
- **Medium**: Sedans (Toyota Camry, Tesla Model 3)
- **Large**: SUVs and luxury cars (BMW X5, Mercedes E-Class)
- **XL**: Vans and large vehicles (Ford Transit)

### Booking Statuses
- **Pending**: Awaiting confirmation
- **Confirmed**: Approved and ready
- **In Progress**: Currently active
- **Completed**: Finished successfully
- **Cancelled**: Cancelled by user

### Offer Statuses
- **Pending**: Awaiting response
- **Accepted**: Offer accepted
- **Rejected**: Offer declined
- **Countered**: Counteroffer made

## 🎯 Testing Scenarios

With this seed data, you can test:

1. **User Management**
   - View different user types
   - Test user verification status

2. **Vehicle Discovery**
   - Browse vehicles by type, fuel, transmission
   - Filter by price range and features

3. **Booking System**
   - Create new bookings
   - View existing bookings
   - Test guest vs registered user bookings

4. **Offer System**
   - Make offers on pending bookings
   - Create counteroffers
   - Accept/reject offers

5. **Payment Processing**
   - View payment statuses
   - Test different payment methods

6. **Review System**
   - View existing reviews
   - Test review creation

## 🧹 Clearing Data

To clear all seed data and start fresh:

```sql
-- Run in Supabase SQL Editor
DELETE FROM counteroffers;
DELETE FROM offers;
DELETE FROM payments;
DELETE FROM reviews;
DELETE FROM notifications;
DELETE FROM bookings;
DELETE FROM vehicles;
DELETE FROM users;
```

## 🔄 Resetting Data

To reset to seed data:

1. Clear existing data (see above)
2. Run the seed script again

## 📈 Customizing Data

You can modify the seed data by:

1. **Editing `seed.sql`** - Change the SQL insert statements
2. **Editing `scripts/seed.ts`** - Modify the TypeScript data arrays
3. **Adding more data** - Extend the arrays with additional records

## 🎉 Next Steps

After seeding your database:

1. **Start the development server**: `npm run dev`
2. **Visit the platform**: `http://localhost:3005`
3. **Test the features**:
   - Browse vehicles
   - Create bookings
   - Make offers
   - Test the negotiation system

The platform is now ready for development and testing with realistic sample data!
