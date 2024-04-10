USE employee_db;

-- Insert sample departments
INSERT INTO department (name) VALUES
    ('Sales'),
    ('Marketing'),
    ('Finance');

-- Insert sample roles
INSERT INTO roles (id, title, salary, department_id) VALUES
    (1, 'Sales Associate', 50000, 1),
    (2, 'Marketing Coordinator', 55000, 2),
    (3, 'Finance Manager', 75000, 3);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),  -- Sales Associate
    ('Jane', 'Smith', 2, 1),    -- Marketing Coordinator, managed by John Doe
    ('Michael', 'Johnson', 3, NULL); -- Finance Manager