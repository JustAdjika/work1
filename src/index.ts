import dotenv from 'dotenv';
dotenv.config();

import app from './app.ts'
import sequelize from './database/sql/pool.ts';

const PORT = process.env.SERVER_PORT || 3000;


// Старт сервера
async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB Ready');

        app.listen(PORT, () => console.log(`Server running. Port: ${PORT}`));
    } catch(err) {
        console.error("Startup error:", err);
    };
};

start();