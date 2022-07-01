const mysql = require("mysql");
const dbConfig = require("./config.js");
// Create a connection to the database
const connection = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout:60*60*1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout:60*60*1000,
  waitForConnections: true,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true,
});

// connection.connect(error => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
// });
connection.getConnection((error, connection) =>
{ 
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
module.exports = connection;  
