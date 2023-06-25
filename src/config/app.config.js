require('dotenv').config()
module.exports ={
    port:8080,
    log_env:process.env.LOG_ENV || 'development'
}




// module.exports = {
//     port: process.env.PORT ||8080,
// }