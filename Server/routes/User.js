import express from 'express';
import db from '../config/database.js'

const user_route = express();
user_route.use(express.json());


user_route.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [response] = await db.query(
            `SELECT * FROM links WHERE user_id = ?`
            , [user_id]
        );

        res.json(response);
    } catch(err) {
        console.error('Error fetching links: ', err);
    }
});

user_route.post('/register', async (req, res) => {
    const { fullname, username, password } = req.body;

    try {
        const [user] = await db.query(
            `INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)`
            ,[fullname, username, password]
        );


        return res.status(200).json({
            success: true,
            user: {
                user_id: user.insertId,
                fullname: user.fullname,
            },
            message: 'Registration sucsessful!'
        });

    } catch(err) {
        console.error('Failed to sign up: ', err);
    }
});

user_route.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            console.log('Username and Password required!')
        }

        const [rows] = await db.query(
            `SELECT user_id, username FROM users WHERE username = ? AND password = ?`,
            [username, password]
        );

        if (rows.length === 0) {
            console.log('No user found!')
        }

        const user = rows[0];
        console.log('Logged in good:', user.username, user.user_id);

        return res.status(200).json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username }
        });



    } catch(err) {
        console.error('Failed to login: ', err);
    }
});


export default user_route;