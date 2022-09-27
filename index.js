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



var getEmployees = function () {
  let employees = []
  db.query(`SELECT * FROM employees`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      employees.push(results[i].first_name + " " + results[i].last_name)
    }
  })
  return employees
}
var getDepartments = function () {
  let departments = []
  db.query(`SELECT * FROM departments`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      departments.push(results[i].department_name)
    }
  })
  return departments
}

var getRoles = function () {
  let roles = []
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title)
    }
  })
  return roles
}
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

const questions = [{
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['Add an employee', 'Add a department', 'Add a role', 'View all employees', 'View employees by manager', 'View employees by department', 'View all departments', 'View all roles', 'Update an employee role', 'Update an employee manager', 'Delete employee', 'Exit']
}, ];
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

// These do not refresh with updated roles, employees, or managers - ERROR!

var updateRoleQuestions = [{
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
var updateManagerQuestions = [{
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

var deleteEmployeeQuestions = [{
  type: 'list',
  name: 'employee',
  message: 'Which employee to delete?',
  choices: getEmployees()
}, ];



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

var addDepartment = function (response) {
  response = JSON.parse(response)
  let toInsert = response.departmentName
  db.query(`INSERT INTO departments (department_name) VALUES(?)`, toInsert, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  askQuestions();
}
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
      console.log(result);
    });
    askQuestions();
  })
}

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
        console.log(result);
        console.log('reached')
        askQuestions()
      });
    }))
  });

}

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

var deleteDepartment = function () {

}
var deleteRole = function () {

}
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
    .prompt(refreshEmpQuestions())
    .then((data) =>
      addEmployee(JSON.stringify(data))
    )
}

var askDepartmentQuestions = function () {
  inquirer
    .prompt(departmentQuestion)
    .then((data) =>
      addDepartment(JSON.stringify(data))
    )
}

var askRoleQuestions = function () {
  inquirer
    .prompt(refreshRoleQuestions())
    .then((data) =>
      addRole(JSON.stringify(data))
    )
}

var askUpdateRoleQuestions = function () {
  inquirer
    .prompt(updateRoleQuestions)
    .then((data) =>
      updateEmployeeRole(JSON.stringify(data))
    )
}
var askUpdateManagerQuestions = function () {
  inquirer
    .prompt(updateManagerQuestions)
    .then((data) =>
      updateEmployeeManager(JSON.stringify(data))
    )
}

var askDeleteEmpQuestions = function () {
  inquirer
    .prompt(deleteEmployeeQuestions)
    .then((data) =>
      deleteEmployee(JSON.stringify(data))
    )
}

function init() {
  askQuestions()
}
init();