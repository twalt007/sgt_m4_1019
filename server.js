const express = require('express');
const db = require('./db');
const app = express();

app.get('/api/students', async (req, res)=> {
    const [ result ] = await db.query('SELECT * FROM grades');  
       res.send({
        students: result
    });
});

app.listen(3000, () => {
    console.log("Server is listening @ localhost:3000")
});



// [  [results(as in, row data)], [field data]  ]
 //db.query returns an array; when we use the [] arount result, that is destructuing the array.  
    //and it grabs the content at index 0.  it is the same as the two coummented out lines below 

    // const dbResult = await db.query('SELECT * FROM grades');
    // const result = dbResult[0];