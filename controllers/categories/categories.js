const pool = require("../../config/db");
const queries = require("./categoriesQueries");

// const getAllCategories =async (req,res) =>{
//     pool.query(queries.getAllCategories,(error,results)=>{
//         if(error) throw error;
//         res.status(200).json(results.rows);
//     });
// };

// const getAllCategories = async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
//     const countQuery = 'SELECT COUNT(*) AS total_count FROM categories';
//     const dataQuery = 'SELECT * FROM categories ORDER BY cat_id ASC LIMIT $1 OFFSET $2';
    
//     try {
//       // Get total count of categories
//       const countResult = await pool.query(countQuery);
//       const totalCount = countResult.rows[0].total_count;
      
//       // Get paginated data for categories
//       const dataResult = await pool.query(dataQuery, [limit, offset]);
//       const categories = dataResult.rows;
      
//       res.status(200).json({
//         total_count: totalCount,
//         page_count: Math.ceil(totalCount / limit),
//         page_number: page,
//         categories
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
const getAllCategories = async (req, res) => {
    const { search = '', sort = '', status = '', page = 1, limit = 10 } = req.query;
    let offset = (page - 1) * limit;
  
    let query = `SELECT * FROM categories WHERE cat_name ILIKE '%${search}%'`;
    if (status) {
      query += ` AND status = '${status}'`;
    }
    if (sort) {
      query += ` ORDER BY ${sort}`;
    }
  
    const countQuery = `SELECT COUNT(*) FROM categories WHERE cat_name ILIKE '%${search}%'`;
    if (status) {
      countQuery += ` AND status = '${status}'`;
    }
  
    try {
      const result = await pool.query(`${query} LIMIT ${limit} OFFSET ${offset}`);
      const totalCount = await pool.query(countQuery);
      const total = totalCount.rows[0].count;
      const totalPages = Math.ceil(total / limit);
      const currentPage = parseInt(page);
  
      res.status(200).json({
        categories: result.rows,
        page: currentPage,
        totalPages: totalPages,
        totalItems: total
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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

