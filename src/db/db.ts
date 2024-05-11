// db.ts
import mongoose from 'mongoose';
import { MONGODB_URI } from '../config';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI,);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
