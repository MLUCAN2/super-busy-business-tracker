const db= require('./db');


// Functions to interact with database
async function viewAllDepartments() {
    try {
        const departments= await db.query('SELECT * FROM departments');
        console.table(departments.rows);
    }
    catch(err) {
        console.err('Could not view departments: ', err);
    }
}
async function viewAllRoles() {
    try {
        const roles= await db.query('SELECT * FROM roles');
        console.table(roles.rows);
    }
    catch(err) {
        console.err('Could not view roles: ', err);
    }
}

async function viewAllEmployees() {
    try {
        const employees= await db.query('SELECT * FROM employees');
        console.table(employees.rows);
    }
    catch(err) {
        console.err('Could not view employees: ', err);
    }
}

async function addDepartment(name) {
    try {
        const newDepartment= await db.query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name]);
        console.table(newDepartment.rows);
        console.log('Added new department: ', newDepartment);
    }
    catch(err) {
        console.err('Could not add department: ', err);
    }
}

async function addRole(title, salary, department_id) {
    try {
        const newRole= await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
        console.table(newRole.rows);
        console.log('Added new role: ', newRole);
    }
    catch(err) {
        console.err('Could not add role: ', err);
    }
}

async function addEmployee(first_name, last_name, role_id, manager_id) {
    try {
        const newEmployee= await db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
        console.table(newEmployee.rows);
        console.log('Added new employee: ', newEmployee);
    }
    catch(err) {
        console.err('Could not add employee: ', err);
    }
}
async function updateEmployeeRole(employee_id, role_id) {
    try {
        const updatedEmployee= await db.query('UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
        console.table(updatedEmployee.rows);
        console.log('Updated employee role: ', updatedEmployee);
    }
    catch(err) {
        console.err('Could not update employee role: ', err);
    }
}

module.exports= { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole};
