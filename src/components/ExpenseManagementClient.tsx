
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Landmark, ArrowLeft, Printer, Search, Edit } from 'lucide-react';
import type { Expense, Expenditure } from '@/lib/types';
import { useExpenses } from '@/hooks/use-expenses';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ExpenditureForm from '@/components/ExpenditureForm';
import ExpenditureList from '@/components/ExpenditureList';
import EditExpenseModal from '@/components/EditExpenseModal';
import PrintView from './PrintView';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export default function ExpenseManagementClient({ expense }: { expense: Expense }) {
  const { addExpenditure, updateExpenditure, deleteExpenditure, updateExpense } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentBalance = useMemo(() => {
    const totalExpenditures = (expense.expenditures || []).reduce((sum, item) => sum + item.amount, 0);
    return expense.amount - totalExpenditures;
  }, [expense]);

  const filteredExpenditures = useMemo(() => {
    const expenditures = expense.expenditures || [];
    if (!searchQuery) return expenditures;
    return expenditures.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [expense.expenditures, searchQuery]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveExpense = (id: string, data: Partial<Pick<Expense, 'name' | 'amount'>>) => {
    updateExpense(id, data);
    setIsEditModalOpen(false);
  }
  
  const onAddExpenditure = (data: Omit<Expenditure, 'id' | 'date'>) => {
    addExpenditure(expense.id, data);
  };

  return (
    <>
      <div className="min-h-screen w-full print:hidden">
        <header className="bg-primary text-primary-foreground p-8 rounded-bl-[50px] rounded-br-[50px] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Landmark className="h-8 w-8" />
                <h1 className="text-2xl font-bold font-headline">MoneyWiz</h1>
            </div>
            <Link href="/" passHref>
                <Button variant="outline" className="rounded-full bg-primary-foreground text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
                </Button>
            </Link>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold font-headline">{expense.name}</h2>
            <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-5 w-5"/>
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
              <div>
                  <p className="text-sm text-primary-foreground/80">Total Amount</p>
                  <p className="text-2xl font-semibold">{formatCurrency(expense.amount)}</p>
              </div>
              <div>
                  <p className="text-sm text-primary-foreground/80">Current Balance</p>
                  <p className={`text-2xl font-semibold ${currentBalance < 0 ? 'text-destructive' : 'text-white'}`}>{formatCurrency(currentBalance)}</p>
              </div>
          </div>
        </header>

        <main className="p-6 space-y-8">
          <Card className="rounded-[50px] shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Add Expenditure</h3>
            <ExpenditureForm
              expenseId={expense.id}
              onAddExpenditure={onAddExpenditure}
            />
          </Card>

          <Card className="rounded-[50px] shadow-lg p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <h3 className="text-xl font-semibold">Expenditures</h3>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenditures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
                <Button variant="outline" onClick={handlePrint} className="rounded-full">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            <ExpenditureList
              expenseId={expense.id}
              expenditures={filteredExpenditures}
              onUpdateExpenditure={updateExpenditure}
              onDeleteExpenditure={deleteExpenditure}
            />
          </Card>
        </main>
      </div>

      <PrintView expense={expense} currentBalance={currentBalance} />
      
      {isEditModalOpen && (
        <EditExpenseModal
            expense={expense}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveExpense}
        />
      )}
    </>
  );
}
