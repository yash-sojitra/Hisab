import { Request, Response } from "express";
import { Transaction, TransactionFilters } from "../models/transaction";
import { Category } from "../models/category";
import { Type } from "@google/genai";
import { ai } from "../utils/ai";


//transaction controller
export const transactionController = {
    create: async function (req: Request, res: Response) {
        const { name, amount, date, category, receiptImageUrl } = req.body;
        const userId = req.auth?.userId;

        if (!name || !amount || !date || !category || !userId) {
            return res.status(400).json({ error: "All fields are required to create a transaction" });
        }

        try {
            const transaction = await Transaction.createTransaction({ name, amount, date: new Date(date), category, userId, receiptImageUrl });
            return res.status(201).json(transaction);
        } catch (error) {
            console.error("Error creating transaction:", error);
            return res.status(500).json({ error: "Transaction creation failed" });
        }
    },

    //gets image of a pos reciept and generate structured output
    getRecieptDetails: async function (req: Request, res: Response) {
        const userId = req.auth?.userId;
        const { image } = req.body;

        if (!image || !userId) {
            return res.status(400).json({ error: "Image data and User ID are required" });
        }

        const cleanedBase64 = image.replace(/^data:image\/\w+;base64,/, "");

        const categories = await Category.getAllCategories(userId);
        const categoryNames = categories.map(category => category.name);

        const config = {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                    },
                    date: {
                        type: Type.STRING,
                    },
                    category: {
                        type: Type.STRING,
                        enum: [...categoryNames, 'Other'],
                    },
                    total: {
                        type: Type.NUMBER,
                    },

                }
            }
        }

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: cleanedBase64
                        },
                    },
                    {
                        text: "extract data from the image and return it in given JSON schema.give date in dd/mm/yyyy format."
                    }
                ],
                config: config
            });

            const text = JSON.parse(response.text as string)

            res.json(text);

        } catch (error) {
            console.error("Error processing image:", error);
            return res.status(500).json({ error: "Image processing failed" });
        }
    },

    //calculates and gives dashboard sumary for graphs and cards
    getDashboardSummary: async function (req: Request, res: Response) {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Access denied.' });
        }

        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        try {
            // Use the generic parameter in aggregate<T> to type the result
            const summaryResult = await Transaction.aggregate<FacetResult>([
                { $match: { userId: userId, date: { $gte: startDate, $lte: endDate } } },
                { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryDetails' } },
                { $unwind: '$categoryDetails' },
                {
                    $facet: {
                        typeSummary: [
                            { $group: { _id: '$categoryDetails.type', totalAmount: { $sum: '$amount' } } }
                        ],
                        categorySummary: [
                            { $group: { _id: { name: '$categoryDetails.name', type: '$categoryDetails.type' }, totalAmount: { $sum: '$amount' } } },
                            { $sort: { totalAmount: -1 } }
                        ]
                    }
                }
            ]);

            const results = summaryResult[0];

            let totalIncome: number = 0;
            let totalExpense: number = 0;
            results.typeSummary.forEach((item: TypeSummaryItem) => {
                if (item._id === 'income') {
                    totalIncome = item.totalAmount;
                } else if (item._id === 'expense') {
                    totalExpense = item.totalAmount;
                }
            });

            const incomeByCategory: CategoryData[] = [];
            const expenseByCategory: CategoryData[] = [];
            results.categorySummary.forEach((item: CategorySummaryItem) => {
                const categoryData: CategoryData = {
                    category: item._id.name,
                    total: item.totalAmount
                };
                if (item._id.type === 'income') {
                    incomeByCategory.push(categoryData);
                } else {
                    expenseByCategory.push(categoryData);
                }
            });

            const responseData: DashboardData = {
                totalIncome,
                totalExpense,
                incomeByCategory,
                expenseByCategory
            };

            return res.status(200).json({
                message: "Dashboard summary fetched successfully",
                data: responseData
            });

        } catch (error) {
            console.error("Error fetching dashboard summary:", error);
            return res.status(500).json({ message: "An error occurred while fetching the dashboard summary." });
        }
    },


    getAll: async function (req: Request, res: Response) {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {

            const {
                page: pageStr,
                limit: limitStr,
                ...filterParams
            } = req.query;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const pagination = { page, limit };

            // 2. Separate filter params from pagination params
            const filters: TransactionFilters = filterParams;


            const transactions = await Transaction.getAllTransactions(userId, filters, pagination);
            return res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return res.status(500).json({ error: "Failed to fetch transactions" });
        }
    },

    update: async function (req: Request, res: Response) {
        const { id } = req.params;
        const { name, amount, date, category } = req.body;
        const userId = req.auth?.userId;
        if (!id || !name || !amount || !date || !category || !userId) {
            return res.status(400).json({ error: "All fields are required to update a transaction" });
        }

        try {
            const transaction = await Transaction.updateTransaction(id, userId, { name, amount, date: new Date(date), category });

            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            return res.status(200).json(transaction);
        } catch (error) {
            console.error("Error updating transaction:", error);
            return res.status(500).json({ error: "Transaction update failed" });
        }
    },

    delete: async function (req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.auth?.userId;

        if (!id || !userId) {
            return res.status(400).json({ error: "Transaction ID and User ID are required" });
        }

        try {
            const transaction = await Transaction.deleteTransaction(id, userId);

            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            return res.status(200).json({ message: "Transaction deleted successfully" });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            return res.status(500).json({ error: "Transaction deletion failed" });
        }
    }
}