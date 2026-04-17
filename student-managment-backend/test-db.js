const sequelize = require('./config/db');
const fs = require('fs');

async function testConnection() {
    try {
        await sequelize.authenticate();
        fs.writeFileSync('db-status.txt', 'SUCCESS: Connection established');
    } catch (error) {
        fs.writeFileSync('db-status.txt', 'FAILURE: ' + error.message + '\n' + JSON.stringify(error, null, 2));
    }
    process.exit();
}

testConnection();
