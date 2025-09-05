
export interface Expenditure {
  id: string;
  _id?: string;
  amount: number;
  name: string;
  description: string;
  date: string;
}

export interface Expense {
  id: string;
  _id?: string;
  amount: number;
  name: string;
  expenditures: Expenditure[];
  createdAt: string;
  userId: string;
}
