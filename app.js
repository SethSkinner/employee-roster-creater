const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const { type } = require("os");
const employeeTeam = [];

function startApp() {
    console.log("Hi there,  Let's build your Team!");
    addEmployee();
};

async function addEmployee() {
    response = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "what is the name of your employee?"
        },
        {
          type: "input",
          name: "id",
          message: "what is the id # of the employee?"
        },
        {
          type: "input",
          name: "email",
          message: "what is the employees email address?:"
        },
        {
          type: "list",
          name: "role",
          message: "what is the position of the employee?",
          choices: [
            "Manager",
            "Engineer",
            "Intern"
          ]
        }
    ]);
    let positionPrompt = "";

    if (response.role === "Manager") {
        positionPrompt = await inquirer.prompt([
            {
                type: "input",
                name: "officeNumber",
                message: "what is the office # of the manager?"
            }
        ]);
        const manager = new Manager(response.name, response.id, response.email, positionPrompt.officeNumber);
        employeeTeam.push(manager);
    };
    if (response.role === "Engineer") {
        positionPrompt = await inquirer.prompt([
            {
                type: "input",
                name: "github",
                message: "what is the employees github account?",
            }
        ]);
        const engineer = new Engineer(response.name, response.id, response.email, positionPrompt.github);
        employeeTeam.push(engineer);
    };
    if (response.role === "Intern") {
        positionPrompt = await inquirer.prompt([
            {
                type: "input",
                name: "school",
                message: "what school is the intern from?",
            }
        ]);
        const intern = new Intern(response.name, response.id, response.email, positionPrompt.school);
        employeeTeam.push(intern);
    };
    console.log(employeeTeam);
    addAnother = await inquirer.prompt([
        {   
            type: "list",
            name: "continue",
            message: "Would you like to add another employee to the team?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]);
    if (addAnother.continue === "Yes") {
        addEmployee();
    } else {
        console.log("Success!")
        console.log(employeeTeam);

        const html = render(employeeTeam);

        if (fs.existsSync(OUTPUT_DIR) === false) {
            fs.mkdirSync(OUTPUT_DIR);
        };
        await writeFileAsync(outputPath, html);
    };
};

startApp();