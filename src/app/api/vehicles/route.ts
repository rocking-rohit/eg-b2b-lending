import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/vehicles - Get all vehicles with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const fuelType = searchParams.get('fuelType')
    const transmission = searchParams.get('transmission')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        owner:users(*)
      `)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (fuelType) {
      query = query.eq('fuel_type', fuelType)
    }
    if (transmission) {
      query = query.eq('transmission', transmission)
    }
    if (minPrice) {
      query = query.gte('daily_rate', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('daily_rate', parseFloat(maxPrice))
    }

    const { data: vehicles, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      owner_id,
      name,
      license_plate,
      size,
      transmission,
      fuel_type,
      kms_driven,
      free_kms,
      price_per_km_after,
      air_conditioning,
      number_of_seats,
      license_type_required,
      status,
      image_url,
      description,
      daily_rate
    } = body

    if (!owner_id || !name || !license_plate || !daily_rate) {
      return NextResponse.json(
        { error: 'owner_id, name, license_plate, and daily_rate are required' },
        { status: 400 }
      )
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        owner_id,
        name,
        license_plate,
        size,
        transmission: transmission || 'automatic',
        fuel_type: fuel_type || 'petrol',
        kms_driven: kms_driven || 0,
        free_kms: free_kms || 100,
        price_per_km_after: price_per_km_after || 0.00,
        air_conditioning: air_conditioning !== undefined ? air_conditioning : true,
        number_of_seats: number_of_seats || 5,
        license_type_required: license_type_required || 'B',
        status: status || 'available',
        image_url,
        description,
        daily_rate: parseFloat(daily_rate)
      })
      .select(`
        *,
        owner:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
