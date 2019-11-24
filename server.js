const express = require('express');
const db = require('./db');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname,'public')));

app.get('/api/students', async (req, res)=> {
    const [ result ] = await db.query('SELECT * FROM grades');  
       res.send({
        students: result
    });
});

app.get('/api/students/:id', async (req,res) =>{

    const { id } = req.params;
//write a JOING query to get a grade record and related assignments
//send data back in response
//if no data was found, record property should be null

//SELECT a.name AS assignment_name, a.grade AS assignment_grade, g.grade AS cumulative_grade FROM `assignments` AS a JOIN `grades` AS g ON a.grade_id = g.id WHERE g.id = 2
    const [[ record ]] = await db.execute(` 
        SELECT a.name AS assignment_name, a.grade AS assignment_grade, g.grade AS cumulative_grade 
        FROM assignments AS a 
        JOIN grades AS g 
        ON a.grade_id = g.id 
        WHERE g.id =?`,
        [id]);

        
    if (!record.assignment_name){
        res.send({
            message: "NULL"
        })
        return;
    }

// line 22 const [[ result ]] is so that, since the returned is always expected to be only ever one object, we need to destructure again so that the front end doesn't have to deal with data being in [{}].
// this is the same thing as doing result[0];

    res.send({
        message: `Getting a grade record and assignments for grade ID: ${id}`,
        record: record
    });
})

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

app.listen(PORT, () => {
    console.log("Server is listening @ localhost: " + PORT)
});



// [  [results(as in, row data)], [field data]  ]
 //db.query returns an array; when we use the [] arount result, that is destructuing the array.  
    //and it grabs the content at index 0.  it is the same as the two coummented out lines below 

    // const dbResult = await db.query('SELECT * FROM grades');
    // const result = dbResult[0];