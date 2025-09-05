'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import type { Expenditure } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import EditExpenditureModal from '@/components/EditExpenditureModal';
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

interface ExpenditureListProps {
  expenseId: string;
  expenditures: Expenditure[];
  onUpdateExpenditure: (expenseId: string, expenditureId: string, data: Partial<Expenditure>) => void;
  onDeleteExpenditure: (expenseId: string, expenditureId: string) => void;
}

export default function ExpenditureList({
  expenseId,
  expenditures,
  onUpdateExpenditure,
  onDeleteExpenditure,
}: ExpenditureListProps) {
  const [editingExpenditure, setEditingExpenditure] = useState<Expenditure | null>(null);

  if (expenditures.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No expenditures recorded for this expense yet.</p>;
  }

  const handleSave = (expenditureId: string, data: Partial<Omit<Expenditure, 'id' | 'date'>>) => {
    onUpdateExpenditure(expenseId, expenditureId, data);
    setEditingExpenditure(null);
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {expenditures.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-b last:border-b-0">
             <div className="group flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <AccordionTrigger className="flex-1 hover:no-underline p-0">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{item.name}</span>
                    </div>
                </AccordionTrigger>
                <div className="flex items-center gap-2 ml-4">
                    <span className="text-muted-foreground font-medium">{formatCurrency(item.amount)}</span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setEditingExpenditure(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the expenditure "{item.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteExpenditure(expenseId, item.id)}>
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
            <AccordionContent className="px-6 pb-4 text-muted-foreground">
              {item.description || "No description provided."}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {editingExpenditure && (
        <EditExpenditureModal
          isOpen={!!editingExpenditure}
          onClose={() => setEditingExpenditure(null)}
          expenditure={editingExpenditure}
          onSave={handleSave}
        />
      )}
    </>
  );
}
