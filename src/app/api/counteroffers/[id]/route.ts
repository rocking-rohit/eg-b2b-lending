import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/counteroffers/[id] - Get counteroffer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: counteroffer, error } = await supabase
      .from('counteroffers')
      .select(`
        *,
        offer:offers(*),
        countered_by_user:users(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(counteroffer)
  } catch (error) {
    console.error('Error fetching counteroffer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counteroffer' },
      { status: 500 }
    )
  }
}

// PUT /api/counteroffers/[id] - Update counteroffer status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { counterofferStatus, message } = body

    if (!counterofferStatus) {
      return NextResponse.json(
        { error: 'counterofferStatus is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'accepted', 'rejected']
    if (!validStatuses.includes(counterofferStatus)) {
      return NextResponse.json(
        { error: 'Invalid counteroffer status' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      counteroffer_status: counterofferStatus,
      updated_at: new Date().toISOString()
    }

    if (message !== undefined) {
      updateData.message = message
    }

    const { data: counteroffer, error } = await supabase
      .from('counteroffers')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        offer:offers(*),
        countered_by_user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // If counteroffer is accepted, update the booking status and price
    if (counterofferStatus === 'accepted') {
      await supabase
        .from('bookings')
        .update({ 
          booking_status: 'confirmed',
          total_price: counteroffer.counteroffer_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', counteroffer.offer.booking_id)
    }

    return NextResponse.json(counteroffer)
  } catch (error) {
    console.error('Error updating counteroffer:', error)
    return NextResponse.json(
      { error: 'Failed to update counteroffer' },
      { status: 500 }
    )
  }
}

// DELETE /api/counteroffers/[id] - Delete counteroffer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('counteroffers')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Counteroffer deleted successfully' })
  } catch (error) {
    console.error('Error deleting counteroffer:', error)
    return NextResponse.json(
      { error: 'Failed to delete counteroffer' },
      { status: 500 }
    )
  }
}
