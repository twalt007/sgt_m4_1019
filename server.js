const express = require('express');
const db = require('./db');
const app = express();

app.get('/api/students', async (req, res)=> {

    const result = await db.query('SELECT * FROM grades')

    res.send({
        message: 'This will contain students',
        students: result
    });
});

app.listen(3000, () => {
    console.log("Server is listening @ localhost:3000")
});