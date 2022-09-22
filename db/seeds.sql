INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Human Resources"),
       ("Engineering"),
       ("Management");
       
INSERT INTO roles (title, salary, department_id)
VALUES ("Test", 50, 2),
       ("Fisherman", 50, 2),
       ("Janitor", 9, 3),
       ("Nothing", 32123, 1),
       ("Manager", 10099000, 4);

       SELECT * FROM roles;
       
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Junior", 4, 1),
       ("Boat", "Sam", 2, 1),
       ("Tater", "Foot", 3, 1),
       ("Smeckle", "Goat", 1, 1);

       SELECT * FROM employees;


       
