const pool = require("../../config/db");
const queries = require("./blogQueries");

// const getAllBlogs =async (req,res) =>{
//     pool.query(queries.getAllBlogs,(error,results)=>{
//         if(error) throw error;
//         res.status(200).json(results.rows);
//     });
// };

const getAllBlogs = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages
  
    const { search, status } = req.query;
  
    let query = `
      SELECT *
      FROM blogs
    `;
  
    const values = [];
  
    // If search query parameter is provided, add WHERE clause to search by brand_name
    if (search) {
      query += `
        WHERE title ILIKE $${values.length + 1}
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
      ORDER BY id ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);
  
    try {
      const result = await pool.query(query, values);
      const blogs = result.rows;
  
      res.status(200).json({
        success: true,
        page,
        limit,
        total: blogs.length,
        data: blogs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
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

