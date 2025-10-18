import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/offers/[id] - Get offer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: offer, error } = await supabase
      .from('offers')
      .select(`
        *,
        booking:bookings(*),
        offered_by_user:users(*),
        counteroffers:counteroffers(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    )
  }
}

// PUT /api/offers/[id] - Update offer status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { offerStatus, message } = body

    if (!offerStatus) {
      return NextResponse.json(
        { error: 'offerStatus is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'countered']
    if (!validStatuses.includes(offerStatus)) {
      return NextResponse.json(
        { error: 'Invalid offer status' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      offer_status: offerStatus,
      updated_at: new Date().toISOString()
    }

    if (message !== undefined) {
      updateData.message = message
    }

    const { data: offer, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        booking:bookings(*),
        offered_by_user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // If offer is accepted, update the booking status
    if (offerStatus === 'accepted') {
      await supabase
        .from('bookings')
        .update({ 
          booking_status: 'confirmed',
          total_price: offer.offer_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.booking_id)
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    )
  }
}

// DELETE /api/offers/[id] - Delete offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Offer deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    )
  }
}
