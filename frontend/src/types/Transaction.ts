import type { Category } from "./Category";

//actual transaction model like in mongodb
export interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: Category;
    userId: string;
    receiptImageUrl?: string;
}

//to create data
export interface CreateTransactionData {
    name: string;
    amount: number;
    date: Date;
    category: string;
}


export interface CategoryData {
  category: string;
  total: number;
}

export type UpdateTransactionData = Omit<Transaction, 'id' | 'userId' | 'receiptImageUrl'>;

export interface TransactionState {
    transactions: Transaction[];
    monthlyExpense: number;
    monthlyIncome: number;
    IncomeByCategory: CategoryData[];
    ExpenseByCategory: CategoryData[];
    pageCount: number; 
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
}

export interface ReceiptDetails {
    name: string;
    total: number;
    date: string;
    category: string;
}

export interface TransactionActions {
    getAllTransactions: (params: FetchTransactionsParams) => Promise<void>;
    createTransaction: (data: CreateTransactionData) => Promise<void>;
    updateTransaction: (id: string, data: UpdateTransactionData) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    getRecieptDetails: (image: string) => Promise<ReceiptDetails>;
    getDashboardSummary: () => Promise<void>;
}

export interface PaginatedTransactionResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }

// structure  API's paginated response
export type PaginatedApiResponse = {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// parameters of data-fetching action
export type FetchTransactionsParams = {
  page: number;
  limit: number;
  sort?: string;     
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
};