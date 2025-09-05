'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Landmark, Plus, Trash2, Edit, MoreVertical } from 'lucide-react';

import { useExpenses } from '@/hooks/use-expenses';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import NewExpenseForm from '@/components/NewExpenseForm';
import RecentTransactionsTable from '@/components/RecentTransactionsTable';
import AIInsights from '@/components/AIInsights';
import EditExpenseModal from './EditExpenseModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const ExpenseCard = ({ expense, onEdit, onDelete }: { expense: Expense, onEdit: (expense: Expense) => void, onDelete: (expenseId: string) => void }) => (
  <Card className="rounded-[50px] shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <Link href={`/expense/${expense.id}`} className="block group">
        <div className="flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(expense.amount)}</p>
              <p className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">{expense.name}</p>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {expense.expenditures.length} expenditure(s)
        </p>
      </Link>
      <div className="flex items-center justify-end gap-2 mt-4">
        <Link href={`/expense/${expense.id}`} passHref>
           <Button variant="outline" className="rounded-full">Manage</Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onEdit(expense)}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the expense "{expense.name}" and all its expenditures.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(expense.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
    <Card className="rounded-[50px] shadow-lg">
        <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex justify-end gap-2 mt-4">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </CardContent>
    </Card>
);

export default function DashboardClient() {
  const { expenses, addExpense, isLoaded, deleteExpense, updateExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  return (
    <>
      <div className="min-h-screen w-full">
        <header className="bg-primary text-primary-foreground p-8 rounded-bl-[50px] rounded-br-[50px] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Landmark className="h-8 w-8" />
                <h1 className="text-2xl font-bold font-headline">MoneyWiz</h1>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground/90">Quick Add Expense</h2>
            <NewExpenseForm onAddExpense={addExpense} />
          </div>
        </header>

        <main className="p-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Expenses</h2>
            {isLoaded ? (
              expenses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expenses.map(expense => (
                    <ExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onEdit={setEditingExpense} 
                      onDelete={deleteExpense}
                    />
                  ))}
                </div>
              ) : (
                <Card className="rounded-[50px] shadow-lg p-8 text-center">
                  <p className="text-muted-foreground">No expenses yet. Add one to get started!</p>
                </Card>
              )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentTransactionsTable />
            <AIInsights />
          </div>

        </main>
      </div>
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(id, data) => {
            updateExpense(id, data);
            setEditingExpense(null);
          }}
        />
      )}
    </>
  );
}
