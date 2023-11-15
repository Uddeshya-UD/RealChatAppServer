const mongoose = require('mongoose');

const url = "mongodb+srv://uddeshya:admin12321@cluster0.xwvhyzl.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {
}).then(()=>{
    console.log('Connected to db')
}).catch((e)=> console.log('Error:' , e))


