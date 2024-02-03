const pool = require("../../config/db");
const queries = require("./categoriesQueries");
const util = require('util');

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

  // If search query parameter is provided, add WHERE clause to search by cat_name
  if (search) {
    query += `
      WHERE cat_name LIKE ?
    `;
    values.push(`%${search}%`);
  }

  // If status query parameter is provided, add WHERE clause to filter by status
  if (status) {
    query += `
      ${search ? "AND" : "WHERE"} status = ?
    `;
    values.push(status);
  }

  query += `
    ORDER BY id ASC
    LIMIT ? OFFSET ?
  `;
  values.push(limit, offset);

  const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM categories
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const result = await queryPromise(query, values);
    const categories = result;

    const data = categories.map((category) => ({
      id: category.id,
      cat_name: category.cat_name,
      cat_image: process.env.BASE_URL + "/" + category.cat_image,
      status: category.status,
      product_count: category.product_count,
    }));

    const totalCountResult = await queryPromise(totalCountQuery);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    res.status(200).json({
      success: true,
      page,
      limit,
      total: categories.length,
      totalItem: totalCount,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  };


const getCategoryByID =async (req,res) =>{
  const id = parseInt(req.params.id);

  const query = `
    SELECT *
    FROM categories
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);
    const result = await queryPromise(query, [id]);

    if (result.length > 0) {
      const category = result[0];
      const data = {
        id: category.id,
        cat_name: category.cat_name,
        cat_image: process.env.BASE_URL + "/" + category.category_image,
        status: category.status,
        product_count: category.product_count,
      };

      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const addCategory = (req,res) =>{
  const { cat_name, status } = req.body;
  const filePath = req.file.path.replace("public\\", "");

  const checkcategoryExistsQuery = `
    SELECT id
    FROM categories
    WHERE cat_name = '${cat_name}';
  `;

  const addcategoryQuery = `
    INSERT INTO categories (cat_name, cat_image, status)
    VALUES ('${cat_name}', '${filePath}', '${status}');
  `;

  pool.query(checkcategoryExistsQuery, (checkError, checkResults) => {
    if (checkError) {
      throw checkError; // Rethrow non-MySQL errors
    }

    if (checkResults.length > 0) {
      res.send("Category already exists!");
    } else {
      // Insert category details
      pool.query(addcategoryQuery, (addError, addResults) => {
        if (addError) {
          throw addError;
        }
        res.status(201).send("Category created successfully!");
      });
    }
  });
};

const removeCategory =async (req,res) =>{
    const id = parseInt(req.params.id);
    const getCatQuery = `
    SELECT *
    FROM categories
    WHERE id = ?
  `;

  const removeCatQuery = `
    DELETE FROM categories
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const catResult = await queryPromise(getCatQuery, [id]);
    const catExists = catResult.length > 0;

    if (!catExists) {
      res.status(404).json({ message: "Category does not exist" });
    } else {
      await queryPromise(removeCatQuery, [id]);
      res.status(200).json({ message: "Category deleted successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cat_name, status } = req.body;

  const getCatQuery = `
    SELECT *
    FROM categories
    WHERE id = ?
  `;

  const updateCatQuery = `
    UPDATE categories
    SET cat_name = ?, cat_image = ?, status = ?
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const catResult = await queryPromise(getCatQuery, [id]);
    const catExists = catResult.length > 0;

    if (!catExists) {
      res.status(404).json({ message: "Category does not exist" });
    } else {
      let cat_image = catResult[0].cat_image;
      let newCatName = catResult[0].cat_name;
      let newStatus = catResult[0].status;

      if (req.file) {
        cat_image = req.file.path.replace("public\\", "");
      }
      if (cat_name) {
        newCatName = cat_name;
      }
      if (status) {
        newStatus = status;
      }

      await queryPromise(updateCatQuery, [newCatName, cat_image, newStatus, id]);
      res.status(200).json({ message: "Category updated successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = {
    getAllCategories,
    getCategoryByID,
    addCategory,
    removeCategory,
    updateCategory,
};

