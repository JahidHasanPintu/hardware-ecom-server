const pool = require("../../config/db");
const queries = require("./subcategoriesQuries");
  

const getAllSubCategories = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages
  
    const { search, status, cat_id } = req.query;
  
    let query = `
    SELECT s.*, 
    c.cat_name
     
  FROM 
    public.subcategories s 
    LEFT JOIN public.categories c ON s.cat_id = c.cat_id 
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
        ${search ? "AND" : "WHERE"} s.status = $${values.length + 1}
      `;
      values.push(status);
    }
  
    // If cat_id query parameter is provided, add WHERE clause to filter by cat_id
    if (cat_id) {
      query += `
        ${search || status ? "AND" : "WHERE"} s.cat_id = $${values.length + 1}
      `;
      values.push(cat_id);
    }
  
    query += `
      ORDER BY subcat_id ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);

    const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM subcategories
  `;
  
    try {
      const result = await pool.query(query, values);
      const subcategories = result.rows;

      const totalCountResult = await pool.query(totalCountQuery);
      const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);
  
      res.status(200).json({
        success: true,
        page,
        limit,
        total: subcategories.length,
        totalItem: totalCount,
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
    if (req.file) {
      const filePath = req.file.path.replace("public\\", "");
    }
    
    
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
             res.status(200).json({ message: "Category deleted successfully!" });
            
           
        });
    });
};

const updateSubCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {subcat_name,cat_id,status} =req.body; 
    const result = await pool.query(queries.getSubCategoryByID, [id]);
    let subcat_image; 
    let newSubCatName;
    let newStatus;
    let newCategory;
    if (req.file) {
      subcat_image = req.file.path.replace("public\\", "");
      console.log(subcat_image);
    }
    
  if (subcat_name) {
     newSubCatName =subcat_name;
   } else {
     
      newSubCatName = result.rows[0].subcat_name;
   }
   if (status) {
     newStatus=status;
   } else {
     newStatus = result.rows[0].status;
   }
   if (cat_id) {
    newCategory=cat_id;
  } else {
    newCategory = result.rows[0].cat_id;
  }


    pool.query(queries.getSubCategoryByID,[id],(error,results)=>{
        const noSubCategoryFound= !results.rows.length;
        if(noSubCategoryFound){
            res.send("SubCategory does not exist");
        }
        pool.query(queries.updateSubCategory,[newSubCatName,newCategory,newStatus,id],(error,results)=>{

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

