const pool = require("../../config/db");
const queries = require("./subcategoriesQuries");
  

const getAllSubCategories = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages
  
    const { search, status, cat_id } = req.query;
  
    let query = `
      SELECT *
      FROM subcategories
    `;
  
    const values = [];
  
    // If search query parameter is provided, add WHERE clause to search by subcat_name
    if (search) {
      query += `
        WHERE subcat_name ILIKE $${values.length + 1}
      `;
      values.push(`%${search}%`);
    }
  
    // If status query parameter is provided, add WHERE clause to filter by status
    if (status) {
      query += `
        ${search ? "AND" : "WHERE"} status = $${values.length + 1}
      `;
      values.push(status);
    }
  
    // If cat_id query parameter is provided, add WHERE clause to filter by cat_id
    if (cat_id) {
      query += `
        ${search || status ? "AND" : "WHERE"} cat_id = $${values.length + 1}
      `;
      values.push(cat_id);
    }
  
    query += `
      ORDER BY subcat_id ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);
  
    try {
      const result = await pool.query(query, values);
      const subcategories = result.rows;
  
      res.status(200).json({
        success: true,
        page,
        limit,
        total: subcategories.length,
        data: subcategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
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

const removeSubCategory =async (req,res) =>{
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
    removeSubCategory,
    updateSubCategory,
};

