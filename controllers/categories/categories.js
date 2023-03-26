const pool = require("../../config/db");
const queries = require("./categoriesQueries");

const getAllCategories = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages
  
    const { search, status } = req.query;
  
    let query = `
      SELECT *
      FROM categories
    `;
  
    const values = [];
  
    // If search query parameter is provided, add WHERE clause to search by brand_name
    if (search) {
      query += `
        WHERE cat_name ILIKE $${values.length + 1}
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
  
    query += `
      ORDER BY cat_id ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);
  
    try {
      const result = await pool.query(query, values);
      const categories = result.rows;
  
      res.status(200).json({
        success: true,
        page,
        limit,
        total: categories.length,
        data: categories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
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

const removeCategory =async (req,res) =>{
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
    removeCategory,
    updateCategory,
};

