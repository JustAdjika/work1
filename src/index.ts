import './common/config/env.config.ts'

import app from './app.ts'
import sequelize from './database/sql/pool.ts';

import redis from './database/redis/redis.ts';


const PORT = process.env.SERVER_PORT || 3000;


// Старт сервера
async function start() {
    try {
        await sequelize.authenticate();
        console.log('SQL Ready');
        
        await redis.connect();
        console.log('Redis Ready');

        app.listen(PORT, () => console.log(`Server running. Port: ${PORT}`));
    } catch(err) {
        console.error("Startup error:", err);
    };
};

start();