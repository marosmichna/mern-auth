import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error conection to MongoDB: ", error.message);
        process.exit(1); // 1 is failre, 0 status code is success
    }
}