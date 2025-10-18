import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/users - Get all users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        vehicles:vehicles(*),
        bookings:bookings(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password,
      name, 
      company,
      first_name,
      last_name,
      phone_number,
      company_name,
      company_address,
      company_phone,
      tax_number,
      user_type = 'borrower',
      is_verified = false
    } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password,
        name,
        company,
        first_name,
        last_name,
        phone_number,
        company_name,
        company_address,
        company_phone,
        tax_number,
        user_type,
        is_verified
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
