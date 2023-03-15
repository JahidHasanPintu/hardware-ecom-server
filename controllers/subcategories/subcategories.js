const pool = require("../../config/db");
const queries = require("./subcategoriesQuries");

const getAllSubCategories =async (req,res) =>{
    pool.query(queries.getAllSubCategories,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getSubCategoryByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getSubCategoryByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addSubCategory = (req,res) =>{
    const {subcat_name,cat_id,status} =req.body; 
    
    pool.query(queries.checkSubCategoryExists,[subcat_name],(error,results)=>{
        if(results.rows.length){
            res.send("SubCategory already exist !");
        }
        pool.query(queries.addSubCategory,[cat_id,subcat_name,status],(error,results)=>{
            if(error) throw error;
            res.status(201).send("SubCategory created successfully!");
        });

        
    });
};

const removetSubCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getSubCategoryByID,[id],(error,results)=>{
        const noSubCategoryFound= !results.rows.length;
        if(noSubCategoryFound){
            res.send("SubCategory does not exist");
        }
        pool.query(queries.removeSubCategory,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("SubCategory deleted sucessfully!");
            
           
        });
    });
};

const updateSubCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {subcat_name} =req.body; 
    pool.query(queries.getSubCategoryByID,[id],(error,results)=>{
        const noSubCategoryFound= !results.rows.length;
        if(noSubCategoryFound){
            res.send("SubCategory does not exist");
        }
        pool.query(queries.updateSubCategory,[subcat_name,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("SubCategory updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllSubCategories,
    getSubCategoryByID,
    addSubCategory,
    removetSubCategory,
    updateSubCategory,
};

