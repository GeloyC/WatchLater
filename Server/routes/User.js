import express from 'express';
import db from '../config/database.js'

const user_route = express();
user_route.use(express.json());


user_route.get('/', async (req, res) => {
    try {
        const [response] = await db.query(
            `SELECT * FROM links`
        );

        res.json(response);
    } catch(err) {
        console.error('Error fetching links: ', err);
    }
});

// app.post('/signup', async (req, res) => {
//     const { fullname, username, password } = req.body;

//     try {

//     } catch(err) {

//     }
// });

user_route.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            console.log('Username and Password required!')
        }

        const [rows] = await db.query(
            `SELECT * FROM users WHERE username = ? AND password = ?`,
            [username, password]
        );

        if (rows.length === 0) {
            console.log('No user found!')
        }

        const user = rows[0];
        console.log('Logged in successfully:', user.username);

        return res.status(200).json({
            message: 'Login successful',
            user: { username: user.username }
        });


    } catch(err) {
        console.error('Failed to login: ', err);
    }
});


export default user_route;