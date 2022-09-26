INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Networking"),
       ("Engineering"),
       ("Systems"),
       ("Management");
       
       
INSERT INTO roles (title, salary, department_id)
VALUES 
       ("Telemarketer", 63000, 1),
       ("Sales Consultant", 80000, 1),
       ("Sales Representative", 95000, 1),
       ("Cyber Security Analyst", 94000, 2),
       ("IT Specialist", 78000, 2),
       ("Full-Stack Web Developer", 118000, 3),
       ("Junior Software Engineer", 115000, 3),
       ("Senior Front-End Developer", 165000, 3),
       ("Systems Architect", 174000, 4),
       ("Database Administrator", 130000, 4),
       ("Sales Manager", 110000, 5),
       ("Software Engineering Manager", 10099000, 5);

       SELECT * FROM roles;
       
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Monique", "Jada", 12, 1),
       ("Leo", " Casey", 4, 1),
       ("Clare", "Loa", 6, 1),
       ("Gorden", "Ivy", 8, 1),
       ("Vincent", "Callie", 10, 1),
       ("Therese", "Alphonso", 2, 1),
       ("Kathie", "Carlene", 11, 1),
       ("Brion", "Cammie", 1, 1);


       
