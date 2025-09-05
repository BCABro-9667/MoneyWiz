
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { getUserIdFromToken } from '@/lib/auth';
import mongoose from 'mongoose';

type Params = {
  params: {
    id: string; // expenseId
    expenditureId: string;
  };
};

// Update an expenditure
export async function PUT(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.expenditureId)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const { name, amount, description } = await request.json();
        const expense = await Expense.findOne({ _id: params.id, userId });

        if (!expense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }

        const expenditure = expense.expenditures.id(params.expenditureId);
        if (!expenditure) {
            return NextResponse.json({ message: 'Expenditure not found' }, { status: 404 });
        }
        
        if(name) expenditure.name = name;
        if(amount) expenditure.amount = amount;
        if(description !== undefined) expenditure.description = description;

        await expense.save();

        return NextResponse.json(expenditure, { status: 200 });

    } catch (error) {
        console.error(`Error updating expenditure ${params.expenditureId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// Delete an expenditure
export async function DELETE(request: NextRequest, { params }: Params) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.expenditureId)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const expense = await Expense.findOne({ _id: params.id, userId });

        if (!expense) {
            return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
        }
        
        const expenditure = expense.expenditures.id(params.expenditureId);
        if (!expenditure) {
            return NextResponse.json({ message: 'Expenditure not found' }, { status: 404 });
        }

        expenditure.deleteOne();
        
        await expense.save();

        return NextResponse.json({ message: 'Expenditure deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error(`Error deleting expenditure ${params.expenditureId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
