# Car Lending Platform - Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
# Note: This project now uses Supabase for car lending platform
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Project API keys > anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Project API keys > service_role → `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema

You'll need to create the following tables in your Supabase project. Run these SQL commands in the Supabase SQL Editor:

### 1. Enhanced Users Table
```sql
-- First, create the basic users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add additional fields for car lending platform
ALTER TABLE users ADD COLUMN IF NOT EXISTS 
  password VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  company_name VARCHAR(255),
  company_address TEXT,
  company_phone VARCHAR(20),
  tax_number VARCHAR(50),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_type VARCHAR(20) DEFAULT 'borrower' CHECK (user_type IN ('borrower', 'lender', 'both')),
  is_verified BOOLEAN DEFAULT FALSE;
```

### 2. Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  size VARCHAR(50), -- Small, Medium, Large, XL
  transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual')),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  kms_driven INTEGER DEFAULT 0,
  free_kms INTEGER DEFAULT 100,
  price_per_km_after DECIMAL(8,2) DEFAULT 0.00,
  air_conditioning BOOLEAN DEFAULT TRUE,
  number_of_seats INTEGER DEFAULT 5,
  license_type_required VARCHAR(50) DEFAULT 'B',
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance', 'unavailable')),
  image_url TEXT,
  description TEXT,
  daily_rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional for guest bookings
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  guest_name VARCHAR(255), -- For non-registered users
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  from_time TIME NOT NULL,
  to_time TIME NOT NULL,
  booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_price DECIMAL(10,2),
  estimated_distance INTEGER, -- in kilometers
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Offers Table
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  offered_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  offer_amount DECIMAL(10,2) NOT NULL,
  offer_status VARCHAR(20) DEFAULT 'pending' CHECK (offer_status IN ('pending', 'accepted', 'rejected', 'countered')),
  offer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Counteroffers Table
```sql
CREATE TABLE counteroffers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  countered_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  counteroffer_amount DECIMAL(10,2) NOT NULL,
  counteroffer_status VARCHAR(20) DEFAULT 'pending' CHECK (counteroffer_status IN ('pending', 'accepted', 'rejected')),
  counteroffer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type VARCHAR(50), -- 'booking', 'offer', 'vehicle', etc.
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Next Steps

1. Set up your Supabase project and get the credentials
2. Add the environment variables to `.env.local`
3. Run the SQL commands above in the Supabase SQL Editor to create all tables
4. The API routes will be configured to work with these new tables
