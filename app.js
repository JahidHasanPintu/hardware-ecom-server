const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const users_routes = require("./routes/user/user");
const brands_routes = require("./routes/brand/brand");
const categories_routes = require("./routes/categories/categories");
const blogs_routes = require("./routes/blogs/blogs");

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hi, Welcome to hardware  ");
});


app.use("/api/v1/users",users_routes);
app.use("/api/v1/brands",brands_routes);
app.use("/api/v1/categories",categories_routes);
app.use("/api/v1/blogs",blogs_routes);







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
