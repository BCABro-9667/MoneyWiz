
'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useExpenses } from '@/hooks/use-expenses';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from './ui/skeleton';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const chartConfig = {
  total: {
    label: 'Total Budget',
    color: 'hsl(var(--secondary))',
  },
  current: {
    label: 'Current Balance',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function ExpenseSummaryChart() {
  const { expenses, isLoaded } = useExpenses();

  const chartData = useMemo(() => {
    if (!isLoaded) return [];

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentExpenses = sortedExpenses.slice(0, 5);
    
    return recentExpenses.map(expense => {
      const totalExpenditures = (expense.expenditures || []).reduce((sum, item) => sum + item.amount, 0);
      const currentBalance = expense.amount - totalExpenditures;
      return {
        name: expense.name,
        total: expense.amount,
        current: currentBalance,
      };
    }).reverse();
  }, [expenses, isLoaded]);

  if (!isLoaded) {
    return (
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Recent Expense Summary</CardTitle>
        <CardDescription>Total budget vs. current balance for your last 5 expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
              />
              <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    formatter={(value, name) => (
                        <div className='flex flex-col'>
                            <span className="text-sm text-muted-foreground">{chartConfig[name as keyof typeof chartConfig].label}</span>
                            <span className="font-bold">{formatCurrency(value as number)}</span>
                        </div>
                    )}
                    labelFormatter={(label) => <div className="font-bold">{label}</div>}
                />}
              />
              <Legend />
              <Bar dataKey="total" fill={chartConfig.total.color} radius={8} />
              <Bar dataKey="current" fill={chartConfig.current.color} radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Not enough data to display a chart. Add some expenses!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
