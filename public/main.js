$(document).ready(initApp);

function initApp(){
    console.log("app initialized");
    $('#add-student').on('submit', submitFormData)

    getStudents();
}

function submitFormData(e){
    e.preventDefault();

    const name = $('#name').val();
    const course = $('#course').val();
    const grade = $('#grade').val();

    // console.log(`name: ${name}, course: ${course}, grade: ${grade}`);
    addStudent(name, course, grade);

    name.val('');
    course.val('');
    grade.val('')
}

function getStudents(){
    const config = {
        url: '/api/students',
        success: resp => {
            console.log('Resp: ', resp);
            addStudentsToDom(resp.students)
        }
    }
    
    $.ajax(config);
}

function addStudentsToDom(students){
    const studentElements = [];
    const tbody = $('#student-data');

    tbody.empty();
    
    students.forEach(student => {
        const tr = $('<tr>');
        const name = $('<td>', {text: student.name});
        const course = $('<td>', { text: student.course});
        const grade = $('<td>', {text: student.grade});

        tr.append(name, course, grade)

        studentElements.push(tr);
    });

    tbody.append(studentElements);
}

function addStudent(name,course,grade){
    $.ajax({
        method: 'POST',
        url: '/api/students',
        data: {
            name: name,
            course: course,
            grade: grade
        },
        success:(resp) => {
            console.log('Student Added: ', resp);

            getStudents();
        }
    })
}