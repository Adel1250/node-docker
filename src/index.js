const express = require('express');
const mongoose = require("mongoose");
const redis = require("redis");

const PORT = process.env.PORT || 4000;
const app = express();

const REDIS_HOST = 'redis';
const REDIS_PORT = '6379';
const redisClient = redis.createClient(
    {
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`
    }
);
redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.connect();

const DB_USERNAME = "root";
const DB_PASSWORD = "example";
const DB_PORT = "27017";
const DB_HOST = 'mongo';
const URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
mongoose.connect(URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    redisClient.set('products', 'products...')
    res.send('<h1> Hello World! </h1>');
});

app.get('/data', async (req, res) => {
    const products = await redisClient.get('products');
    res.send(`<h1> Products: ${products} </h1>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
