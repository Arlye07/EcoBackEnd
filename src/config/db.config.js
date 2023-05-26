require('dotenv').config()

 module.exports = {
     dbAdmin: process.env.DB_ADMIN,
     dbPassword: process.env.DB_PASSWORD,
     dbHost: process.env.DB_HOST,
     dbName: process.env.DB_NAME,
 }
//  module.exports = {
//  dbAdmin:'admin',
//  dbPassword:'admin',
//  dbHost:'ecommerce.wyifhv5.mongodb.net',
//  dbName:51120,
//  }

//process.env.DB_ADMIN
//process.env.DB_PASSWORD
//process.env.DB_HOST
//process.env.DB_NAME