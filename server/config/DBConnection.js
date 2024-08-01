import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const DBConnection = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URL);
        if (connection.readyState === 1) {
            console.log('DB is connected successfully:', connection.host);
        } else {
            console.error('DB connection failed');
        }
    } catch (error) {
        console.error('Error connecting to the database:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        process.exit(1);
    }
};

export default DBConnection;
