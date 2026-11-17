import '../config/dns.js';


import dotenv from 'dotenv'
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

dotenv.config();


async function testUsers() {
    try{
        await connectDB();

        const educator = await User.create({
            email: 'educator@example.com',
            password: 'password',
            username: 'educator',
            role: 'educator'
        });

        console.log("Educator created: ", educator)
    } catch (error) {
        console.error('Error occurred while testing users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testUsers();