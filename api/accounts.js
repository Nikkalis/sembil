import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { nanoid } from 'nanoid';

const router = express.Router();
const saltRounds = 10;

router.post('/', async (req, res) => {
    let UID = nanoid(8);
    const plainPassword = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    const display_name = req.body.display_name;
    const profile_picture = req.body.profile_picture;
    const hash = bcrypt.hashSync(plainPassword, saltRounds);
    const text = 'INSERT INTO accounts (UID, username, password, email, display_name, profile_picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    let values = [UID, username, hash, email, display_name, profile_picture];
    let result = null;
    let error = null;
    for (let i = 1; i <= 5; i++) {
        try {
            result = await pool.query(text, values);
            break;
            
        } catch (err) {
            if (err.code === '23505') {
                UID = nanoid(8);
                values = [UID, username, hash, email, display_name, profile_picture];
            }
            else {
                error = err;
                break;
            }
        }
    }
    if(result) {
        res.json(result.rows[0]); 
    }
    else if(error) {
        res.status(500).json({ message: error.message });
        console.log("uglly ass hoe");
    }
    else{
        res.status(500).json({ message: "sorry bro theres like a 1/99999999 chance of this error happening but just click the button again"})   
    }
    
});

export default router;