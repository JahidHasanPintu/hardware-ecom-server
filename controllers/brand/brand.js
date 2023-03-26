const pool = require("../../config/db");
const queries = require("./brandQueries");

const getAllBrands = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages
  
    const { search, status } = req.query;
  
    let query = `
      SELECT *
      FROM brands
    `;
  
    const values = [];
  
    // If search query parameter is provided, add WHERE clause to search by brand_name
    if (search) {
      query += `
        WHERE brand_name ILIKE $${values.length + 1}
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
      ORDER BY brand_id ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);
  
    try {
      const result = await pool.query(query, values);
      const brands = result.rows;
  
      res.status(200).json({
        success: true,
        page,
        limit,
        total: brands.length,
        data: brands,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  
const getBrandByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addBrand = (req,res) =>{
    const {brand_name,brand_image,status} =req.body;
    const filePath = req.file.path;
    // console.log(req); 
    
    pool.query(queries.checkBrandExists,[brand_name],(error,results)=>{
        if(results.rows.length){
            res.send("Brand already exist !");
        }
        pool.query(queries.addBrand,[brand_name,filePath,status],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Brand created successfully!");
        });

        
    });
};

const removeBrand =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Brand does not exist");
        }
        pool.query(queries.removeBrand,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Brand deleted sucessfully!");
            
           
        });
    });
};

const updateBrand =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {brand_name} =req.body; 
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Brand does not exist");
        }
        pool.query(queries.updateBrand,[brand_name,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Brand updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllBrands,
    getBrandByID,
    addBrand,
    removeBrand,
    updateBrand,
};

