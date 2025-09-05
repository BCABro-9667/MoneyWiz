
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { getUserIdFromToken } from '@/lib/auth';
import mongoose from 'mongoose';

type Params = {
  params: {
    id: string;
  };
};

// GET a single expense
export async function GET(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid expense ID' }, { status: 400 });
        }

        const expense = await Expense.findOne({ _id: params.id, userId });

        if (!expense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json(expense, { status: 200 });
    } catch (error) {
        console.error(`Error fetching expense ${params.id}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE an expense
export async function PUT(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid expense ID' }, { status: 400 });
        }

        const { name, amount } = await request.json();
        
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: params.id, userId },
            { name, amount },
            { new: true }
        );

        if (!updatedExpense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json(updatedExpense, { status: 200 });
    } catch (error) {
        console.error(`Error updating expense ${params.id}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE an expense
export async function DELETE(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid expense ID' }, { status: 400 });
        }

        const deletedExpense = await Expense.findOneAndDelete({ _id: params.id, userId });

        if (!deletedExpense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Expense deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error(`Error deleting expense ${params.id}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
