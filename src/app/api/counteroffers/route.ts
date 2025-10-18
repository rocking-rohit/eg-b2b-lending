import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/counteroffers - Get all counteroffers with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offerId = searchParams.get('offerId')
    const counteredByUserId = searchParams.get('counteredByUserId')
    const status = searchParams.get('status')

    let query = supabase
      .from('counteroffers')
      .select(`
        *,
        offer:offers(*),
        countered_by_user:users(*)
      `)

    // Apply filters
    if (offerId) {
      query = query.eq('offer_id', offerId)
    }
    if (counteredByUserId) {
      query = query.eq('countered_by_user_id', counteredByUserId)
    }
    if (status) {
      query = query.eq('counteroffer_status', status)
    }

    const { data: counteroffers, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(counteroffers)
  } catch (error) {
    console.error('Error fetching counteroffers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counteroffers' },
      { status: 500 }
    )
  }
}

// POST /api/counteroffers - Create a new counteroffer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      offerId,
      counteredByUserId,
      counterofferAmount,
      message,
      expiresAt
    } = body

    if (!offerId || !counteredByUserId || !counterofferAmount) {
      return NextResponse.json(
        { error: 'offerId, counteredByUserId, and counterofferAmount are required' },
        { status: 400 }
      )
    }

    // Check if offer exists and is in a valid state for counteroffers
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('offer_status')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }

    if (offer.offer_status !== 'pending') {
      return NextResponse.json(
        { error: 'Counteroffers can only be made on pending offers' },
        { status: 400 }
      )
    }

    const { data: counteroffer, error } = await supabase
      .from('counteroffers')
      .insert({
        offer_id: offerId,
        countered_by_user_id: counteredByUserId,
        counteroffer_amount: parseFloat(counterofferAmount),
        message,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        counteroffer_status: 'pending'
      })
      .select(`
        *,
        offer:offers(*),
        countered_by_user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // Update the original offer status to 'countered'
    await supabase
      .from('offers')
      .update({ 
        offer_status: 'countered',
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)

    return NextResponse.json(counteroffer, { status: 201 })
  } catch (error) {
    console.error('Error creating counteroffer:', error)
    return NextResponse.json(
      { error: 'Failed to create counteroffer' },
      { status: 500 }
    )
  }
}
