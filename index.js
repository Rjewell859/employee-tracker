const mysql = require('mysql2');
const inquirer = require('inquirer');

var managers = []
var rolesArray = []
const questions = [{
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['Add an employee']
}, ];
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
    choices: rolesArray
  },
  {
    type: 'list',
    name: 'manager',
    message: 'Who is their manager?',
    choices: managers
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

const getRoles = function () {
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      rolesArray.push(results[i].title)
    }
  })
}
const getManagers = function () {
  db.query(`
  SELECT *
  FROM employees
  WHERE role_id = 5`, function (err, results) {
    
    for (let i = 0; i < results.length; i++) {
      managers.push(results[i].first_name + " " + results[i].last_name)
    }
  })
}


getRoles()
getManagers()

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
  db.query(`SELECT
  e.id AS "Employee ID",
  e.first_name AS "First Name",
  e.last_name AS "Last Name",
  roles.title AS Title,
  departments.department_name AS Department,
  roles.salary AS Salary,
  CONCAT((m.first_name),(' '), (m.last_name)) AS Manager
FROM employees e
JOIN roles ON e.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
INNER JOIN employees m ON e.manager_id = m.id;`, function (err, results) {
    console.table(results);
  });

}
viewAllEmployees();

var nextQuestions = function (response) {
  response = JSON.parse(response)
  switch (response.menu) {
    case 'Add an employee':
      askEmployeeQuestions();
      break;
    default:
      return;
  }

}


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
  let currentManager = ''
  let currentRole = ''
  let managerName = response.manager.split(" ");
  db.query(`SELECT id FROM roles WHERE('${response.role}' = roles.title)`, function (err, reresult) {
    if (err) {
      console.log(err);
    }
    
 (db.query(`SELECT id FROM employees WHERE ('${managerName[0]}'= employees.first_name AND '${managerName[1]}' = employees.last_name)`, function (err, result) {

  if (err) {
    console.log(err);
  }
  currentManager = result[0].id
  console.log(currentManager)
  console.log(currentManager)
  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES ("${response.firstName}", "${response.lastName}", ${reresult[0].id}, ${currentManager})`, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
    console.log('reached')
    viewAllEmployees();
    getRoles()
getManagers()
  });
}))
  });
  


}

function init() {
  askQuestions()
}

init();