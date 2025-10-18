import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/offers - Get all offers with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const offeredByUserId = searchParams.get('offeredByUserId')
    const status = searchParams.get('status')

    let query = supabase
      .from('offers')
      .select(`
        *,
        booking:bookings(*),
        offered_by_user:users(*),
        counteroffers:counteroffers(*)
      `)

    // Apply filters
    if (bookingId) {
      query = query.eq('booking_id', bookingId)
    }
    if (offeredByUserId) {
      query = query.eq('offered_by_user_id', offeredByUserId)
    }
    if (status) {
      query = query.eq('offer_status', status)
    }

    const { data: offers, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

// POST /api/offers - Create a new offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      offeredByUserId,
      offerAmount,
      message,
      expiresAt
    } = body

    if (!bookingId || !offeredByUserId || !offerAmount) {
      return NextResponse.json(
        { error: 'bookingId, offeredByUserId, and offerAmount are required' },
        { status: 400 }
      )
    }

    // Check if booking exists and is in a valid state for offers
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('booking_status')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.booking_status !== 'pending') {
      return NextResponse.json(
        { error: 'Offers can only be made on pending bookings' },
        { status: 400 }
      )
    }

    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        booking_id: bookingId,
        offered_by_user_id: offeredByUserId,
        offer_amount: parseFloat(offerAmount),
        message,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        offer_status: 'pending'
      })
      .select(`
        *,
        booking:bookings(*),
        offered_by_user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
