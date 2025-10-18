#!/usr/bin/env tsx

/**
 * Car Lending Platform - Database Seed Script
 * 
 * This script populates the database with sample data for development and testing.
 * Run with: npx tsx scripts/seed.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease set these in your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Sample data
const users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    company: 'TechCorp Solutions',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1-555-0101',
    company_name: 'TechCorp Solutions',
    company_address: '123 Tech Street, San Francisco, CA 94105',
    company_phone: '+1-555-0100',
    user_type: 'both',
    is_verified: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    company: 'Wilson Motors',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone_number: '+1-555-0102',
    company_name: 'Wilson Motors',
    company_address: '456 Auto Avenue, Los Angeles, CA 90210',
    company_phone: '+1-555-0200',
    user_type: 'lender',
    is_verified: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'mike.chen@example.com',
    name: 'Mike Chen',
    company: 'Chen Enterprises',
    first_name: 'Mike',
    last_name: 'Chen',
    phone_number: '+1-555-0103',
    company_name: 'Chen Enterprises',
    company_address: '789 Business Blvd, New York, NY 10001',
    company_phone: '+1-555-0300',
    user_type: 'borrower',
    is_verified: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'emma.rodriguez@example.com',
    name: 'Emma Rodriguez',
    company: 'Rodriguez Fleet',
    first_name: 'Emma',
    last_name: 'Rodriguez',
    phone_number: '+1-555-0104',
    company_name: 'Rodriguez Fleet',
    company_address: '321 Fleet Street, Miami, FL 33101',
    company_phone: '+1-555-0400',
    user_type: 'lender',
    is_verified: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'alex.kumar@example.com',
    name: 'Alex Kumar',
    company: 'Kumar Logistics',
    first_name: 'Alex',
    last_name: 'Kumar',
    phone_number: '+1-555-0105',
    company_name: 'Kumar Logistics',
    company_address: '654 Logistics Lane, Chicago, IL 60601',
    company_phone: '+1-555-0500',
    user_type: 'borrower',
    is_verified: false
  }
]

const vehicles = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    owner_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Toyota Camry 2023',
    license_plate: 'ABC-1234',
    size: 'Medium',
    transmission: 'automatic',
    fuel_type: 'petrol',
    kms_driven: 15000,
    free_kms: 100,
    price_per_km_after: 2.50,
    air_conditioning: true,
    number_of_seats: 5,
    license_type_required: 'B',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    description: 'Comfortable and reliable sedan perfect for business trips. Well-maintained with low mileage.',
    daily_rate: 1200.00
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    owner_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Honda Civic 2022',
    license_plate: 'XYZ-5678',
    size: 'Small',
    transmission: 'manual',
    fuel_type: 'petrol',
    kms_driven: 25000,
    free_kms: 100,
    price_per_km_after: 2.00,
    air_conditioning: true,
    number_of_seats: 5,
    license_type_required: 'B',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    description: 'Fuel-efficient compact car ideal for city driving. Manual transmission for better control.',
    daily_rate: 800.00
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    owner_id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'BMW X5 2023',
    license_plate: 'BMW-9999',
    size: 'Large',
    transmission: 'automatic',
    fuel_type: 'petrol',
    kms_driven: 8000,
    free_kms: 150,
    price_per_km_after: 3.50,
    air_conditioning: true,
    number_of_seats: 7,
    license_type_required: 'B',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    description: 'Luxury SUV with premium features. Perfect for executive travel and family trips.',
    daily_rate: 2500.00
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    owner_id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Tesla Model 3 2023',
    license_plate: 'TES-1234',
    size: 'Medium',
    transmission: 'automatic',
    fuel_type: 'electric',
    kms_driven: 12000,
    free_kms: 200,
    price_per_km_after: 1.50,
    air_conditioning: true,
    number_of_seats: 5,
    license_type_required: 'B',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    description: 'Electric vehicle with autopilot features. Zero emissions and cutting-edge technology.',
    daily_rate: 1800.00
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    owner_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Ford Transit Van 2022',
    license_plate: 'VAN-5555',
    size: 'XL',
    transmission: 'manual',
    fuel_type: 'diesel',
    kms_driven: 30000,
    free_kms: 200,
    price_per_km_after: 4.00,
    air_conditioning: true,
    number_of_seats: 12,
    license_type_required: 'C',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
    description: 'Large cargo van perfect for moving and delivery services. High capacity and reliable.',
    daily_rate: 1500.00
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440006',
    owner_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Mercedes-Benz E-Class 2023',
    license_plate: 'MBE-7777',
    size: 'Large',
    transmission: 'automatic',
    fuel_type: 'petrol',
    kms_driven: 5000,
    free_kms: 150,
    price_per_km_after: 4.00,
    air_conditioning: true,
    number_of_seats: 5,
    license_type_required: 'B',
    status: 'booked',
    image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    description: 'Premium luxury sedan with advanced safety features. Perfect for business executives.',
    daily_rate: 2200.00
  }
]

const bookings = [
  {
    id: '750e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    vehicle_id: '650e8400-e29b-41d4-a716-446655440001',
    from_location: 'San Francisco Airport',
    to_location: 'Downtown San Francisco',
    from_date: '2024-01-15',
    to_date: '2024-01-15',
    from_time: '10:00:00',
    to_time: '18:00:00',
    booking_status: 'confirmed',
    total_price: 1200.00,
    estimated_distance: 50,
    special_requirements: 'Need child seat for 3-year-old'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    vehicle_id: '650e8400-e29b-41d4-a716-446655440002',
    from_location: 'Los Angeles Convention Center',
    to_location: 'Hollywood Hills',
    from_date: '2024-01-20',
    to_date: '2024-01-22',
    from_time: '09:00:00',
    to_time: '17:00:00',
    booking_status: 'pending',
    total_price: 1600.00,
    estimated_distance: 80,
    special_requirements: 'Prefer automatic transmission'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440003',
    user_id: null,
    vehicle_id: '650e8400-e29b-41d4-a716-446655440003',
    guest_name: 'Robert Smith',
    guest_email: 'robert.smith@email.com',
    guest_phone: '+1-555-9999',
    from_location: 'Miami International Airport',
    to_location: 'South Beach',
    from_date: '2024-01-25',
    to_date: '2024-01-25',
    from_time: '14:00:00',
    to_time: '22:00:00',
    booking_status: 'confirmed',
    total_price: 2500.00,
    estimated_distance: 30,
    special_requirements: 'Guest booking - contact via email'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440004',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    vehicle_id: '650e8400-e29b-41d4-a716-446655440006',
    from_location: 'Chicago Downtown',
    to_location: 'O\'Hare Airport',
    from_date: '2024-01-18',
    to_date: '2024-01-18',
    from_time: '08:00:00',
    to_time: '12:00:00',
    booking_status: 'in_progress',
    total_price: 880.00,
    estimated_distance: 25,
    special_requirements: 'Executive pickup service'
  }
]

const offers = [
  {
    id: '850e8400-e29b-41d4-a716-446655440001',
    booking_id: '750e8400-e29b-41d4-a716-446655440002',
    offered_by_user_id: '550e8400-e29b-41d4-a716-446655440001',
    offer_amount: 1400.00,
    offer_status: 'pending',
    message: 'I can offer ₹1400 for this booking. Available for immediate payment.',
    expires_at: '2024-01-19T23:59:59Z'
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440002',
    booking_id: '750e8400-e29b-41d4-a716-446655440002',
    offered_by_user_id: '550e8400-e29b-41d4-a716-446655440003',
    offer_amount: 1500.00,
    offer_status: 'pending',
    message: 'I can match the asking price. When can we confirm?',
    expires_at: '2024-01-19T23:59:59Z'
  }
]

const counteroffers = [
  {
    id: '950e8400-e29b-41d4-a716-446655440001',
    offer_id: '850e8400-e29b-41d4-a716-446655440001',
    countered_by_user_id: '550e8400-e29b-41d4-a716-446655440005',
    counteroffer_amount: 1450.00,
    counteroffer_status: 'pending',
    message: 'I can meet you halfway at ₹1450. This is my best offer.',
    expires_at: '2024-01-20T23:59:59Z'
  }
]

const payments = [
  {
    id: 'a50e8400-e29b-41d4-a716-446655440001',
    booking_id: '750e8400-e29b-41d4-a716-446655440001',
    amount_paid: 1200.00,
    payment_method: 'credit_card',
    payment_status: 'completed',
    transaction_id: 'txn_1234567890'
  },
  {
    id: 'a50e8400-e29b-41d4-a716-446655440002',
    booking_id: '750e8400-e29b-41d4-a716-446655440003',
    amount_paid: 2500.00,
    payment_method: 'paypal',
    payment_status: 'completed',
    transaction_id: 'pp_9876543210'
  },
  {
    id: 'a50e8400-e29b-41d4-a716-446655440003',
    booking_id: '750e8400-e29b-41d4-a716-446655440004',
    amount_paid: 880.00,
    payment_method: 'bank_transfer',
    payment_status: 'pending',
    transaction_id: 'bt_5555666677'
  }
]

const reviews = [
  {
    id: 'b50e8400-e29b-41d4-a716-446655440001',
    booking_id: '750e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    vehicle_id: '650e8400-e29b-41d4-a716-446655440001',
    rating: 5,
    review_text: 'Excellent service! The car was clean, comfortable, and the owner was very professional. Highly recommended!',
    review_date: '2024-01-16'
  },
  {
    id: 'b50e8400-e29b-41d4-a716-446655440002',
    booking_id: '750e8400-e29b-41d4-a716-446655440003',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    vehicle_id: '650e8400-e29b-41d4-a716-446655440003',
    rating: 4,
    review_text: 'Great vehicle and smooth booking process. The Tesla was in perfect condition.',
    review_date: '2024-01-26'
  }
]

const notifications = [
  {
    id: 'c50e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    message: 'You have received a new offer for your booking #750e8400-e29b-41d4-a716-446655440002',
    notification_type: 'offer_received',
    is_read: false,
    related_entity_type: 'booking',
    related_entity_id: '750e8400-e29b-41d4-a716-446655440002'
  },
  {
    id: 'c50e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    message: 'Your offer for booking #750e8400-e29b-41d4-a716-446655440002 has been countered',
    notification_type: 'offer_countered',
    is_read: false,
    related_entity_type: 'offer',
    related_entity_id: '850e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: 'c50e8400-e29b-41d4-a716-446655440003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    message: 'Your booking #750e8400-e29b-41d4-a716-446655440001 has been confirmed',
    notification_type: 'booking_confirmed',
    is_read: true,
    related_entity_type: 'booking',
    related_entity_id: '750e8400-e29b-41d4-a716-446655440001'
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Clear existing data (optional)
    console.log('🧹 Clearing existing data...')
    await supabase.from('counteroffers').delete().neq('id', '')
    await supabase.from('offers').delete().neq('id', '')
    await supabase.from('payments').delete().neq('id', '')
    await supabase.from('reviews').delete().neq('id', '')
    await supabase.from('notifications').delete().neq('id', '')
    await supabase.from('bookings').delete().neq('id', '')
    await supabase.from('vehicles').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')

    // Insert users
    console.log('👥 Inserting users...')
    const { error: usersError } = await supabase.from('users').insert(users)
    if (usersError) throw usersError
    console.log(`✅ Inserted ${users.length} users`)

    // Insert vehicles
    console.log('🚗 Inserting vehicles...')
    const { error: vehiclesError } = await supabase.from('vehicles').insert(vehicles)
    if (vehiclesError) throw vehiclesError
    console.log(`✅ Inserted ${vehicles.length} vehicles`)

    // Insert bookings
    console.log('📅 Inserting bookings...')
    const { error: bookingsError } = await supabase.from('bookings').insert(bookings)
    if (bookingsError) throw bookingsError
    console.log(`✅ Inserted ${bookings.length} bookings`)

    // Insert offers
    console.log('💰 Inserting offers...')
    const { error: offersError } = await supabase.from('offers').insert(offers)
    if (offersError) throw offersError
    console.log(`✅ Inserted ${offers.length} offers`)

    // Insert counteroffers
    console.log('🔄 Inserting counteroffers...')
    const { error: counteroffersError } = await supabase.from('counteroffers').insert(counteroffers)
    if (counteroffersError) throw counteroffersError
    console.log(`✅ Inserted ${counteroffers.length} counteroffers`)

    // Insert payments
    console.log('💳 Inserting payments...')
    const { error: paymentsError } = await supabase.from('payments').insert(payments)
    if (paymentsError) throw paymentsError
    console.log(`✅ Inserted ${payments.length} payments`)

    // Insert reviews
    console.log('⭐ Inserting reviews...')
    const { error: reviewsError } = await supabase.from('reviews').insert(reviews)
    if (reviewsError) throw reviewsError
    console.log(`✅ Inserted ${reviews.length} reviews`)

    // Insert notifications
    console.log('🔔 Inserting notifications...')
    const { error: notificationsError } = await supabase.from('notifications').insert(notifications)
    if (notificationsError) throw notificationsError
    console.log(`✅ Inserted ${notifications.length} notifications`)

    // Get final counts
    console.log('\n📊 Final database counts:')
    const { data: counts } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
    
    const { data: vehicleCounts } = await supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
    
    const { data: bookingCounts } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })

    console.log(`👥 Users: ${counts?.length || 0}`)
    console.log(`🚗 Vehicles: ${vehicleCounts?.length || 0}`)
    console.log(`📅 Bookings: ${bookingCounts?.length || 0}`)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\nYou can now:')
    console.log('  • View users and vehicles in the web interface')
    console.log('  • Test booking creation and management')
    console.log('  • Try the offer and counteroffer system')
    console.log('  • Explore all the platform features')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
