
import mongoose, { Document, Schema } from 'mongoose';

export interface IExpenditure extends Document {
    name: string;
    amount: number;
    description: string;
    date: Date;
}

const ExpenditureSchema: Schema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now },
});

export interface IExpense extends Document {
  name: string;
  amount: number;
  expenditures: IExpenditure[];
  userId: mongoose.Schema.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  expenditures: [ExpenditureSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
