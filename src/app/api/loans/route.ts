import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/loans - Get all loan applications
export async function GET() {
  try {
    const { data: loans, error } = await supabase
      .from('loans')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(loans)
  } catch (error) {
    console.error('Error fetching loans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loans' },
      { status: 500 }
    )
  }
}

// POST /api/loans - Create a new loan application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, interestRate, termMonths } = body

    if (!userId || !amount || !interestRate || !termMonths) {
      return NextResponse.json(
        { error: 'userId, amount, interestRate, and termMonths are required' },
        { status: 400 }
      )
    }

    const { data: loan, error } = await supabase
      .from('loans')
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        interest_rate: parseFloat(interestRate),
        term_months: parseInt(termMonths),
        status: 'pending'
      })
      .select(`
        *,
        user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error('Error creating loan application:', error)
    return NextResponse.json(
      { error: 'Failed to create loan application' },
      { status: 500 }
    )
  }
}
