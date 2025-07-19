import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
},
{
    timestamps: true
});

categorySchema.statics.createCategory = async function (userId: string, name: string, type: string) {
    
    if (!userId || !name || !type) {
        throw new Error("All fields are required to create a category");
    }

    if (!['income', 'expense'].includes(type)) {
        throw new Error("Type must be either 'income' or 'expense'");
    }

    try {
        const category = await this.create({ userId, name, type });
        return category;
    } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Category creation failed");
    }
    
};