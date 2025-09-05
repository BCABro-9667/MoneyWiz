
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { name, amount } = await request.json();

        if (!name || amount === undefined) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newExpense = new Expense({
            name,
            amount,
            userId,
            expenditures: [],
        });

        await newExpense.save();
        return NextResponse.json(newExpense, { status: 201 });

    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
