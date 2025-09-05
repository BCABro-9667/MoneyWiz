'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { useExpenses } from '@/hooks/use-expenses';
import { analyzeSpendingHabits } from '@/ai/flows/spending-insights';
import type { SpendingInsightsOutput, SpendingInsightsInput } from '@/ai/flows/spending-insights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AIInsights() {
  const { getAllExpenditures } = useExpenses();
  const [insights, setInsights] = useState<SpendingInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const allExpenditures = getAllExpenditures();
      if (allExpenditures.length === 0) {
        toast({
            title: "Not enough data",
            description: "Add some expenditures to get AI insights.",
            variant: "destructive"
        });
        return;
      }
      
      const analysisInput: SpendingInsightsInput = {
        expenditures: allExpenditures.map(e => ({
            expenditureName: e.name,
            amount: e.amount,
            category: e.category,
        })),
      };

      const result = await analyzeSpendingHabits(analysisInput);
      setInsights(result);
    } catch (error) {
      console.error('Error analyzing spending habits:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate insights at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Analyze your spending habits and get tips on how to save money.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full rounded-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze My Spending'
          )}
        </Button>
        {insights && (
          <div className="space-y-4 pt-4 border-t">
            <div>
                <h4 className="font-semibold text-lg">Spending Summary</h4>
                <p className="text-sm text-muted-foreground">{insights.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-lg">Savings Insights</h4>
                <p className="text-sm text-muted-foreground">{insights.insights}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
