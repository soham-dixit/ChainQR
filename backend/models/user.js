const mongoose=require('mongoose');
// mongoose.connect('mongodb://0.0.0.0:27017/closedcred');
mongoose.connect("mongodb+srv://sohamddixit:0W0VzbPqsRYQz1Pr@closedcred.2lpyt.mongodb.net/?retryWrites=true&w=majority&connectTimeoutMS=30000").then(()=>{
    console.log("mongo DB connected succesfuly")}).catch((err)=>{console.log(err)});

const userSchema=mongoose.Schema({
    Name:String,
    UpiID:String,
    AccountID:String,
    RawID:String,
    RoundUpContractAddress:String
})

const user=mongoose.model("user",userSchema)
module.exports=user;