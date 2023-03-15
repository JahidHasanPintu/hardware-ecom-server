const pool = require("../../config/db");
const queries = require("./categoriesQueries");

const getAllCategories =async (req,res) =>{
    pool.query(queries.getAllCategories,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getCategoryByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getCategoryByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addCategory = (req,res) =>{
    const filePath = req.file.path;
    const {cat_name,status} =req.body; 
    
    pool.query(queries.checkCategoryExists,[cat_name],(error,results)=>{
        if(results.rows.length){
            res.send("Category already exist !");
        }
        pool.query(queries.addCategory,[cat_name,filePath,status],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Category created successfully!");
        });

        
    });
};

const removetCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getCategoryByID,[id],(error,results)=>{
        const noCategoryFound= !results.rows.length;
        if(noCategoryFound){
            res.send("Category does not exist");
        }
        pool.query(queries.removeCategory,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Category deleted sucessfully!");
            
           
        });
    });
};

const updateCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {cat_name} =req.body; 
    pool.query(queries.getCategoryByID,[id],(error,results)=>{
        const noCategoryFound= !results.rows.length;
        if(noCategoryFound){
            res.send("Category does not exist");
        }
        pool.query(queries.updateCategory,[cat_name,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Category updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllCategories,
    getCategoryByID,
    addCategory,
    removetCategory,
    updateCategory,
};

