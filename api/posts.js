import express from "express";
import pool from "../db.js";
import Fuse from "fuse.js";
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
        res.json({...result.rows[0], postid: req.query.postid});
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

router.get('/search', async (req, res) => {
        const searchQuery = req.query.search;

        // const text = 'SELECT postid FROM posts WHERE $1 % ANY(author_username, post_title, post_content, post_tags, post_desc, post_details, author_display_name)';
        const text= "SELECT postid FROM posts WHERE search_vector @@ websearch_to_tsquery('english', $1)"
        const values = [searchQuery];
        let result = null;
        try {
            result = await pool.query(text, values);
        }
        catch (error) {
            res.status(500).json({ message: error.message })
            return;
        }
        res.json(result.rows);
        return;
});

router.post('/createpost', isAuthenticated, async (req, res) => {
    console.log('req.body:', req.body);
    let postId = req.body.postid;
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

router.post('/likepost', isAuthenticated, async (req, res) => {
    const postId = req.body.postid;
    const uid = req.session.uid;

    const textA = 'SELECT uid FROM profiles WHERE uid = $1';
    const valuesA = [uid];
    const resultA = await pool.query(textA, valuesA);
    let text;
    let values;
    let result = null;
    if (resultA.rows[0]) {
        text = "UPDATE profiles SET liked_postids = array_append(liked_postids, $1) WHERE uid = $2 RETURNING *";
        values = [ postId, uid ];
        result = await pool.query(text, values);
    } else {
        text = "INSERT INTO profiles (uid, liked_postids) VALUES ($1, $2) RETURNING *";
        const new_like_array = [];
        new_like_array.push(postId);
        values = [ uid, new_like_array ];
        result = await pool.query(text, values);
    }

    if(result.rows[0]){res.sendStatus(200)}
    else {res.status(500)};
});
router.post('/unlikepost', isAuthenticated, async (req, res) => {
    const postId = req.body.postid;
    const uid = req.session.uid;
    const text = "UPDATE profiles SET liked_postids = array_remove(liked_postids, $1) WHERE uid = $2 RETURNING *";
    const values = [ postId, uid ];
    const result = await pool.query(text, values);
    if(result.rows[0]){res.sendStatus(200)}
    else {res.status(500)};
});

router.get('/checkstatus', isAuthenticated, async (req, res) => {
    const postId = req.query.postid;
    const uid = req.session.uid;
    const text = 'SELECT liked_postids FROM profiles WHERE uid = $1 AND $2 = ANY(liked_postids)';
    const values = [uid, postId];
    const result = await pool.query(text, values);
    res.json(result.rows[0]);
})

export default router