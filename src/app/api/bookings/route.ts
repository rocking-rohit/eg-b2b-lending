import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/bookings - Get all bookings with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*)
      `)

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId)
    }
    if (status) {
      query = query.eq('booking_status', status)
    }
    if (fromDate) {
      query = query.gte('from_date', fromDate)
    }
    if (toDate) {
      query = query.lte('to_date', toDate)
    }

    const { data: bookings, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      vehicle_id,
      guest_name,
      guest_email,
      guest_phone,
      from_location,
      to_location,
      from_date,
      to_date,
      from_time,
      to_time,
      booking_status,
      total_price,
      estimated_distance,
      special_requirements
    } = body

    if (!vehicle_id || !from_location || !to_location || !from_date || !to_date || !from_time || !to_time) {
      return NextResponse.json(
        { error: 'vehicle_id, from_location, to_location, from_date, to_date, from_time, and to_time are required' },
        { status: 400 }
      )
    }

    // Check if user is provided or guest details are provided
    if (!user_id && (!guest_name || !guest_email)) {
      return NextResponse.json(
        { error: 'Either user_id or guest details (guest_name, guest_email) are required' },
        { status: 400 }
      )
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user_id || null,
        vehicle_id: vehicle_id,
        guest_name: guest_name,
        guest_email: guest_email,
        guest_phone: guest_phone,
        from_location: from_location,
        to_location: to_location,
        from_date: from_date,
        to_date: to_date,
        from_time: from_time,
        to_time: to_time,
        booking_status: booking_status || 'pending',
        total_price: total_price ? parseFloat(total_price) : null,
        estimated_distance: estimated_distance ? parseInt(estimated_distance) : null,
        special_requirements: special_requirements
      })
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
