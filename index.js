const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { runStep1 } = require('./tool-calls/run-step-one.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express server is running!');
});

// Import the tool-call.js module
app.post('/getPostsById', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const result = await runStep1(query);
        res.json({ result });
    } catch (error) {
        console.error('Error running step 1:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.post('/getPostsByUserId', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const { runStep2, runStep2Dynamic } = require('./tool-calls/run-step-two.js');
        // const result = await runStep2(query);
        const result = await runStep2Dynamic(query);
        res.json({ result });
    } catch (error) {
        console.error('Error running step 2:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
});