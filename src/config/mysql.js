const mysql = require('mysql')
require('dotenv').config({ path: '../../.env' })

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  timezone: process.env.TIMEZONE,
  insecureAuth: false
})

connection.connect((error) => {
  if (error) {
    console.log(`Turn on the database! ${error}`)
  } else {
    console.log('You are now connected to database ...')
  }
})

module.exports = connection
