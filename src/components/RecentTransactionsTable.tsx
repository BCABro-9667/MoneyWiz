
'use client';

import { useMemo } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export default function RecentTransactionsTable() {
  const { expenses, isLoaded } = useExpenses();

  const recentTransactions = useMemo(() => {
    if (!isLoaded) return [];
    return expenses
      .flatMap(expense => (expense.expenditures || []).map(expenditure => ({ ...expenditure, expenseName: expense.name })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses, isLoaded]);

  return (
    <Card className="rounded-[50px] shadow-lg">
      <CardHeader>
        <CardTitle>Top 5 Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoaded ? (
              recentTransactions.length > 0 ? (
                recentTransactions.map(t => (
                  <TableRow key={t._id || t.id}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(t.date)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className='whitespace-nowrap'>{t.expenseName}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No transactions yet.</TableCell>
                </TableRow>
              )
            ) : (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
