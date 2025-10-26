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



export default user_route;