-- Car Lending Platform - Seed Data
-- Run this script in your Supabase SQL Editor to populate the database with sample data

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM counteroffers;
-- DELETE FROM offers;
-- DELETE FROM payments;
-- DELETE FROM reviews;
-- DELETE FROM notifications;
-- DELETE FROM bookings;
-- DELETE FROM vehicles;
-- DELETE FROM users;

-- Insert sample users
INSERT INTO users (
  id, email, name, company, first_name, last_name, phone_number, 
  company_name, company_address, company_phone, user_type, is_verified
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'john.doe@example.com',
  'John Doe',
  'TechCorp Solutions',
  'John',
  'Doe',
  '+1-555-0101',
  'TechCorp Solutions',
  '123 Tech Street, San Francisco, CA 94105',
  '+1-555-0100',
  'both',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'sarah.wilson@example.com',
  'Sarah Wilson',
  'Wilson Motors',
  'Sarah',
  'Wilson',
  '+1-555-0102',
  'Wilson Motors',
  '456 Auto Avenue, Los Angeles, CA 90210',
  '+1-555-0200',
  'lender',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'mike.chen@example.com',
  'Mike Chen',
  'Chen Enterprises',
  'Mike',
  'Chen',
  '+1-555-0103',
  'Chen Enterprises',
  '789 Business Blvd, New York, NY 10001',
  '+1-555-0300',
  'borrower',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'emma.rodriguez@example.com',
  'Emma Rodriguez',
  'Rodriguez Fleet',
  'Emma',
  'Rodriguez',
  '+1-555-0104',
  'Rodriguez Fleet',
  '321 Fleet Street, Miami, FL 33101',
  '+1-555-0400',
  'lender',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'alex.kumar@example.com',
  'Alex Kumar',
  'Kumar Logistics',
  'Alex',
  'Kumar',
  '+1-555-0105',
  'Kumar Logistics',
  '654 Logistics Lane, Chicago, IL 60601',
  '+1-555-0500',
  'borrower',
  false
);

-- Insert sample vehicles
INSERT INTO vehicles (
  id, owner_id, name, license_plate, size, transmission, fuel_type,
  kms_driven, free_kms, price_per_km_after, air_conditioning, number_of_seats,
  license_type_required, status, image_url, description, daily_rate
) VALUES 
(
  '650e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Toyota Camry 2023',
  'ABC-1234',
  'Medium',
  'automatic',
  'petrol',
  15000,
  100,
  2.50,
  true,
  5,
  'B',
  'available',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
  'Comfortable and reliable sedan perfect for business trips. Well-maintained with low mileage.',
  1200.00
),
(
  '650e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440002',
  'Honda Civic 2022',
  'XYZ-5678',
  'Small',
  'manual',
  'petrol',
  25000,
  100,
  2.00,
  true,
  5,
  'B',
  'available',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
  'Fuel-efficient compact car ideal for city driving. Manual transmission for better control.',
  800.00
),
(
  '650e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  'BMW X5 2023',
  'BMW-9999',
  'Large',
  'automatic',
  'petrol',
  8000,
  150,
  3.50,
  true,
  7,
  'B',
  'available',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
  'Luxury SUV with premium features. Perfect for executive travel and family trips.',
  2500.00
),
(
  '650e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440004',
  'Tesla Model 3 2023',
  'TES-1234',
  'Medium',
  'automatic',
  'electric',
  12000,
  200,
  1.50,
  true,
  5,
  'B',
  'available',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
  'Electric vehicle with autopilot features. Zero emissions and cutting-edge technology.',
  1800.00
),
(
  '650e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440001',
  'Ford Transit Van 2022',
  'VAN-5555',
  'XL',
  'manual',
  'diesel',
  30000,
  200,
  4.00,
  true,
  12,
  'C',
  'available',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
  'Large cargo van perfect for moving and delivery services. High capacity and reliable.',
  1500.00
),
(
  '650e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440002',
  'Mercedes-Benz E-Class 2023',
  'MBE-7777',
  'Large',
  'automatic',
  'petrol',
  5000,
  150,
  4.00,
  true,
  5,
  'B',
  'booked',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
  'Premium luxury sedan with advanced safety features. Perfect for business executives.',
  2200.00
);

-- Insert sample bookings
INSERT INTO bookings (
  id, user_id, vehicle_id, from_location, to_location, from_date, to_date,
  from_time, to_time, booking_status, total_price, estimated_distance, special_requirements
) VALUES 
(
  '750e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440003',
  '650e8400-e29b-41d4-a716-446655440001',
  'San Francisco Airport',
  'Downtown San Francisco',
  '2024-01-15',
  '2024-01-15',
  '10:00:00',
  '18:00:00',
  'confirmed',
  1200.00,
  50,
  'Need child seat for 3-year-old'
),
(
  '750e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440005',
  '650e8400-e29b-41d4-a716-446655440002',
  'Los Angeles Convention Center',
  'Hollywood Hills',
  '2024-01-20',
  '2024-01-22',
  '09:00:00',
  '17:00:00',
  'pending',
  1600.00,
  80,
  'Prefer automatic transmission'
),
(
  '750e8400-e29b-41d4-a716-446655440003',
  NULL,
  '650e8400-e29b-41d4-a716-446655440003',
  'Miami International Airport',
  'South Beach',
  '2024-01-25',
  '2024-01-25',
  '14:00:00',
  '22:00:00',
  'confirmed',
  2500.00,
  30,
  'Guest booking - contact via email'
),
(
  '750e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  '650e8400-e29b-41d4-a716-446655440006',
  'Chicago Downtown',
  'O\'Hare Airport',
  '2024-01-18',
  '2024-01-18',
  '08:00:00',
  '12:00:00',
  'in_progress',
  880.00,
  25,
  'Executive pickup service'
);

-- Insert guest booking details
UPDATE bookings 
SET guest_name = 'Robert Smith', 
    guest_email = 'robert.smith@email.com', 
    guest_phone = '+1-555-9999'
WHERE id = '750e8400-e29b-41d4-a716-446655440003';

-- Insert sample offers
INSERT INTO offers (
  id, booking_id, offered_by_user_id, offer_amount, offer_status, message, expires_at
) VALUES 
(
  '850e8400-e29b-41d4-a716-446655440001',
  '750e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  1400.00,
  'pending',
  'I can offer ₹1400 for this booking. Available for immediate payment.',
  '2024-01-19 23:59:59'
),
(
  '850e8400-e29b-41d4-a716-446655440002',
  '750e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  1500.00,
  'pending',
  'I can match the asking price. When can we confirm?',
  '2024-01-19 23:59:59'
);

-- Insert sample counteroffers
INSERT INTO counteroffers (
  id, offer_id, countered_by_user_id, counteroffer_amount, counteroffer_status, message, expires_at
) VALUES 
(
  '950e8400-e29b-41d4-a716-446655440001',
  '850e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440005',
  1450.00,
  'pending',
  'I can meet you halfway at ₹1450. This is my best offer.',
  '2024-01-20 23:59:59'
);

-- Insert sample payments
INSERT INTO payments (
  id, booking_id, amount_paid, payment_method, payment_status, transaction_id
) VALUES 
(
  'a50e8400-e29b-41d4-a716-446655440001',
  '750e8400-e29b-41d4-a716-446655440001',
  1200.00,
  'credit_card',
  'completed',
  'txn_1234567890'
),
(
  'a50e8400-e29b-41d4-a716-446655440002',
  '750e8400-e29b-41d4-a716-446655440003',
  2500.00,
  'paypal',
  'completed',
  'pp_9876543210'
),
(
  'a50e8400-e29b-41d4-a716-446655440003',
  '750e8400-e29b-41d4-a716-446655440004',
  880.00,
  'bank_transfer',
  'pending',
  'bt_5555666677'
);

-- Insert sample reviews
INSERT INTO reviews (
  id, booking_id, user_id, vehicle_id, rating, review_text, review_date
) VALUES 
(
  'b50e8400-e29b-41d4-a716-446655440001',
  '750e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440003',
  '650e8400-e29b-41d4-a716-446655440001',
  5,
  'Excellent service! The car was clean, comfortable, and the owner was very professional. Highly recommended!',
  '2024-01-16'
),
(
  'b50e8400-e29b-41d4-a716-446655440002',
  '750e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  '650e8400-e29b-41d4-a716-446655440003',
  4,
  'Great vehicle and smooth booking process. The Tesla was in perfect condition.',
  '2024-01-26'
);

-- Insert sample notifications
INSERT INTO notifications (
  id, user_id, message, notification_type, is_read, related_entity_type, related_entity_id
) VALUES 
(
  'c50e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440005',
  'You have received a new offer for your booking #750e8400-e29b-41d4-a716-446655440002',
  'offer_received',
  false,
  'booking',
  '750e8400-e29b-41d4-a716-446655440002'
),
(
  'c50e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'Your offer for booking #750e8400-e29b-41d4-a716-446655440002 has been countered',
  'offer_countered',
  false,
  'offer',
  '850e8400-e29b-41d4-a716-446655440001'
),
(
  'c50e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  'Your booking #750e8400-e29b-41d4-a716-446655440001 has been confirmed',
  'booking_confirmed',
  true,
  'booking',
  '750e8400-e29b-41d4-a716-446655440001'
);

-- Display summary
SELECT 'Seed data inserted successfully!' as status;

-- Show counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Offers', COUNT(*) FROM offers
UNION ALL
SELECT 'Counteroffers', COUNT(*) FROM counteroffers
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
