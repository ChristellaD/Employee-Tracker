import { prompt } from 'inquirer';
import pool from '../server/pool';
;


async function viewDepartments() {
    const query = 'SELECT * FROM departments';
    pool.query(query, (error, results) => {
        if (error) throw error;
        console.table(results);
    });
}

async function viewRoles() {
    // Execute SQL query to retrieve roles
    const query = 'SELECT * FROM roles';
    pool.query(query, (error, results) => {
        if (error) throw error;
        console.table(results);
    });
}

async function viewEmployees() {
    // Execute SQL query to retrieve employees
    const query = 'SELECT * FROM employees';
    pool.query(query, (error, results) => {
        if (error) throw error;
        console.table(results);
    });
}

// Main menu prompt using Inquirer
async function viewAll() {
    const { action } = await prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to view?',
        choices: ['Departments', 'Roles', 'Employees']
    });

    switch (action) {
        case 'Departments':
            await viewDepartments();
            break;
        case 'Roles':
            await viewRoles();
            break;
        case 'Employees':
            await viewEmployees();
            break;
        default:
            console.log('Invalid choice');
    }
};
async function addEmployee() {
    const roles = await fetchRoles();
    const managers = await fetchManagers();

    const employeeDetails = await prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },{
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee:',
            choices: managers.map(manager => ({ name: `${manager.firstName} ${manager.lastName}`, value: manager.id })),
            default: 'No Manager',
            loop: false
        }
    ]);
    await insertEmployee(employeeDetails);
}
    
async function fetchRoles() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id, title FROM roles', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
};

async function fetchManagers() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id, firstName, lastName FROM employees WHERE managerId IS NULL', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

async function addDepartment() {
    await fetchDepartments();
    const departmentDetails = await prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department you would like to add.' 
});
    await insertDepartment(departmentDetails);
};

async function fetchDepartments() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT departments', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
};

async function insertDepartment(departmentDetails) {
    const query = 'INSERT INTO department (departments) VALUES (?)';
    pool.query(query, departmentDetails.departments, (error, results) => {
        if (error) {
            console.error('Error adding department: ', error);
        } else {
            console.log('Department added successfully!');
        }
    })
};

async function insertEmployee(employeeDetails) {
    const query = 'INSERT INTO employees (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)';
    pool.query(query, [employeeDetails.firstName, employeeDetails.lastName, employeeDetails.roleId, employeeDetails.managerId], (error, results) => {
        if (error) {
            console.error('Error adding employee:', error);
        } else {
            console.log('Employee added successfully!');
        }
    });
};

async function addRole() {
    const departments = await fetchDepartments();
    const roleDetails = await prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departments.map(department => ({ name: department.name, value: department.id }))
        }]
    );
    await insertRole(roleDetails);
};

async function insertRole(roleDetails) {
    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    pool.query(query, [roleDetails.title, roleDetails.salary, roleDetails.departmentId], (error, results) => {
        if (error) {
            console.error('Error adding role:', error);
        } else {
            console.log('Role added successfully!');
        }
    });
};

async function addAll() {
    const { action } = await prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to add?',
        choices: ['Department', 'Role', 'Employee']
    });

    switch (action) {
        case 'Departments':
            await addDepartment();
            break;
        case 'Roles':
            await addRole();
            break;
        case 'Employees':
            await addEmployee();
            break;
        default:
            console.log('Invalid choice');
    };
};


async function mainMenu() {
    const { action } = await prompt({
        
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments, roles, or employees',
                'Add a department, role, or employee',
                'Add a role',
                'Add an employee',
                'Update an employee role']
            });

    switch (action) {
    case 'view':
        await viewAll();
        break;
    case 'add':
        await addAll();
        break;
        }
};

mainMenu();