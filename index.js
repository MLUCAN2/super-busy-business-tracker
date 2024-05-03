console.log(__dirname);
const inquirer= require('inquirer');
const db=require('./db/connection');

// Use inquirer to call functions to add, remove, and view table data
async function mainMenu() {
    const {select}= await inquirer
    .prompt({
            type: 'list',
            name: 'select',
            message: 'Choose from the following options:',
            choices: [
                'View all departments', 
                'View all roles',
                'View all employees',
                'Add Department',
                'Add Roles',
                'Add Employee',
                'Update Employee'
            ]

    });
    console.log(select);
// Try switch case to take in the user choice from the inquirer prompt
    switch (select) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Roles':
            await addRoles();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee':
            await updateEmployeeRole();
            break;
        default:
            console.log('Wrong choice. Please try again.');
            break;
    }

    
// Functions to handle user input
    const {back}= await inquirer.prompt({
        type: 'confirm',
        name: 'back',
        message: 'Would you like to go back to the main menu?'
    });
    if (back) {
        await mainMenu();
    } else {
        console.log('Thank you!');
    }
    
}
mainMenu();

async function viewAllDepartments() {
    try {
        const departments= await db.query('SELECT * FROM departments');
        console.table(departments.rows);
    }
    catch(err) {
        console.error('Could not view departments: ', err);
    }
}
async function viewAllRoles() {
    try {
        const roles= await db.query('SELECT roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON departments.id=roles.department_id');
        console.table(roles.rows);
    }
    catch(err) {
        console.error('Could not view roles: ', err);
    }
}

async function viewAllEmployees() {
    try {
        const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", roles.title, departments.department_name AS department, roles.salary, manager.first_name || ' ' || manager.last_name AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
        const employees= await db.query(sql);
        console.table(employees.rows);
    }
    catch(err) {
        console.error('Could not view employees: ', err);
    }
}

async function addDepartment() {
    try {
        const{answer}= await inquirer.prompt ([{
            type: 'input',
            name: 'answer',
            message: 'What is the new department name?'
        }])
        const newDepartment= await db.query('INSERT INTO departments (department_name) VALUES ($1) RETURNING *', [answer]);
        console.table(newDepartment.rows);
        console.log('Added new department: '+ answer);
    }
    catch(err) {
        console.error('Could not add department: ', err);
    }
}

async function addRoles() {
        try {
            const {rows}= await db.query('select id as value, department_name as name from departments')
            const answers= await inquirer.prompt ([{
                type: 'input',
                name: 'title',
                message: 'What is the title of the new role?'
            },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?'
        },
    {
        type: 'list',
        name: 'department',
        message: 'Choose the department.',
        choices: rows
    }])
            const newRole= await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [answers.title, answers.salary, answers.department]);
            console.table(newRole.rows);
            console.log('Added new role: '+ answers.title);
        }
        catch(err) {
            console.error('Could not add role: ', err);
        }
    }

async function addEmployee() {
    try {
        const roles= await db.query ('SELECT id, title FROM roles');
        const managerQuery= [{value: null,name: 'None'}];
        const managers= await db.query ('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');

        if (managers.rows.length> 0){
            managerQuery.push(...managers.rows.map(manager=>({value: manager.id, name: `${manager.first_name} ${manager.last_name}`})));
        }
        const roleChoices= roles.rows.map(role=> ({value: role.id, name: role.title}));
        const answers= await inquirer.prompt ([{
            
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the new employee?'
        },
        {
            type:'input',
            name: 'last_name',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Choose the role.',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the manager?',
            choices: managerQuery
        }
    ])

        if (!managers.rows.length && answers.manager_id===null){
            const newEmployee= await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [answers.first_name, last_name, role_id, manager_id])
            console.table(newEmployee.rows);
            console.log('Added new employee: ', answers);
        }
        else if (answers.manager_id !== null){
            const newEmployee= await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id])
            console.table(newEmployee.rows);
            console.log('Added new employee: ', answers);
        }
        else {
            console.log('Manager is required to add the employee')
        }

        }
        catch(err) {
            console.error('Could not add employee: ', err);
        }
    }
async function updateEmployeeRole(employee_id, role_id) {
    try {
        const employees= await db.query('SELECT id, first_name, last_name FROM employee');
        const {employee_id}= await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Choose the employee.',
                choices: employees.rows.map(employee=> ({
                    value: employee.id, 
                    name: `${employee.first_name} ${employee.last_name}`
                }))
            }
        ]);

        const roles= await db.query('SELECT id, title FROM roles');
        const {role_id}= await inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: 'Choose the role.',
                choices: roles.rows.map(role=> ({
                    value: role.id, 
                    name: role.title
                }))
            }
        ]);

        const updatedEmployee= await db.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
        console.log('Updated employee role: ', updatedEmployee);
    }
    catch(err) {
        console.error('Could not update employee role: ', err);
    }
};

