const express = require("express")
const app = express();
const bcryptjs = require('bcryptjs');
// Connect DB
require('./db/connection')

// Import Files
const User = require('./models/Users');
const routes = require('./routes/route')

// PORT 
const port = process.env.PORT || 8000;

// App Use
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(routes)

app.get('/' , (req,res) => {
    res.send('welcome')
});

// app.post('/api/register' , async (req,res,next)=>{
//     try{
    
//         const { fullName , email , password } = req.body;

//         if(!fullName || !email || !password){
//             res.status(400).send("Please fill all the required details");
//         } else {
//             const isAlreadyExists = await User.findOne({email});
//             if(isAlreadyExists){
//                 res.status(400).send("User already present")
//             } else {
//                 const newUser = new User({fullName , email})
//                 bcryptjs.hash(password,10,(err,hashedPassword)=>{
//                     newUser.set('password' , hashedPassword);
//                     newUser.save();
//                     next();
//                 })
//                 console.log('data:' , newUser)
//                 return res.status(200).send("User registered Successfully")
//             }
//         }
//     } catch(error){
//         console.log('Error: ',error)
//     }
// });

app.listen(port , () => {
    console.log('Listening on port',port)
});