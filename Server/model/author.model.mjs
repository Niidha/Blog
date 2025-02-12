import { model, Schema } from "mongoose";

const AuthorSchema = new Schema(
    {
        name: { type: String, required: [true, "Name is required"] },
        username: { type: String, required: [true, "Username is required"], unique: true },
        email: { type: String, required: [true, "Email is required"], unique: true },
        phone: { type: String, required: [true, "Phone number is required"] },
        password: { type: String, required: [true, "Password is required"] },
        profileUrl: { type: String, default: "" },
        bio: { type: String, default: "" },
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
        youtube: { type: String, default: "" },
    },
    { timestamps: true }
);

export const authorCollection = model("authors", AuthorSchema);
