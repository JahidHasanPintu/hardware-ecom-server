const pool = require("../../config/db");
const queries = require("./blogQueries");

const getAllBlogs =async (req,res) =>{
    pool.query(queries.getAllBlogs,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getBlogByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBlogByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addBlog = (req,res) =>{
    const {title,details,blog_images} =req.body; 
    
    pool.query(queries.checkBlogExists,[title],(error,results)=>{
        if(results.rows.length){
            res.send("Blog already exist !");
        }
        pool.query(queries.addBlog,[title,details,blog_images],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Blog created successfully!");
        });

        
    });
};

const removeBlog =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBlogByID,[id],(error,results)=>{
        const noBlogFound= !results.rows.length;
        if(noBlogFound){
            res.send("Blog does not exist");
        }
        pool.query(queries.removeBlog,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Blog deleted sucessfully!");
            
           
        });
    });
};

const updateBlog =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {title} =req.body; 
    pool.query(queries.getBlogByID,[id],(error,results)=>{
        const noBlogFound= !results.rows.length;
        if(noBlogFound){
            res.send("Blog does not exist");
        }
        pool.query(queries.updateBlog,[title,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Blog updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllBlogs,
    getBlogByID,
    addBlog,
    removeBlog,
    updateBlog,
};

