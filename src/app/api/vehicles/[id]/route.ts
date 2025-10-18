import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/vehicles/[id] - Get vehicle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        owner:users(*),
        bookings:bookings(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// PUT /api/vehicles/[id] - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      licensePlate,
      size,
      transmission,
      fuelType,
      kmsDriven,
      freeKms,
      pricePerKmAfter,
      airConditioning,
      numberOfSeats,
      licenseTypeRequired,
      status,
      imageUrl,
      description,
      dailyRate
    } = body

    const updateData: Record<string, unknown> = {}
    
    if (name !== undefined) updateData.name = name
    if (licensePlate !== undefined) updateData.license_plate = licensePlate
    if (size !== undefined) updateData.size = size
    if (transmission !== undefined) updateData.transmission = transmission
    if (fuelType !== undefined) updateData.fuel_type = fuelType
    if (kmsDriven !== undefined) updateData.kms_driven = kmsDriven
    if (freeKms !== undefined) updateData.free_kms = freeKms
    if (pricePerKmAfter !== undefined) updateData.price_per_km_after = pricePerKmAfter
    if (airConditioning !== undefined) updateData.air_conditioning = airConditioning
    if (numberOfSeats !== undefined) updateData.number_of_seats = numberOfSeats
    if (licenseTypeRequired !== undefined) updateData.license_type_required = licenseTypeRequired
    if (status !== undefined) updateData.status = status
    if (imageUrl !== undefined) updateData.image_url = imageUrl
    if (description !== undefined) updateData.description = description
    if (dailyRate !== undefined) updateData.daily_rate = parseFloat(dailyRate)

    updateData.updated_at = new Date().toISOString()

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        owner:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles/[id] - Delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
