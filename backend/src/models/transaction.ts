import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

transactionSchema.statics.createTransaction = async function (name: string, amount: number, date: Date, categoryId: string, userId: string) {
    
    if (!name || !amount || !date || !categoryId || !userId) {
        throw new Error("All fields are required to create a transaction");
    }

    try {
        const transaction = await this.create({ name, amount, date, categoryId, userId });
        return transaction;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw new Error("Transaction creation failed");
    }
    
};

const Transaction = mongoose.model("Transaction", transactionSchema);