const pool = require("../../config/db");
const queries = require("./productsQueries");

// const getAllProducts =async (req,res) =>{
//     pool.query(queries.getAllProducts,(error,results)=>{
//         if(error) throw error;
//         res.status(200).json(results.rows);
//     });
// };

// const getAllProducts = async (req, res) => {
//     const { search, sort, cat_id, brand_id, subcat_id } = req.query;
//     let queryString = 'SELECT * FROM products';
//     let queryParams = [];
  
//     if (search) {
//       queryString += ' WHERE LOWER(name) LIKE $1';
//       queryParams.push(`%${search.toLowerCase()}%`);
//     }
  
//     if (cat_id) {
//       queryString += ` WHERE cat_id = $${queryParams.length + 1}`;
//       queryParams.push(cat_id);
//     }
  
//     if (brand_id) {
//       queryString += ` WHERE brand_id = $${queryParams.length + 1}`;
//       queryParams.push(brand_id);
//     }
  
//     if (subcat_id) {
//       queryString += ` WHERE subcat_id = $${queryParams.length + 1}`;
//       queryParams.push(subcat_id);
//     }
  
//     if (sort) {
//       queryString += ` ORDER BY ${sort}`;
//     }
  
//     try {
//       const { rows } = await pool.query(queryString, queryParams);
//       res.status(200).json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

  const getAllProducts = async (req, res) => {
    const { search, sort, cat_id, brand_id, subcat_id, page = 1, limit = 10 } = req.query;
    let queryString = 'SELECT * FROM products';
    let queryParams = [];
    let offset = (page - 1) * limit;
  
    if (search) {
      queryString += ' WHERE LOWER(name) LIKE $1';
      queryParams.push(`%${search.toLowerCase()}%`);
    }
  
    if (cat_id) {
      queryString += ` WHERE cat_id = $${queryParams.length + 1}`;
      queryParams.push(cat_id);
    }
  
    if (brand_id) {
      queryString += ` WHERE brand_id = $${queryParams.length + 1}`;
      queryParams.push(brand_id);
    }
  
    if (subcat_id) {
      queryString += ` WHERE subcat_id = $${queryParams.length + 1}`;
      queryParams.push(subcat_id);
    }
  
    if (sort) {
      queryString += ` ORDER BY ${sort}`;
    }
  
    queryString += ' LIMIT $1 OFFSET $2';
    queryParams.unshift(limit);
    queryParams.unshift(offset);
  
    try {
      const { rows } = await pool.query(queryString, queryParams);
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

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
