import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/loans/[id] - Get loan application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: loan, error } = await supabase
      .from('loans')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Loan application not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(loan)
  } catch (error) {
    console.error('Error fetching loan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loan application' },
      { status: 500 }
    )
  }
}

// PUT /api/loans/[id] - Update loan application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount, interestRate, termMonths, status } = body

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (interestRate !== undefined) updateData.interest_rate = parseFloat(interestRate)
    if (termMonths !== undefined) updateData.term_months = parseInt(termMonths)
    if (status !== undefined) updateData.status = status

    const { data: loan, error } = await supabase
      .from('loans')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        user:users(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(loan)
  } catch (error) {
    console.error('Error updating loan:', error)
    return NextResponse.json(
      { error: 'Failed to update loan application' },
      { status: 500 }
    )
  }
}

// DELETE /api/loans/[id] - Delete loan application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Loan application deleted successfully' })
  } catch (error) {
    console.error('Error deleting loan:', error)
    return NextResponse.json(
      { error: 'Failed to delete loan application' },
      { status: 500 }
    )
  }
}
