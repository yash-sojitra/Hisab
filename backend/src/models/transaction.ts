import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { Category } from "./category";

//transaction model interface
export interface ITransaction extends Document {
    userId: string;
    amount: number;
    name: string;
    date: Date;
    category: Types.ObjectId;
    receiptImageUrl?: string;
}

//functional interface
export interface ITransactionModel extends Model<ITransaction> {
    createTransaction({name, amount, date, category, userId, receiptImageUrl}:Partial<ITransaction>): Promise<ITransaction>;
    getAllTransactions(userId: string, filters: TransactionFilters, pagination:PaginationOptions): Promise<ITransaction[]>;
    updateTransaction(id: string, userId: string, updateData: Partial<ITransaction>): Promise<ITransaction>;
    deleteTransaction(id: string, userId: string): Promise<ITransaction>;
}

//types for Filters validation
export type TransactionFilters = {
    startDate?: string | Date;
    endDate?: string | Date;
    type?: 'Income' | 'Expense';
    categoryId?: string;
};

//types for Pagination Options
export type PaginationOptions = {
    page?: number;
    limit?: number;
};

//types for Transaction Query Conditions
export type TransactionQueryConditions = {
    userId: string;
    date?: {
        $gte?: Date;
        $lte?: Date;
    };
    category?: string | Types.ObjectId | {
        $in: Types.ObjectId[];
    };
};

//transaction Schema
const transactionSchema = new Schema<ITransaction, ITransactionModel>({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    receiptImageUrl: {
        type: String,
    }
})

transactionSchema.statics.createTransaction = async function ({
    name,
    amount,
    date,
    category,
    userId,
    receiptImageUrl
}: ITransaction) {
    try {
        const transaction = await this.create({ name, amount, date, category, userId, ...(receiptImageUrl && { receiptImageUrl }) });
        return transaction.populate('category');
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw new Error("Transaction creation failed");
    }
};

transactionSchema.statics.getAllTransactions = async function (
    userId: string, 
    filters: TransactionFilters = {}, 
    pagination: PaginationOptions = {page: 1, limit: 10}) {

    const { page, limit } = pagination;
    const skip = ((page as number )- 1) * (limit as number);

    const queryConditions: TransactionQueryConditions = { userId: userId };

    if (filters.startDate || filters.endDate) {
        queryConditions.date = {};
        if (filters.startDate) {
            queryConditions.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            const endOfDay = new Date(filters.endDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            queryConditions.date.$lte = endOfDay;
        }
    }

    const categoryQuery: any = {};
    if (filters.categoryId) {
        queryConditions.category = filters.categoryId;
    }
    else if (filters.type) {
        const categoryQuery: any = { type: filters.type };

        const categories = await Category.find(categoryQuery).select('_id');
        const categoryIds = categories.map(cat => cat._id);
        queryConditions.category = { $in: categoryIds };
    }

    if (Object.keys(categoryQuery).length > 0) {
        const categories = await Category.find(categoryQuery).select('_id');
        const categoryIds = categories.map(cat => cat._id);
        queryConditions.category = { $in: categoryIds };
    }

    try {
        const [transactions, total] = await Promise.all([
            this.find(queryConditions)
                .populate('category') 
                .sort({ transaction_date: -1 })
                .skip(skip)
                .limit(limit as number),
            this.countDocuments(queryConditions)
        ]);

        return {
            data: transactions,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / (limit as number))
            }
        };

    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
    }
};

transactionSchema.statics.updateTransaction = async function (
    id: string,
    userId: string,
    updateData: Partial<ITransaction>) {
    try {
        const transaction = await this.findOneAndUpdate({ _id: id, userId }, updateData, { new: true }).populate('category');
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        return transaction;
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw new Error("Transaction update failed");
    }
};

transactionSchema.statics.deleteTransaction = async function (id: string, userId: string) {
    try {
        const transaction = await this.findOneAndDelete({ _id: id, userId });
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        return transaction;
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw new Error("Transaction deletion failed");
    }
};


export const Transaction = mongoose.model<ITransaction, ITransactionModel>("Transaction", transactionSchema);