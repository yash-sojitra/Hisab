interface TypeSummaryItem {
    _id: 'income' | 'expense';
    totalAmount: number;
  }
  
  interface CategorySummaryItem {
    _id: {
      name: string;
      type: 'income' | 'expense';
    };
    totalAmount: number;
  }
  
  //respose result
  interface FacetResult {
    typeSummary: TypeSummaryItem[];
    categorySummary: CategorySummaryItem[];
  }
  
  //category data
  interface CategoryData {
      category: string;
      total: number;
  }
  
  //final response data
  interface DashboardData {
      totalIncome: number;
      totalExpense: number;
      incomeByCategory: CategoryData[];
      expenseByCategory: CategoryData[];
  }