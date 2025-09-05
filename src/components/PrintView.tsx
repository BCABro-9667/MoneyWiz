import type { Expense } from "@/lib/types";
import { Separator } from "./ui/separator";

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

interface PrintViewProps {
    expense: Expense;
    currentBalance: number;
}

export default function PrintView({ expense, currentBalance }: PrintViewProps) {
    return (
        <div className="hidden print:block p-8 font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2">MoneyWiz Expense Report</h1>
                <p className="text-lg text-gray-600">
                    Report for: <span className="font-semibold">{expense.name}</span>
                </p>
                <p className="text-sm text-gray-500">
                    Generated on: {new Date().toLocaleDateString('en-GB')}
                </p>
            </header>
            
            <div className="grid grid-cols-2 gap-8 mb-8 text-lg">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold text-2xl">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">Current Balance</p>
                    <p className={`font-bold text-2xl ${currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(currentBalance)}</p>
                </div>
            </div>

            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4">Expenditure List</h2>
            
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-400">
                        <th className="p-2">#</th>
                        <th className="p-2">Expenditure Name</th>
                        <th className="p-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expense.expenditures.length > 0 ? (
                        expense.expenditures.map((item, index) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 text-gray-600">{index + 1}</td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center p-4 text-gray-500">No expenditures for this expense.</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className="font-bold border-t-2 border-gray-400">
                        <td colSpan={2} className="p-2 text-right">Total Expenditures:</td>
                        <td className="p-2 text-right">{formatCurrency(expense.amount - currentBalance)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
