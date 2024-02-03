const pool = require("../../config/db");
const queries = require("./brandQueries");
const util = require('util');

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
      WHERE brand_name LIKE ?
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
    FROM brands
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const result = await queryPromise(query, values);
    const brands = result;

    const data = brands.map((brand) => ({
      id: brand.id,
      brand_name: brand.brand_name,
      brand_image: process.env.BASE_URL + "/" + brand.brand_image,
      status: brand.status,
      product_count: brand.product_count,
    }));

    const totalCountResult = await queryPromise(totalCountQuery);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    res.status(200).json({
      success: true,
      page,
      limit,
      total: brands.length,
      totalItem: totalCount,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getBrandByID = async (req, res) => {
  const id = parseInt(req.params.id);

  const query = `
    SELECT *
    FROM brands
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);
    const result = await queryPromise(query, [id]);

    if (result.length > 0) {
      const brand = result[0];
      const data = {
        id: brand.id,
        brand_name: brand.brand_name,
        brand_image: process.env.BASE_URL + "/" + brand.brand_image,
        status: brand.status,
        product_count: brand.product_count,
      };

      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const addBrand = (req, res) => {
  const { brand_name, status } = req.body;
  const filePath = req.file.path.replace("public\\", "");

  const checkBrandExistsQuery = `
    SELECT id
    FROM brands
    WHERE brand_name = '${brand_name}';
  `;

  const addBrandQuery = `
    INSERT INTO brands (brand_name, brand_image, status)
    VALUES ('${brand_name}', '${filePath}', '${status}');
  `;

  pool.query(checkBrandExistsQuery, (checkError, checkResults) => {
    if (checkError) {
      throw checkError; // Rethrow non-MySQL errors
    }

    if (checkResults.length > 0) {
      res.send("Brand already exists!");
    } else {
      // Insert brand details
      pool.query(addBrandQuery, (addError, addResults) => {
        if (addError) {
          throw addError;
        }
        res.status(201).send("Brand created successfully!");
      });
    }
  });
};





const removeBrand = async (req, res) => {
  const id = parseInt(req.params.id);

  const getBrandQuery = `
    SELECT *
    FROM brands
    WHERE id = ?
  `;

  const removeBrandQuery = `
    DELETE FROM brands
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const brandResult = await queryPromise(getBrandQuery, [id]);
    const brandExists = brandResult.length > 0;

    if (!brandExists) {
      res.status(404).json({ message: "Brand does not exist" });
    } else {
      await queryPromise(removeBrandQuery, [id]);
      res.status(200).json({ message: "Brand deleted successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updateBrand = async (req, res) => {
  const id = parseInt(req.params.id);
  const { brand_name, status } = req.body;

  const getBrandQuery = `
    SELECT *
    FROM brands
    WHERE id = ?
  `;

  const updateBrandQuery = `
    UPDATE brands
    SET brand_name = ?, brand_image = ?, status = ?
    WHERE id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const brandResult = await queryPromise(getBrandQuery, [id]);
    const brandExists = brandResult.length > 0;

    if (!brandExists) {
      res.status(404).json({ message: "Brand does not exist" });
    } else {
      let brand_image = brandResult[0].brand_image;
      let newBrandName = brandResult[0].brand_name;
      let newStatus = brandResult[0].status;

      if (req.file) {
        brand_image = req.file.path.replace("public\\", "");
      }
      if (brand_name) {
        newBrandName = brand_name;
      }
      if (status) {
        newStatus = status;
      }

      await queryPromise(updateBrandQuery, [newBrandName, brand_image, newStatus, id]);
      res.status(200).json({ message: "Brand updated successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = {
    getAllBrands,
    getBrandByID,
    addBrand,
    removeBrand,
    updateBrand,
};

