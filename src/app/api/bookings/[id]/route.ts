import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/bookings/[id] - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*),
        offers:offers(*),
        payments:payments(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      guestName,
      guestEmail,
      guestPhone,
      fromLocation,
      toLocation,
      fromDate,
      toDate,
      fromTime,
      toTime,
      bookingStatus,
      totalPrice,
      estimatedDistance,
      specialRequirements
    } = body

    const updateData: Record<string, unknown> = {}
    
    if (guestName !== undefined) updateData.guest_name = guestName
    if (guestEmail !== undefined) updateData.guest_email = guestEmail
    if (guestPhone !== undefined) updateData.guest_phone = guestPhone
    if (fromLocation !== undefined) updateData.from_location = fromLocation
    if (toLocation !== undefined) updateData.to_location = toLocation
    if (fromDate !== undefined) updateData.from_date = fromDate
    if (toDate !== undefined) updateData.to_date = toDate
    if (fromTime !== undefined) updateData.from_time = fromTime
    if (toTime !== undefined) updateData.to_time = toTime
    if (bookingStatus !== undefined) updateData.booking_status = bookingStatus
    if (totalPrice !== undefined) updateData.total_price = parseFloat(totalPrice)
    if (estimatedDistance !== undefined) updateData.estimated_distance = parseInt(estimatedDistance)
    if (specialRequirements !== undefined) updateData.special_requirements = specialRequirements

    updateData.updated_at = new Date().toISOString()

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Instead of deleting, update status to cancelled
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ 
        booking_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Booking cancelled successfully', booking })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
