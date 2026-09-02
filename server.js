import express from "express";
import ViteExpress from "vite-express";
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool, Client } = pg
const app = express();
const pool = new Pool()

const res = await pool.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));