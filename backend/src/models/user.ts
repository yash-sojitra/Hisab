import mongoose from "mongoose";

//user schema
const userSchema = new mongoose.Schema({
    _id: { // clerk id
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    budget:{
        type: Number,
    },
},{ timestamps: true });

export const User = mongoose.model("User", userSchema);
