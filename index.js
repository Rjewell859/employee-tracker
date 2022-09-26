const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employees_db database.`)
);

const getRoles = function () {
  let roles = []
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title)
    }
  })
  return roles
}
const getManagers = function () {
  let managers = []
  db.query(`
  SELECT
  e.first_name,
  e.last_name
FROM employees e
JOIN roles ON e.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
WHERE department_name = "Management";`, function (err, results) {

    for (let i = 0; i < results.length; i++) {
      managers.push(results[i].first_name + " " + results[i].last_name)
    }
  })
  return managers
}

const questions = [{
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['Add an employee', 'Add a department', 'Add a role', 'View all employees', 'View all departments', 'View all roles', 'Exit']
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
    choices: getRoles()
  },
  {
    type: 'list',
    name: 'manager',
    message: 'Who is their manager?',
    choices: getManagers()
  },
];

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
    console.log('\n')
    console.table(results);
  });
  askQuestions();
}

var viewAllRoles = function () {
  db.query(`SELECT 
  r.id AS "Role ID",
  r.title AS "Title",
  r.salary AS "Salary",
  departments.department_name AS Department
  FROM roles r
  JOIN departments ON r.department_id = departments.id`, function (err, results) {
    console.log('\n')
    console.table(results);
  });
  askQuestions();
}

var viewAllDepartments = function () {
  db.query(`SELECT
  d.id AS "Department ID",
  d.department_name AS "Department Name"
  FROM departments d`, function (err, results) {
    console.log('\n')
    console.table(results);
  });
  askQuestions();
}

var addDepartment = function() {}
var addRole = function() {}

var nextQuestions = function (response) {
  response = JSON.parse(response)
  switch (response.menu) {
    case 'Add an employee':
      askEmployeeQuestions();
      break;
    case 'View all employees':
      viewAllEmployees();
      break;
    case 'View all departments':
      viewAllDepartments();
      break;
    case 'View all roles':
      viewAllRoles();
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

  db.query(`SELECT id FROM roles WHERE('${response.role}' = roles.title)`, function (err, roleresult) {
    if (err) {
      console.log(err);
    }
    (db.query(`SELECT id FROM employees WHERE ('${managerName[0]}'= employees.first_name AND '${managerName[1]}' = employees.last_name)`, function (err, result) {

      currentRole = roleresult[0].id
      currentManager = result[0].id

      if (err) {
        console.log(err);
      }
      db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES ("${response.firstName}", "${response.lastName}", ${currentRole}, ${currentManager})`, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
        console.log('reached')
        askQuestions()
      });
    }))
  });

}

function init() {
  askQuestions()
}
init();