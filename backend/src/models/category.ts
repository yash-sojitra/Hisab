import mongoose, {Schema} from "mongoose";

//model interface
export interface ICategory {
    userId: string;
    name: string;
    type: "income" | "expense";
    icon: string;
}

//functional interface for model
export interface ICategoryModel extends mongoose.Model<ICategory> {
    createCategory(userId: string, name: string, type: "income" | "expense", icon: string): Promise<ICategory>;
    getAllCategories(userId: string): Promise<ICategory[]>;
    updateCategory(id: string, userId: string, updateData: Partial<ICategory>): Promise<ICategory>;
}

// category schema
const categorySchema = new Schema<ICategory, ICategoryModel>({
    userId : {
        type: String,
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
    icon: {
        type: String,
    }
},
{
    timestamps: true
});

categorySchema.statics.createCategory = async function (userId: string, name: string, type: string, icon: string) {

    if (!['income', 'expense'].includes(type)) {
        throw new Error("Type must be either 'income' or 'expense'");
    }

    try {
        const category = await this.create({ userId, name, type, icon });
        return category;
    } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Category creation failed");
    }

};

categorySchema.statics.getAllCategories = async function (userId: string) {
    try {
        const categories = await this.find({ userId });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
};

categorySchema.statics.updateCategory = async function (id: string, userId: string, updateData: Partial<ICategory>) {
    try {
        const category = await this.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Category update failed");
    }
};

export const Category = mongoose.model<ICategory, ICategoryModel>("Category", categorySchema);