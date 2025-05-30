const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({path:'./config.env'})

const port = process.env.PORT


const DB = process.env.DATABASE.replace(
    '<db_password>',
    process.env.PASSWORD
)
//connect to DB
mongoose
.connect(DB, {
    useNewUrlParser: true
})
.then(()=>{
    console.log('uhhh')
})


app.listen(port, ()=>{
    console.log(port)
})