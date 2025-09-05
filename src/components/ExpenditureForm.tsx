'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Expenditure } from '@/lib/types';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

type ExpenditureFormData = Omit<Expenditure, 'id' | 'date'>;

interface ExpenditureFormProps {
  expenseId: string;
  onAddExpenditure: (data: ExpenditureFormData) => void;
}

export default function ExpenditureForm({ onAddExpenditure }: ExpenditureFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddExpenditure({ ...values, description: values.description || '' });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250" {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expenditure Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Coffee" {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Met with a client" {...field} className="rounded-3xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
            <Plus className="mr-2 h-4 w-4" /> Add Expenditure
          </Button>
        </div>
      </form>
    </Form>
  );
}
