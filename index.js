const mysql = require('mysql2');
const inquirer = require('inquirer');

const questions = [{
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['Add an employee']
},
];
const empQuestions = [{
  type: 'input',
  name: 'firstName',
  message: 'What is their first name?',
},
{
  type: 'input',
  name: 'lastName',
  message: 'What is their last name?',
},
{
  type: 'list',
  name: 'role',
  message: 'What is their role?',
  choices: ['1', '2', '3', '4']
},
{
  type: 'list',
  name: 'manager',
  message: 'Who is their manager?',
  choices: ['1', '2', '3', '4']
},
];

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employees_db database.`)
);
db.query(`SELECT
employees.first_name AS "First Name", roles.title AS Title
FROM employees
JOIN roles ON employees.role_id = roles.id;`, function (err, results) {
  console.table(results);
});

db.query(`SELECT
  roles.title AS "Role", departments.department_name AS Department
  FROM roles
  JOIN departments ON roles.department_id = departments.id;`, function (err, results) {
  console.table(results);
});



var viewAllEmployees = function () {
  db.query('SELECT * FROM employees', function (err, results) {
    console.table(results);
  });

}
viewAllEmployees();

var nextQuestions = function(response) {
  response = JSON.parse(response)
  switch (response.menu) {
    case 'Add an employee':
        askEmployeeQuestions();
        break;
    default:
        return;
}
  
}






var tableTest = function () {
  function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  const me = new Person("John", "Smith");
  console.table([me], )
}
tableTest();

var askQuestions = function () {
  inquirer
      .prompt(questions)
      .then((data) =>
          nextQuestions(JSON.stringify(data))
      )
}

var askEmployeeQuestions = function () {
  inquirer
      .prompt(empQuestions)
      .then((data) =>
          saveEmployee(JSON.stringify(data))
      )
}

var saveEmployee = function (response) {
  response = JSON.parse(response);
  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES ("${response.firstName}", "${response.lastName}", ${response.role}, ${response.manager})`, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  console.log('reached')
  viewAllEmployees();
}

function init() {
  askQuestions()
}

init();