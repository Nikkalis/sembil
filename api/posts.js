import express from "express";
import pool from "../db.js";
import { nanoid } from 'nanoid';
import isAuthenticated, { attachAuthStatus } from "../middleware.js";

const router = express.Router();

router.get('/loadpost', async (req, res) => {
    if (req.query.postid) {
        const postid = req.query.postid;
        console.log(`getting post id: ${postid}`);
        const text = 'SELECT uid, post_type, author_username, post_date::text, post_title, post_content, post_main_image, preview_size, post_boxes, post_tags, post_desc, postnum, post_details, author_display_name FROM posts WHERE postid = $1';
        const values = [postid];
        let result = null;
        try {
            result = await pool.query(text, values);
        }
        catch (error) {
            res.status(500).json({ message: error.message })
            return;
        }
        res.json(result.rows[0]);
        return;
        
    }
    else {
        const postnum = req.query.postnum;
        console.log(`getting post number: ${postnum}`);
        const text = 'SELECT uid, post_type, postid, author_username, post_date::text, post_title, post_content, post_main_image, preview_size, post_boxes, post_tags, post_desc, post_details, author_display_name FROM posts WHERE postnum = $1';
        const values = [postnum];
        let result = null;
        try {
            result = await pool.query(text, values);
            console.log(`result: ${result.rows[0].postid}`);
        }
        catch (error) {
            console.log(`postget failed!`);
            res.status(500).json({ message: error.message, code: error.code });
            return;
        }
        console.log(`postget success!`);
        res.json(result.rows[0]);
        return;
    }
});

router.post('/createpost', isAuthenticated, async (req, res) => {
    console.log('req.body:', req.body);
    const postId = req.body.postid;
    const UID = req.session.uid;
    const post_type = req.body.post_type;
    console.log("backend:");
    console.log(post_type);
    const author_username = req.body.author_username;
    const post_date = req.body.post_date;
    const post_title = req.body.post_title;
    const post_content = req.body.post_content;
    const post_main_image = req.body.post_main_image;
    const preview_size = req.body.preview_size;
    const post_boxes = req.body.post_boxes;
    const post_tags = req.body.post_tags;
    const post_desc = req.body.post_desc;
    const post_details = req.body.post_details;
    const author_display_name = req.body.author_display_name;

    const text = 'INSERT INTO posts (postid, uid, author_username, post_date, post_title, post_content, post_main_image, preview_size, post_boxes, post_tags, post_desc, post_type, post_details, author_display_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
    let values = [postId, UID, author_username, post_date, post_title, post_content, post_main_image, preview_size, post_boxes, post_tags, post_desc, post_type, post_details, author_display_name];
    console.log("backend:");
    console.log(post_type);
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
                postId = nanoid(8);
                values = [postId, UID, author_username, post_date, post_title, post_content, post_main_image, preview_size, post_boxes, post_tags, post_desc, post_type, post_details, author_display_name];
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
        console.log("backend:");
        console.log(post_type);
        res.status(500).json({ message: error.message });
        console.log("uglly ass hoe");
    }
    else {
        res.status(500).json({ message: postId + "rgsrtghwrtsorry bro theres like a 1/99999999 chance of this error happening but just click the button again" })
    }
});

export default router