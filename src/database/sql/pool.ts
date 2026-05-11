import { Sequelize } from 'sequelize';

const {
    DB_NAME, 
    DB_LOGIN, 
    DB_PASS,
    DB_HOST,
    DB_PORT
} = process.env;

if(!DB_NAME || !DB_LOGIN || !DB_PASS || !DB_HOST || !DB_PORT) {
    throw new Error('Missing DataBase environment variables');
};

const sequelize = new Sequelize(DB_NAME, DB_LOGIN, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
  port: Number(DB_PORT), 
});

export default sequelize;