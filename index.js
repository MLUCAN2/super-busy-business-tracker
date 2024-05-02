console.log(__dirname);
const inquirer= require('inquirer');
const fs= require('fs');
// sqlChoices.js file will handle the functions
const sqlChoices = require ('./db/sqlChoices');

// Use inquirer to call functions to add, remove, and view table data
async function mainMenu() {
    const {select}= await inquirer
    .prompt({
            type: 'list',
            name: 'choices',
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
// Try switch case to take in the user choice from the inquirer prompt
    switch (select) {
        case 'View all departments':
            await sqlChoices.viewDepartments();
            break;
        case 'View all roles':
            await sqlChoices.viewRoles();
            break;
        case 'View all employees':
            await sqlChoices.viewEmployees();
            break;
        case 'Add Department':
            await sqlChoices.addDepartment();
            break;
        case 'Add Roles':
            await sqlChoices.addRoles();
            break;
        case 'Add Employee':
            await sqlChoices.addEmployee();
            break;
        case 'Update Employee':
            await sqlChoices.updateEmployeeRole();
            break;
        default:
            console.log('Wrong choice. Please try again.');
            break;
    }
// Add a way to go back to the main menu
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
