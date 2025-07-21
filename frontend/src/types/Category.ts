//actual state just like mongodb model
export interface Category {
    _id: string;
    userId: string;
    name: string;
    type: 'expense' | 'income';
    icon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

//used for rendering purposes
export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

//interface for category related functions
export interface CategoryActions {
  fetchAllCategories: () => Promise<void>;
  createCategory: (newCategory: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updatedCategory: Partial<Omit<Category, 'id'>>) => Promise<void>;
}

//specially for Createing Category
export type CreateCategoryData = Omit<Category, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>;

//specially for Updating Category
export type UpdateCategoryData = Omit<Category, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>;