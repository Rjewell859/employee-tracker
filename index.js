const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to database

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employees_db database.`)
);


// Gets all employees from database

var getEmployees = function () {
  let employees = []
  db.query(`SELECT * FROM employees`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      employees.push(results[i].first_name + " " + results[i].last_name)
    }
  })
  return employees
}

// Gets all departments from database

var getDepartments = function () {
  let departments = []
  db.query(`SELECT * FROM departments`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      departments.push(results[i].department_name)
    }
  })
  return departments
}

// Gets all roles from database

var getRoles = function () {
  let roles = []
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title)
    }
  })
  return roles
}

// Gets all managers from database

var getManagers = function () {
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

// Declaring main menu questions

const questions = [{
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['Add an employee', 'Add a department', 'Add a role', 'View all employees', 'View employees by manager', 'View employees by department', 'View all departments', 'View all roles', 'Update an employee role', 'Update an employee manager', 'Delete department', 'Delete role', 'Delete employee', 'Exit']
}, ];

// Updates and declares employee questions with current employees and roles

var refreshEmpQuestions = function () {
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
  return empQuestions
}

const departmentQuestion = {
  type: 'input',
  name: 'departmentName',
  message: 'What is the department name?'
}

// Updates and declares role questions with current departments.

var refreshRoleQuestions = function () {
  const roleQuestions = [{
      type: 'input',
      name: 'roleName',
      message: 'What is the role name?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary?'
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department is this role in?',
      choices: getDepartments()
    },
  ];
  return roleQuestions
}

// Declaring update questions

const updateRoleQuestions = [{
    type: 'list',
    name: 'employee',
    message: 'Which employee would you like to switch roles?',
    choices: getEmployees()
  },
  {
    type: 'list',
    name: 'role',
    message: 'Which role to assign?',
    choices: getRoles()
  },
];
const updateManagerQuestions = [{
    type: 'list',
    name: 'employee',
    message: 'Which employee would you like to switch managers?',
    choices: getEmployees()
  },
  {
    type: 'list',
    name: 'manager',
    message: 'Which manager to assign?',
    choices: getManagers()
  },
];

// Declaring delete questions

const deleteEmployeeQuestions = [{
  type: 'list',
  name: 'employee',
  message: 'Which employee to delete?',
  choices: getEmployees()
}, ];

const deleteDepQuestions = [{
  type: 'list',
  name: 'department',
  message: 'Which department to delete?',
  choices: getDepartments()
}, ];

const deleteRoleQuestions = [{
  type: 'list',
  name: 'role',
  message: 'Which role to delete?',
  choices: getRoles()
}, ];


// Function to select and display all employees with console.table()

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

// Function to view all employees ordered by their assigned manager

var viewByManager = function () {
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
INNER JOIN employees m ON e.manager_id = m.id
ORDER BY manager;`, function (err, results) {
    console.log('\n')
    console.table(results);
  });
  askQuestions();
}

// Function to view all employees ordered by their department

var viewByDepartment = function () {
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
INNER JOIN employees m ON e.manager_id = m.id
ORDER BY department;`, function (err, results) {
    console.log('\n')
    console.table(results);
  });
  askQuestions();
}

// Selects and displays all roles

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

// Selects and displays all departments

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

// Creates a department that takes user input to assign a department name

var addDepartment = function (response) {
  response = JSON.parse(response)
  let toInsert = response.departmentName
  db.query(`INSERT INTO departments (department_name) VALUES(?)`, toInsert, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
  askQuestions();
}

// Creates a role that has title, salary and department id as parameters

var addRole = function (response) {
  response = JSON.parse(response)
  db.query(`SELECT id FROM departments WHERE('${response.department}' = departments.department_name)`, function (err, departmentResult) {
    if (err) {
      console.log(err);
    }
    let toInsert = [
      [response.roleName, response.salary, departmentResult[0].id]
    ];
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES(?)`, toInsert, function (err, result) {
      if (err) {
        console.log(err);
      }
    });
    askQuestions();
  })
}

// Function to create an employee with first name, last name, role id, and manager id as parameters

var addEmployee = function (response) {
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
        // Returns to menu, continues to prompt user
        askQuestions()
      });
    }))
  });

}

// Reassigns an employees role

var updateEmployeeRole = function (response) {
  response = JSON.parse(response)
  let employeeName = response.employee.split(" ")
  let currentId = ''
  let currentRole = ''
  db.query(`SELECT id FROM roles WHERE('${response.role}' = roles.title)`, function (err, roleresult) {
    
    if (err) {
      console.log(err);
    }
 
    (db.query(`SELECT id FROM employees WHERE ('${employeeName[0]}'= employees.first_name AND '${employeeName[1]}' = employees.last_name)`, function (err, result) {
      currentRole = roleresult[0].id
      currentId = result[0].id

      if (err) {
        console.log(err);
      }
      db.query(`UPDATE employees
    SET employees.role_id = ${currentRole}
    WHERE employees.id = ${currentId};
    `, function (err, result) {
        if (err) {
          console.log(err);
        }
        askQuestions()
      });
    }))
  })
}

// Reassigns an employee manager

var updateEmployeeManager = function (response) {
  response = JSON.parse(response)
  let employeeName = response.employee.split(" ")
  let managerName = response.manager.split(" ")
  let currentManager = ''
  let currentId = ''
  db.query(`SELECT id FROM employees WHERE ('${employeeName[0]}'= employees.first_name AND '${employeeName[1]}' = employees.last_name)`, function (err, result) {
    if (err) {
      console.log(err);
    }

    (db.query(`SELECT id FROM employees WHERE ('${managerName[0]}'= employees.first_name AND '${managerName[1]}' = employees.last_name)`, function (err, manresult) {
      currentId = result[0].id
      currentManager = manresult[0].id
      if (err) {
        console.log(err);
      }
      db.query(`UPDATE employees
    SET employees.manager_id = ${currentManager}
    WHERE employees.id = ${currentId};
    `, function (err, result) {
        if (err) {
          console.log(err);
        }
        askQuestions()
      });
    }))
  })
}

// Takes a department name and deletes the matching department from the database

var deleteDepartment = function (response) {
  response = JSON.parse(response)
  let department = response.department
  db.query(`DELETE FROM departments WHERE ( '${department}' = departments.department_name )`, function (err, result) {
    if (err) {
      console.log(err);
    }
    askQuestions()
  });
}

// Takes a role name and deletes the matching role from the database

var deleteRole = function (response) {
  response = JSON.parse(response)
  let role = response.role
  db.query(`DELETE FROM roles WHERE ('${role}'= roles.title)`, function (err, result) {
    if (err) {
      console.log(err);
    }
    askQuestions()
  });
}

// Takes an employee name and deletes the matching employee from the database

var deleteEmployee = function (response) {
  response = JSON.parse(response)
  let employeeName = response.employee.split(" ")
  db.query(`DELETE FROM employees WHERE ('${employeeName[0]}'= employees.first_name AND '${employeeName[1]}' = employees.last_name)`, function (err, result) {
    if (err) {
      console.log(err);
    }
    askQuestions()
  });
}

// Holds switch statement to follow up on menu questions

var nextQuestions = function (response) {
  response = JSON.parse(response)
  switch (response.menu) {
    case 'Add an employee':
      askEmployeeQuestions();
      break;
    case 'Add a department':
      askDepartmentQuestions();
      break;
    case 'Add a role':
      askRoleQuestions();
      break;
    case 'View all employees':
      viewAllEmployees();
      break;
    case 'View employees by manager':
      viewByManager();
      break;
    case 'View employees by department':
      viewByDepartment();
      break;
    case 'View all departments':
      viewAllDepartments();
      break;
    case 'View all roles':
      viewAllRoles();
      break;
    case 'Update an employee role':
      askUpdateRoleQuestions();
      break;
    case 'Update an employee manager':
      askUpdateManagerQuestions();
      break;
    case 'Delete employee':
      askDeleteEmpQuestions();
      break;
    case 'Delete department':
      askDeleteDepQuestions();
      break;
    case 'Delete role':
      askDeleteRoleQuestions();
      break;
    default:
      return;
  }
}

// Ask main menu questions

var askQuestions = function () {
  inquirer
    .prompt(questions)
    .then((data) =>
      nextQuestions(JSON.stringify(data))
    )
}

// Ask questions for creating an employee

var askEmployeeQuestions = function () {
  inquirer
    .prompt(refreshEmpQuestions())
    .then((data) =>
      addEmployee(JSON.stringify(data))
    )
}

// Ask questions for creating a department

var askDepartmentQuestions = function () {
  inquirer
    .prompt(departmentQuestion)
    .then((data) =>
      addDepartment(JSON.stringify(data))
    )
}

// Ask questions for creating a role

var askRoleQuestions = function () {
  inquirer
    .prompt(refreshRoleQuestions())
    .then((data) =>
      addRole(JSON.stringify(data))
    )
}

// Ask questions for updating a role

var askUpdateRoleQuestions = function () {
  inquirer
    .prompt(updateRoleQuestions)
    .then((data) =>
      updateEmployeeRole(JSON.stringify(data))
    )
}

// Ask questions for updating an employees manager

var askUpdateManagerQuestions = function () {
  inquirer
    .prompt(updateManagerQuestions)
    .then((data) =>
      updateEmployeeManager(JSON.stringify(data))
    )
}

// Ask a question for deleting an employee
var askDeleteEmpQuestions = function () {
  inquirer
    .prompt(deleteEmployeeQuestions)
    .then((data) =>
      deleteEmployee(JSON.stringify(data))
    )
}

// Ask a question for deleting a department

var askDeleteDepQuestions = function () {
  inquirer
    .prompt(deleteDepQuestions)
    .then((data) =>
      deleteDepartment(JSON.stringify(data))
    )
}

// Ask a question for deleting a role

var askDeleteRoleQuestions = function () {
  inquirer
    .prompt(deleteRoleQuestions)
    .then((data) =>
      deleteRole(JSON.stringify(data))
    )
}

// Start the application

function init() {
  askQuestions()
}
init();