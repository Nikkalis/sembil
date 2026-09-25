import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { nanoid } from 'nanoid';
import isAuthenticated, { attachAuthStatus } from "../middleware.js";
const router = express.Router();
const saltRounds = 10;

// router.get('/', async (req, res) => {

// });

router.post('/login', async (req, res) => {
    const plainPassword = req.body.password;
    const username = req.body.username;
    const text = 'SELECT password, uid FROM accounts WHERE username = $1';
    let values = [username];
    let result = null;
    try {
        result = await pool.query(text, values);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
    if (result.rows[0]) {
        //cute and fine
    }
    else {
        res.status(401).json({ result: "FAILED", message: "Username or password is incorrect. LOL i told you you'd have to remember it" })
        return;
    }
    const password_match = await bcrypt.compare(plainPassword, result.rows[0].password);
    if (password_match) {
        console.log(password_match);
        req.session.uid = result.rows[0].uid;
        res.json({ result: "SUCCESS", uid: result.rows[0].uid });
    }
    else {
        console.log(password_match);
        res.status(401).json({ result: "FAILED", message: "Username or password is incorrect. LOL i told you you'd have to remember it" })
        return;
    }

});

router.get('/logout', isAuthenticated, async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to log out. Maybe close this and try again?" });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({message: "You have successfully logged out!"});
    });
});

router.post('/signup', async (req, res) => {
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
            console.log("checkpoint1");
            result = await pool.query(text, values);
            break;

        } catch (err) {
            if (err.code === '23505') {
                console.log("checkpoint2");
                UID = nanoid(8);
                values = [UID, username, hash, email, display_name, profile_picture];
            }
            else {
                console.log("checkpoint3");
                error = err;
                break;
            }
        }
    }
    if (result) {
        res.json(result.rows[0]);
    }
    else if (error) {
        res.status(500).json({ message: error.message });
        console.log("uglly ass hoe");
    }
    else {
        res.status(500).json({ message: "Hey girl theres like a 1/trilliongazillion chance of this error happening but just click the button again lol" })
    }

});
router.get('/myprofile', isAuthenticated, async (req, res) => {
    const current_uid = req.session.uid;

    const text = 'SELECT username, display_name, profile_picture, date_joined::text FROM accounts WHERE uid = $1';
    const values = [current_uid];
    let result;
    try {
        result = await pool.query(text, values);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }

    if (!result.rows[0]) {
        res.status(404).json({ message: "Account not found. You really shouldn't be able to see this, but try logging in." });
        return;
    }
    res.json({ ...result.rows[0], uid: current_uid });
});

router.get('/loadprofile', isAuthenticated, async (req, res) => {
    let current_uid = req.session.uid;
    if (req.query.uid) {
        current_uid = req.query.uid;
    }
    const text1 = 'SELECT a.username, a.display_name, a.profile_picture, a.date_joined::text, p.bio, p.status FROM accounts a LEFT JOIN profiles p ON a.uid = p.uid WHERE a.uid = $1';
    const values = [current_uid];
    let result;
    try {
        result = await pool.query(text1, values);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }

    if (!result.rows[0]) {
        res.status(404).json({ message: "Account not found. You really shouldn't be able to see this, but try logging in." });
        return;
    }
    res.json({ ...result.rows[0], uid: current_uid });
});

router.post('/editprofile', isAuthenticated, async (req, res) => {
    const uid = req.session.uid;
    const bio = req.body.bio;
    const status = req.body.status;
    const display_name = req.body.display_name;
    const text1 = 'UPDATE accounts SET display_name = $1 WHERE uid = $2';
    const valuesA = [display_name, uid];
    let result;
    let result1;
    try {
        result1 = await pool.query(text1, valuesA);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
    const text2 = 'UPDATE posts SET author_display_name = $1 WHERE uid = $2';
    let result2;
    try {
        result2 = await pool.query(text2, valuesA);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
    const text3 = 'SELECT bio, status FROM profiles WHERE uid = $1';
    const valuesB = [uid];
    const result3 = await pool.query(text3, valuesB);
    if (result3.rows[0]) {
        const valuesC = [bio, status, uid];
        const text4 = 'UPDATE profiles SET bio = $1, status = $2 WHERE uid = $3 RETURNING *';
        
        try {
            result = await pool.query(text4, valuesC);
        } catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    } else {
        const valuesD = [uid, bio, status];
        const text5 = 'INSERT INTO profiles (uid, bio, status) VALUES ($1, $2, $3) RETURNING *';
        
        try {
            result = await pool.query(text5, valuesD);
        } catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    }
    res.json({...result.rows[0], display_name: display_name});
});


router.get('/checkauth', attachAuthStatus, async (req, res) => {
    try {
        res.json({ isLoggedIn: req.isLoggedIn });
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});



export default router;