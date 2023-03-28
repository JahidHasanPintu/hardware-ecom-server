const pool = require("../../config/db");
const queries = require("./productsQueries");


const getAllProducts = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
  const offset = (page - 1) * limit; // Offset to skip the previous pages

  const { search, brand_id, cat_id, subcat_id } = req.query;

  let query = `
    SELECT p.*, 
      b.brand_name, 
      c.cat_name, 
      s.subcat_name 
    FROM 
      public.products p 
      LEFT JOIN public.brands b ON p.brand_id = b.brand_id 
      LEFT JOIN public.categories c ON p.cat_id = c.cat_id 
      LEFT JOIN public.subcategories s ON p.subcat_id = s.subcat_id
    `;

  const values = [];

  // If search query parameter is provided, add WHERE clause to search by name
  if (search) {
    query += `
      WHERE name ILIKE $${values.length + 1}
    `;
    values.push(`%${search}%`);
  }

  // If brand_id query parameter is provided, add WHERE clause to filter by brand_id
  if (brand_id) {
    query += `
      ${search ? "AND" : "WHERE"} p.brand_id = $${values.length + 1}
    `;
    values.push(brand_id);
  }

  // If cat_id query parameter is provided, add WHERE clause to filter by cat_id
  if (cat_id) {
    query += `
      ${search || brand_id ? "AND" : "WHERE"} p.cat_id = $${values.length + 1}
    `;
    values.push(cat_id);
  }

  if (subcat_id) {
    query += `
      ${search || brand_id || cat_id ? "AND" : "WHERE"} p.subcat_id = $${values.length + 1}
    `;
    values.push(subcat_id);
  }
  query += `
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;
  values.push(limit, offset);

  try {
    const result = await pool.query(query, values);
    const products = result.rows;

    res.status(200).json({
      success: true,
      page,
      limit,
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// const getAllProducts = async (req, res) => {
//   const currentPageNumber = req.query.page ? parseInt(req.query.page, 10) : 1; // The current page number
//   const recordsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 10; // The number of records to show per page
//   const recordsToSkip = (currentPageNumber - 1) * recordsPerPage; // The number of records to skip to get to the current page

//   const { searchQuery, brandId, categoryId, subcategoryId } = req.query; // Destructure the query parameters

//   let query = `
//     SELECT 
//       p.*, 
//       b.brand_name, 
//       c.cat_name, 
//       s.subcat_name 
//     FROM 
//       public.products p 
//       LEFT JOIN public.brands b ON p.brand_id = b.brand_id 
//       LEFT JOIN public.categories c ON p.cat_id = c.cat_id 
//       LEFT JOIN public.subcategories s ON p.subcat_id = s.subcat_id
//   `;

//   const values = [];

//   // If the search query parameter is provided, add a WHERE clause to search by name
//   if (searchQuery) {
//     query += `
//       WHERE 
//         name ILIKE $${values.length + 1}
//     `;
//     values.push(`%${searchQuery}%`);
//   }

//   // If the brand ID query parameter is provided, add a WHERE clause to filter by brand ID
//   if (brandId) {
//     query += `
//       ${searchQuery ? "AND" : "WHERE"} 
//         brand_id = $${values.length + 1}
//     `;
//     values.push(brandId);
//   }

//   // If the category ID query parameter is provided, add a WHERE clause to filter by category ID
//   if (categoryId) {
//     query += `
//       ${searchQuery || brandId ? "AND" : "WHERE"} 
//         cat_id = $${values.length + 1}
//     `;
//     values.push(categoryId);
//   }

//   // If the subcategory ID query parameter is provided, add a WHERE clause to filter by subcategory ID
//   if (subcategoryId) {
//     query += `
//       ${searchQuery || brandId || categoryId ? "AND" : "WHERE"} 
//         subcat_id = $${values.length + 1}
//     `;
//     values.push(subcategoryId);
//   }

//   // Add an ORDER BY clause to sort the results by ID in ascending order, and a LIMIT and OFFSET clause to limit the number of results returned to a specific page
//   query += `
//     ORDER BY 
//       id ASC
//     LIMIT 
//       $${values.length + 1}
//     OFFSET 
//       $${values.length + 2}
//   `;
//   values.push(recordsPerPage, recordsToSkip);

//   try {
//     const result = await pool.query(query, values);
//     const products = result.rows;

//     res.status(200).json({
//       success: true,
//       currentPageNumber,
//       recordsPerPage,
//       totalRecords: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

 

const getProductByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getProductByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addProduct = (req,res) =>{
    const {name, description, price, images, quantity,  cat_id, brand_id, subcat_id} =req.body;
    // const filePath = req.file.path;
    // console.log(req); 
    
    pool.query(queries.checkProductExists,[name],(error,results)=>{
        if(results.rows.length){
            res.send("Product name already exist !");
        }
        pool.query(queries.addProduct,[name, description, price, images, quantity,  cat_id, brand_id, subcat_id],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Product created successfully!");
        });

        
    });
};

const removeProduct =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getProductByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Product does not exist");
        }
        pool.query(queries.removeProduct,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Product deleted sucessfully!");
            
           
        });
    });
};

const updateProduct =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {name} =req.body; 
    pool.query(queries.getProductByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Product does not exist");
        }
        pool.query(queries.updateProduct,[name,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Product updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllProducts,
    getProductByID,
    addProduct,
    removeProduct,
    updateProduct,
    
};
