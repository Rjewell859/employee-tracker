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








var tableTest = function () {
  function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  const me = new Person("John", "Smith");
  console.table([me], )
}
tableTest();