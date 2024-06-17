// Import required packages
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk');

// Create an array to store users
let users = [];

// Function to register a new user
async function registerUser() {
  try {
    // Make a request to Random User API
    const response = await axios.get('https://randomuser.me/api/');

    // Extract user data from response
    const userData = response.data.results[0];

    // Create a new user object with required fields
    const user = {
      id: uuidv4(),
      name: `${userData.name.first} ${userData.name.last}`,
      lastName: userData.name.last,
      sex: userData.gender,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // Add the new user to the array
    users.push(user);

    console.log(`User registered: ${user.name} (${user.sex})`);
  } catch (error) {
    console.error(error);
  }
}

// Function to get all users
function getUsers() {
  // Use Lodash to divide the array of users by sex
  const usersBySex = _.partition(users, { sex: 'male' });

  // Print the list of users to the console with Chalk formatting
  console.log(chalk.bgWhite.blue('Users:'));
  console.log(chalk.bgWhite.blue('Male:'));
  usersBySex[0].forEach((user) => console.log(`  - ${user.name}`));
  console.log(chalk.bgWhite.blue('Female:'));
  usersBySex[1].forEach((user) => console.log(`  - ${user.name}`));

  // Return the list of users
  return users;
}

// Create a server using Node.js built-in HTTP module
const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/register') {
    registerUser();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User registered successfully!');
  } else if (req.url === '/users') {
    const usersList = getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(usersList));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found!');
  }
}).listen(3000, () => {
  console.log('Server listening on port 3000');
});