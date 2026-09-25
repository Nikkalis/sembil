
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool, Client } = pg
const sembiladminauth = {
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
};
const pool = new Pool(sembiladminauth)
export default pool;