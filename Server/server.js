import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/database.js';

// Routes
import user_route from './routes/User.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());


// decale routes
app.use('/user', user_route);


app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.post('/yt_link', async (req, res) => {
    const { yt_link, yt_title } = req.body;

    try {
        const [yt_video] = await db.query(
            `INSERT INTO links (video_link, video_title) VALUES (?, ?)`, 
            [yt_link, yt_title]);


        res.json({
            message: 'Added link successfully!',
            insertId: yt_video.insertId 
        });
    } catch (err) {
        console.error('Failed to add video:', err);
        res.status(500).json({ error: 'Database insert failed' });
    }
});

app.get('/yt_link_list', async (req, res) => {
    try {
        const [links] = await db.query(
            `SELECT * FROM links`
        );

        res.json(links)
    } catch(err) {  
        console.error('Failed to fetch links', err );
    }
});


app.delete('/yt_link_delete/:link_id', async (req, res) => {
    const { link_id } = req.params;

    try {
        const [link] = await db.query(
            `DELETE FROM links WHERE link_id = ?`
            , [link_id]
        );

        if (link.affectedRows === 0) {
            return res.status(404).json({ error: 'Link not found!' });
        }

        res.json({ message: 'Deleted successfully' });
    } catch(err) {
        console.error('Failed to delete link: ', err);
        res.status(500).json({ error: 'Failed to delete link' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});