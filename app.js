const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const products_routes = require("./routes/products");
const users_routes = require("./routes/user/user");
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hi, Welcome to hardware  ");
});


app.use("/api/products",products_routes);
app.use("/api/v1/users",users_routes);







const start = async () =>{
    try{
        app.listen(PORT,()=>{
          console.log( `Server is running on port ${PORT}`) ;
        });
    } catch(error){
        console.log(error);
    }
}
start();
