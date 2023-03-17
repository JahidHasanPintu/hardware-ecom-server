const express = require("express");
const app = express();
const cors = require('cors');
const dotenv =require('dotenv').config();
const PORT = process.env.PORT || 5000;
const users_routes = require("./routes/user/user");
const brands_routes = require("./routes/brand/brand");
const categories_routes = require("./routes/categories/categories");
const subcategories_routes = require("./routes/subcategories/subcategories");
const blogs_routes = require("./routes/blogs/blogs");
const orders_routes = require("./routes/orders/orders");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hi, Welcome to hardware  ");
});

app.use(express.static('public'));
app.use("/api/v1/users",users_routes);
app.use("/api/v1/brands",brands_routes);
app.use("/api/v1/categories",categories_routes);
app.use("/api/v1/subcategories",subcategories_routes);
app.use("/api/v1/blogs",blogs_routes);
app.use("/api/v1/orders",orders_routes);




app.use(notFound);
app.use(errorHandler);


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
