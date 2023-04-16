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

  const totalCountQuery = `
  SELECT COUNT(*) as total_count
  FROM products
`;
  try {
    const result = await pool.query(query, values);
    const data = result.rows;
    const totalCountResult = await pool.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

    const products = data.map((product) => ({
      brand_id: product.brand_id,
      brand_name: product.brand_name,
      cat_id: product.cat_id,
      cat_name: product.cat_name,

      created_at: product.created_at,
      description: product.description,
      id: product.id,
      images: product.images.map((image) => process.env.BASE_URL + "/" + image),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      subcat_id: product.subcat_id,
      subcat_name: product.subcat_name,
    }));


    res.status(200).json({
      success: true,
      page,
      limit,
      total: products.length,
      totalItem: totalCount,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getProductByID = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getProductByID, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};


const addProduct = (req, res) => {
  const { name, description, price, quantity, cat_id, brand_id, subcat_id } = req.body;
  // const filePath = req.file.path.replace("public\\", "");
  // const images = [filePath];
  // console.log(req); 
  const images = [];
  req.files.forEach(file => {
    const filePath = file.path.replace("public\\", "");
    images.push(filePath);
  });

  pool.query(queries.checkProductExists, [name], (error, results) => {
    if (results.rows.length) {
      res.send("Product name already exist !");
    }
    pool.query(queries.addProduct, [name, description, price, images, quantity, cat_id, brand_id, subcat_id], (error, results) => {
      if (error) throw error;
      res.status(201).send("Product created successfully!");
    });


  });
};

const removeProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getProductByID, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("Product does not exist");
    }
    pool.query(queries.removeProduct, [id], (error, results) => {

      if (error) throw error;
      res.status(200).json({ message: "Product deleted successfully!" });


    });
  });
};


const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, quantity, cat_id, brand_id, subcat_id } = req.body;

    if (req.file) {
      const filePath = req.file.path.replace("public\\", "");
    }

    const result = await pool.query(queries.getProductByID, [id]);
    const existingProduct = result.rows[0];

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedName = name || existingProduct.name;
    const updatedDescription = description || existingProduct.description;
    const updatedPrice = price || existingProduct.price;
    const updatedQuantity = quantity || existingProduct.quantity;
    const updatedCatId = cat_id || existingProduct.cat_id;
    const updatedBrandId = brand_id || existingProduct.brand_id;
    const updatedSubcatId = subcat_id || existingProduct.subcat_id;

    const updateQuery = `
      UPDATE products
      SET
        name = $1,
        description = $2,
        price = $3,
        quantity = $4,
        cat_id = $5,
        brand_id = $6,
        subcat_id = $7
      WHERE
        id = $8
    `;

    await pool.query(updateQuery, [
      updatedName,
      updatedDescription,
      updatedPrice,
      updatedQuantity,
      updatedCatId,
      updatedBrandId,
      updatedSubcatId,
      id
    ]);

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}





module.exports = {
  getAllProducts,
  getProductByID,
  addProduct,
  removeProduct,
  updateProduct,

};
