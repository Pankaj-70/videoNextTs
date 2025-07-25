import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
    throw new Error("Please define mongoose url for connection in env");
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDatabase() {
    if(cached.conn) {
        return cached.conn;
    }

    const opts = {
        bufferCommand: true,
        maxPoolSize: 10
    }
    if(!cached.promise) {
        mongoose
        .connect(MONGODB_URI, opts)
        .then(() => mongoose.Connection);
    }

    try {
        cached.conn = await cached.promise;
    }catch(error) {
        cached.promise = null;
        throw error;
    }
}

