// src/stores/useTransactionStore.ts

import { create } from 'zustand';
import type {
    Transaction,
    TransactionState,
    TransactionActions,
    CreateTransactionData,
    UpdateTransactionData,
    PaginatedTransactionResponse,
    FetchTransactionsParams,
} from '../types/Transaction';
import { type AxiosInstance, AxiosError } from 'axios';

interface TransactionStore extends TransactionState, TransactionActions {
    apiClient: AxiosInstance | null
    setApiClient: (client: AxiosInstance) => void;
}

//error helper function
const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError && error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unknown error occurred.";
};

//centralized store using zustand for storing all the transactions related data
export const useTransactionStore = create<TransactionStore>((set, get) => ({

    transactions: [],
    monthlyExpense: 0,
    monthlyIncome: 0,
    IncomeByCategory: [],
    ExpenseByCategory: [],
    pageCount: 1,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    apiClient: null,
    //injected api client using dependecy injection
    setApiClient: (client: AxiosInstance) => {
        set({ apiClient: client });
    },

    //this is paginated and filtered endpoint to get all transactions
    getAllTransactions: async (params: FetchTransactionsParams) => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ error: errorMsg, isLoading: false });
            return;
        }

        set({ isLoading: true, error: null });
        try {

            const queryParams = new URLSearchParams({
                page: String(params.page),
                limit: String(params.limit),
            });

            if (params.sort) {
                queryParams.append('sortBy', params.sort);
                if (params.order) {
                    queryParams.append('sortOrder', params.order);
                }
            }

            if (params.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const response = await apiClient.get<PaginatedTransactionResponse<Transaction>>(`/transactions?${queryParams.toString()}`);
            console.log(response.data.data);

            const { data, pagination } = response.data;

            // 3. Update the store with the new data and page count
            set({
                transactions: data,
                pageCount: pagination.totalPages, 
                isLoading: false,
            });
        } catch (error) {
            set({ error: getErrorMessage(error), isLoading: false });
        }
    },

    //gives all the information to plot graphs and display information on dashboard
    getDashboardSummary: async () => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ createError: errorMsg, isCreating: false });
            return;
        }

        try {
            const response = await apiClient.get('/transactions/summary')

            set({
                monthlyIncome: response.data.data.totalIncome,
                monthlyExpense: response.data.data.totalExpense,
                IncomeByCategory: response.data.data.incomeByCategory,
                ExpenseByCategory: response.data.data.expenseByCategory
            })
        } catch (error) {
            console.log("error", error);
            set({ createError: getErrorMessage(error), isCreating: false });
        }
    },

    //creates transaction
    createTransaction: async (data: CreateTransactionData) => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ createError: errorMsg, isCreating: false });
            return;
        }

        set({ isCreating: true, createError: null });
        try {
            const response = await apiClient.post<Transaction>('/transactions', data);

            set(state => ({
                transactions: [...state.transactions, response.data],
                isCreating: false,
            }));
        } catch (error) {
            set({ createError: getErrorMessage(error), isCreating: false });
        }
    },

    //gets the details from the photograph
    getRecieptDetails: async (image: string) => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ createError: errorMsg, isCreating: false });
            throw new Error(errorMsg)
        }

        set({ createError: null });
        try {
            const response = await apiClient.post('/transactions/process-image', { image });

            const transactionData = response.data;

            set({ createError: null, isLoading: false });
            return transactionData;
        } catch (error) {
            set({ createError: getErrorMessage(error) });
        }
    },

    //updates transaction
    updateTransaction: async (id: string, data: UpdateTransactionData) => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ updateError: errorMsg, isUpdating: false });
            return;
        }

        set({ isUpdating: true, updateError: null });
        try {
            const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);

            set(state => ({
                transactions: state.transactions.map(t =>
                    t.id === id ? response.data : t
                ),
                isUpdating: false,
            }));
        } catch (error) {
            set({ updateError: getErrorMessage(error), isUpdating: false });
        }
    },

    //deletes transaction
    deleteTransaction: async (id: string) => {
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ deleteError: errorMsg, isDeleting: false });
            return;
        }

        set({ isDeleting: true, deleteError: null });
        try {
            await apiClient.delete(`/transactions/${id}`);

            set(state => ({
                transactions: state.transactions.filter(t => t.id !== id),
                isDeleting: false,
            }));
        } catch (error) {
            set({ deleteError: getErrorMessage(error), isDeleting: false });
        }
    },
}));
