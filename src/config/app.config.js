require('dotenv').config()
module.exports ={
    port: process.env.PORT || 8080,
    log_env:process.env.LOG_ENV || 'development',
    secret_key: process.env.SECRET_KEY || 'defaultSecretKey'
}




// module.exports = {
//     port: process.env.PORT ||8080,
// }