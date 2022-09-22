SELECT
  employees.first_name AS "First Name", roles.title AS Title
FROM employees
JOIN roles ON employees.role_id = roles.id;

SELECT
  roles.title AS "Role", departments.department_name AS Department
FROM roles
JOIN departments ON roles.department_id = departments.id;