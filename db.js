
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool, Client } = pg
const sembiladminauth = {
    user: process.env.SEMBIL_ADMIN_USERNAME,
    password: process.env.SEMBIL_ADMIN_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'sembildb',
};
const pool = new Pool(sembiladminauth)
export default pool;