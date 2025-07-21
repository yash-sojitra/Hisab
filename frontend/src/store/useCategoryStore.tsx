import type { Category, CategoryActions, CategoryState } from '@/types/Category';
import { isAxiosError, type AxiosInstance } from 'axios';
import { create } from 'zustand';

interface CategoryStore extends CategoryState, CategoryActions {
    apiClient: AxiosInstance | null;
    setApiClient: (client: AxiosInstance) => void;
}

//store using zustand for storing data related to categories
export const useCategoryStore = create<CategoryStore>((set, get) => ({

    categories: [],
    loading: false,
    error: null,
    apiClient: null,
    //used dependency injection to inject api client into this store
    setApiClient: (client: AxiosInstance) => {
        set({ apiClient: client });
    },

    //fetches all the categories
    fetchAllCategories: async () => {
        set({ loading: true, error: null });
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ error: errorMsg, loading: false });
            return;
        }
        try {
            const response = await apiClient.get<Category[]>('/categories');
            set({ categories: response.data, loading: false });
        } catch (error) {
            const errorMessage = isAxiosError(error) ? error.message : "An unexpected error occurred while fetching categories.";
            console.error("Error fetching categories:", error);
            set({ error: errorMessage, loading: false });
        }
    },

    //creates a new category
    createCategory: async (newCategory) => {
        set({ loading: true, error: null });
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ error: errorMsg, loading: false });
            return;
        }
        try {
            const response = await apiClient.post<Category>('/categories', newCategory);
            // Add the new category to the existing state
            set(state => ({
                categories: [...state.categories, response.data],
                loading: false
            }));
        } catch (error) {
            const errorMessage = isAxiosError(error) ? error.message : "An unexpected error occurred while creating the category.";
            console.error("Error creating category:", error);
            set({ error: errorMessage, loading: false });
        }
    },

    //updates a category
    updateCategory: async (id, updatedCategoryData) => {
        set({ loading: true, error: null });
        const apiClient = get().apiClient;
        if (!apiClient) {
            const errorMsg = "API client is not set.";
            console.error(errorMsg);
            set({ error: errorMsg, loading: false });
            return;
        }
        try {
            const response = await apiClient.put<Category>(`/categories/${id}`, updatedCategoryData);
            // Find and update the category in the state
            set(state => ({
                categories: state.categories.map(category =>
                    category._id === id ? { ...category, ...response.data } : category
                ),
                loading: false
            }));
        } catch (error) {
            const errorMessage = isAxiosError(error) ? error.message : "An unexpected error occurred while updating the category.";
            console.error("Error updating category:", error);
            set({ error: errorMessage, loading: false });
        }
    },
}));