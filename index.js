const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employee_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  db.query('SELECT * FROM departments', function (err, results) {
    console.log(results);
  });

  db.query('SELECT * FROM employees', function (err, results) {
    console.log(results);
  });
  db.query('SELECT * FROM roles', function (err, results) {
    console.log(results);
  });

var viewAllEmployees = function() {

  
}








  var tableTest = function () {
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}
const me = new Person("John", "Smith");
  console.table( [me],)
}
tableTest();