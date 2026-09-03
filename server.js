import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pool from "./db.js";
import accountRoutes from "./api/accounts.js";
import postRoutes from "./api/posts.js";


const app = express();
app.use(express.json());

app.use("/api/accounts", accountRoutes);
// app.use("/api/posts", postRoutes);




ViteExpress.listen(app, 3000, () => console.log("Server is listening... HEEEELLLPPP HELLPPPP SERVER HELP MEEEEE!!!!"));