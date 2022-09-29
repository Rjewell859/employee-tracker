# employee-tracker 
    
## Table of Content
[Description](#description)
[Installation](#installation)    
[Usage](#usage)
[Demo](#demo)
[Test](#test-instructions)
[License](#license)
[Contact](#contact)


## Description

A content management system for an employee database that uses MySQL. This application uses inquirer to provide the user with the options of adding an employee, role, or department. As well the user can update an employees manager or role. The user also has the option of deleting employees roles and departments. Finally there are options to view departments, roles, and view all employees with the option to also view them by manager or department. The view functions utilize the console.table() method to display the user requested data. Primary keys and foreign keys are used to connect each employee to a role and each role to a department. 

## Installation

Use MySQL to run the schema.sql and seeds.sql from within the /db folder
Run npm install from within the /employee-tracker folder

### Usage

Type node index.js from the command line in the /employee-tracker folder
Use the prompt to interact with the database
    
### Demo



### Test Instructions

Populate the database with test employees, follow each possible path in the application use view options to confirm changes have been succesfully made

#### License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This application is covered under GNU

#### Contact

See my repositories at [Github Profile](https://github.com/rjewell859)

Email me with additional questions at headwallforest27@gmail.com
