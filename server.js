const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

app.get('/api/students', async (req, res)=> {
    const [ result ] = await db.query('SELECT * FROM grades');  
       res.send({
        students: result
    });
});

app.post('/api/students',async(req,res) => {
    
    const { name, course, grade } = req.body;

    const errors = [];

    if(!name){
        errors.push('No student name recieved');
    }
    if(!course){
        errors.push('No student course received');
    }
    if(!grade && grade !== 0){
        errors.push('No student grade received');
    }else if (isNaN(grade)){
        errors.push('Student course grade must be a number');
    }else if (grade < 0 || grade > 100){
        errors.push('Student grade is not valid')
    }

    if(errors.length){
        res.status(422).send({
            errors: errors
        });
        return;
    };

    // const [ result ] = await db.query(`
    //     INSERT INTO grades 
    //     (name, course, grade) 
    //     VALUES ("${name}", "${course}", ${grade});
    // `);

    const [ result ] = await db.execute(`
        INSERT INTO grades 
        (name, course, grade) 
        VALUES (?, ?, ?);
    `, [name, course, grade]);

    console.log('Add Student Result: ', result);
    
    res.send({
        message: `Successfully added grade record for ${name}`,
        student:{
            id: result.insertId,
            name: name,
            course: course,
            grade: grade
        }
    })

})

app.listen(3000, () => {
    console.log("Server is listening @ localhost:3000")
});



// [  [results(as in, row data)], [field data]  ]
 //db.query returns an array; when we use the [] arount result, that is destructuing the array.  
    //and it grabs the content at index 0.  it is the same as the two coummented out lines below 

    // const dbResult = await db.query('SELECT * FROM grades');
    // const result = dbResult[0];