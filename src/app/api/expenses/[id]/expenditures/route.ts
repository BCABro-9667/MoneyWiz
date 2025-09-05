
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { getUserIdFromToken } from '@/lib/auth';
import mongoose from 'mongoose';

type Params = {
  params: {
    id: string; // expenseId
  };
};

export async function POST(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid expense ID' }, { status: 400 });
        }

        const { name, amount, description } = await request.json();
        if (!name || amount === undefined) {
             return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        
        const expense = await Expense.findOne({ _id: params.id, userId });

        if (!expense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }

        const newExpenditure = {
            name,
            amount,
            description: description || '',
            date: new Date(),
        };

        expense.expenditures.unshift(newExpenditure);
        await expense.save();
        
        return NextResponse.json(expense.expenditures[0], { status: 201 });

    } catch (error) {
        console.error(`Error adding expenditure to expense ${params.id}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
