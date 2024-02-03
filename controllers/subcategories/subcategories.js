const pool = require("../../config/db");
const queries = require("./subcategoriesQuries");
const util = require('util');

const getAllSubCategories = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
  const offset = (page - 1) * limit; // Offset to skip the previous pages

  const { search, status, cat_id } = req.query;

  let query = `
    SELECT s.*, 
    c.cat_name
  FROM 
    subcategories s 
    LEFT JOIN categories c ON s.cat_id = c.id
  `;

  const values = [];

  // If search query parameter is provided, add WHERE clause to search by subcat_name
  if (search) {
    query += `
      WHERE s.subcat_name LIKE ?
    `;
    values.push(`%${search}%`);
  }

  // If status query parameter is provided, add WHERE clause to filter by status
  if (status) {
    query += `
      ${search ? "AND" : "WHERE"} s.status = ?
    `;
    values.push(status);
  }

  // If cat_id query parameter is provided, add WHERE clause to filter by cat_id
  if (cat_id) {
    query += `
      ${search || status ? "AND" : "WHERE"} s.cat_id = ?
    `;
    values.push(cat_id);
  }

  query += `
    ORDER BY s.id ASC
    LIMIT ? OFFSET ?
  `;
  values.push(limit, offset);

  const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM subcategories
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const result = await queryPromise(query, values);
    const subcategories = result;

    const data = subcategories.map((subcategory) => ({
      subcat_id: subcategory.id,
      subcat_name: subcategory.subcat_name,
      cat_id: subcategory.cat_id,
      status: subcategory.status,
      product_count: subcategory.product_count,
      cat_name: subcategory.cat_name,
    }));

    const totalCountResult = await queryPromise(totalCountQuery);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    res.status(200).json({
      success: true,
      page,
      limit,
      total: subcategories.length,
      totalItem: totalCount,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

};



const getSubCategoryByID = async (req, res) => {
  const id = parseInt(req.params.id);

  const query = `
    SELECT *
    FROM subcategories
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);
    const result = await queryPromise(query, [id]);

    if (result.length > 0) {
      const subCategory = result[0];
      const data = {
        id: subCategory.id,
        subCategory_name: subCategory.subcat_name,
        cat_id: subCategory.cat_id,
        status: subCategory.status,
        product_count: subCategory.product_count,
      };

      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "subCategory not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const addSubCategory = (req, res) => {
  const { subcat_name, cat_id, status } = req.body;
  let filePath = null;

  if (req.file) {
    filePath = req.file.path.replace("public\\", "");
  }

  pool.query(
    `SELECT * FROM subcategories WHERE subcat_name = ?`,
    [subcat_name],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        res.send("SubCategory already exists!");
      } else {
        pool.query(
          `INSERT INTO subcategories (cat_id, subcat_name, status) VALUES (?, ?, ?)`,
          [cat_id, subcat_name, status, filePath],
          (error, results) => {
            if (error) throw error;
            res.status(201).send("SubCategory created successfully!");
          }
        );
      }
    }
  );
};



const removeSubCategory = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    `SELECT * FROM subcategories WHERE id = ?`,
    [id],
    (error, results) => {
      const noSubCategoryFound = !results.length;
      if (noSubCategoryFound) {
        res.send("SubCategory does not exist");
      } else {
        pool.query(
          `DELETE FROM subcategories WHERE id = ?`,
          [id],
          (error, results) => {
            if (error) throw error;
            res.status(200).json({ message: "SubCategory deleted successfully!" });
          }
        );
      }
    }
  );
};

const updateSubCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const { subcat_name, cat_id, status } = req.body;

  const getSubCatQuery = `
    SELECT *
    FROM subcategories
    WHERE id = ?
  `;

  const updateSubCatQuery = `
    UPDATE subcategories
    SET subcat_name = ?, cat_id = ?, status = ?
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const SubCatResult = await queryPromise(getSubCatQuery, [id]);
    const SubCatExists = SubCatResult.length > 0;

    if (!SubCatExists) {
      res.status(404).json({ message: "Subcategory does not exist" });
    } else {
      let newCatId = SubCatResult[0].cat_id;
      let newSubCatName = SubCatResult[0].subcat_name;
      let newStatus = SubCatResult[0].status;

      if (cat_id) {
        newCatId = cat_id;
      }
      if (subcat_name) {
        newSubCatName = subcat_name;
      }
      if (status) {
        newStatus = status;
      }

      await queryPromise(updateSubCatQuery, [newSubCatName, newCatId, newStatus, id]);
      res.status(200).json({ message: "Sub category updated successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};







module.exports = {
  getAllSubCategories,
  getSubCategoryByID,
  addSubCategory,
  removeSubCategory,
  updateSubCategory,
};

