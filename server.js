import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pool from "./db.js";
import accountRoutes from "./api/accounts.js";
import postRoutes from "./api/posts.js";
import dotenv from "dotenv";
dotenv.config();
import http from "http";

const app = express();
app.use(express.json());

const PgSession = pgSession(session);

app.use(session({
    store: new PgSession({ pool: pool }),
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

app.use("/api/accounts", accountRoutes);


app.use("/api/posts", postRoutes);

const server = app.listen( 3000, "0.0.0.0", () => console.log("Server is listening... on http://0.0.0.0:3000 HEEEELLLPPP HELLPPPP SERVER HELP MEEEEE!!!!"));
ViteExpress.bind(app, server);