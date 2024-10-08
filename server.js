const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")
const bcrypt=require("bcrypt")

dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())

let userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    operator:{
        type:String,

    }

})
let User=mongoose.model("user",userSchema)

let Mongoconnect=()=>{
    try{
        mongoose.connect(process.env.MONGO_URL)
        console.log("mongodb connected")
    }catch(error){
        console.log("there is an error while connecting to mongodb")
    }

}
Mongoconnect()

app.post("/signup", async (req, res) => {
    let { name, email, password, operator } = req.body;

    try {

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        } else {

            const hashedPassword = await bcrypt.hash(password, 10);

            let value = new User({ name, email, password: hashedPassword, operator });
            await value.save();
            
            return res.status(200).json({ message: "Registration successful", value });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
});

app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {

        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {

            return res.status(200).json({ message: "Login successful", user });
        } else {

            return res.status(400).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
});


app.get('/operator/:id',async(req,res)=>{
    let id=req.params.id

    try{
        let user=await User.findById({_id:id})
        console.log(user)
        return res.status(200).json({message:"user values",user})
    }catch(error){
        console.log(error)
    }




})




app.listen(5000,(req,res)=>{
    console.log("server running on port 3000")
})