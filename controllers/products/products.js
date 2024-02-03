const pool = require("../../config/db");
const queries = require("./productsQueries");
const util = require('util');
const fs = require('fs');

const getAllProducts = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const offset = (page - 1) * limit;

  const { search, brand_id, cat_id, subcat_id, sort, offer } = req.query;

  let query = `
  SELECT 
  p.*, 
  b.brand_name, 
  c.cat_name, 
  s.subcat_name,
  (SELECT COUNT(*) FROM product_reviews r WHERE r.product_id = p.id) AS total_reviews,
  (SELECT AVG(rating) FROM product_reviews r WHERE r.product_id = p.id) AS average_rating
FROM 
  products p 
  LEFT JOIN brands b ON p.brand_id = b.id 
  LEFT JOIN categories c ON p.cat_id = c.id 
  LEFT JOIN subcategories s ON p.subcat_id = s.id
    `;

  const values = [];

  if (search) {
    query += `
      WHERE product_name LIKE ?
    `;
    values.push(`%${search}%`);
  }

  if (brand_id) {
    const brandIds = brand_id.split(',');
    const brandIdParams = brandIds.map(() => '?').join(',');
    query += `
      ${search ? 'AND' : 'WHERE'} p.brand_id IN (${brandIdParams})`;
    values.push(...brandIds);
  }

  if (cat_id) {
    const catIds = cat_id.split(',');
    const catIdParams = catIds.map(() => '?').join(',');
    query += `
      ${search || brand_id ? 'AND' : 'WHERE'} p.cat_id IN (${catIdParams})`;
    values.push(...catIds);
  }

  if (subcat_id) {
    query += `
      ${search || brand_id || cat_id ? 'AND' : 'WHERE'} p.subcat_id = ?
    `;
    values.push(subcat_id);
  }
  if (offer) {
    query += `
      ${search || brand_id || cat_id || subcat_id ? 'AND' : 'WHERE'} p.is_offer = ?
    `;
    values.push(offer);
  }

  if (sort === 'latest') {
    query += `
      ORDER BY created_at DESC
    `;
  } else if (sort === 'oldest') {
    query += `
      ORDER BY created_at ASC
    `;
  } else if (sort === 'popular') {
    query += `
      ORDER BY sale_count DESC
    `;
  } else {
    query += `
      ORDER BY id ASC
    `;
  }

  query += `
    LIMIT ? OFFSET ?
  `;
  values.push(limit, offset);

  const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM products
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const result = await queryPromise(query, values);
    const data = result;

    const totalCountResult = await queryPromise(totalCountQuery);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    const productIds = data.map(product => product.id);
    const distinctProductIds = [...new Set(productIds)];

    const imageQuery = `
      SELECT product_id, image_url
      FROM product_images
      WHERE product_id IN (${distinctProductIds.map(() => '?').join(',')})
    `;
    const imageValues = distinctProductIds;
    const imageResult = await queryPromise(imageQuery, imageValues);

    const imageMap = {};
    imageResult.forEach(row => {
      const productId = row.product_id;
      const imageUrl = process.env.BASE_URL + "/" + row.image_url;

      if (!imageMap[productId]) {
        imageMap[productId] = [];
      }
      imageMap[productId].push(imageUrl);
    });

    const products = data.map(product => ({
      id: product.id,
      name: product.product_name,
      price: product.price,
      oldPrice: product.old_price,
      quantity: product.quantity,
      sale_count: product.sale_count,
      description: product.description,

      brand_name: product.brand_name,
      cat_name: product.cat_name,
      subcat_name: product.subcat_name,

      cat_id: product.cat_id,
      subcat_id: product.subcat_id,
      brand_id: product.brand_id,
      images: imageMap[product.id] || [],

      created_at: product.created_at,
      updated_at: product.updated_at,
      isOffer: product.is_offer,
      total_reviews: product.total_reviews,
      average_rating: product.average_rating,

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
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getProductByID = async (req, res) => {
  const productId = req.params.id;

  const productQuery = `
    SELECT p.*, 
      b.brand_name, 
      c.cat_name, 
      s.subcat_name 
    FROM 
      products p 
      LEFT JOIN brands b ON p.brand_id = b.id 
      LEFT JOIN categories c ON p.cat_id = c.id 
      LEFT JOIN subcategories s ON p.subcat_id = s.id
    WHERE p.id = ?
  `;

  const variationsQuery = `
    SELECT pv.variation_id, pv.color, pv.size, pv.stock_quantity as quantity, pv.weight, pv.image as images, pv.price_variation as price
    FROM product_variations pv
    WHERE pv.product_id = ?
  `;
  const SizeQuery = `
    SELECT ps.id, ps.size, ps.stock_quantity as quantity
    FROM product_sizes ps
    WHERE ps.product_id = ?
  `;

  const reviewsQuery = `
    SELECT COUNT(*) AS total_reviews, AVG(rating) AS average_rating
    FROM product_reviews
    WHERE product_id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Fetch the product with all its information
    const productResult = await queryPromise(productQuery, [productId]);
    const product = productResult[0];

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch the product variations
    const variationsResult = await queryPromise(variationsQuery, [productId]);
    let variationRes = [];
    const variations = variationsResult.map((row) => {
      variationRes.push({
        id: row.variation_id,
        color: row.color,
        images: process.env.BASE_URL + "/" + row.images,
        price: row.price,
        quantity: row.quantity,
      })
    });

    const sizeResult = await queryPromise(SizeQuery, [productId]);
    const sizes = sizeResult;

    // Fetch the image URLs for the product
    const imageQuery = `
      SELECT image_url
      FROM product_images
      WHERE product_id = ?
    `;
    const imageResult = await queryPromise(imageQuery, [productId]);
    const imageUrls = imageResult.map((row) => process.env.BASE_URL + "/" + row.image_url);


    // Fetch the total number of reviews and average rating
    const reviewsResult = await queryPromise(reviewsQuery, [productId]);
    const totalReviews = reviewsResult[0].total_reviews;
    const averageRating = reviewsResult[0].average_rating;

    // Construct the product object with variations
    const productObject = {
      id: product.id,
      name: product.product_name,
      brand_name: product.brand_name,
      cat_name: product.cat_name,
      subcat_name: product.subcat_name,
      price: product.price,
      oldPrice: product.old_price,
      quantity: product.quantity,
      sale_count: product.sale_count,
      warranty: product.warranty,
      sku: product.sku,
      cat_id: product.cat_id,
      subcat_id: product.subcat_id,
      brand_id: product.brand_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
      images: imageUrls || [],
      description: product.description,
      variations: variationRes,
      sizes: sizes,
      total_reviews: totalReviews,
      average_rating: averageRating,
    };

    res.status(200).json({ success: true, data: productObject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const addProduct = (req, res) => {
  const { product_name, price, old_price, quantity, warranty, offer, description, sku, status, brand_id, cat_id, subcat_id, variations, sizes } = req.body;
  let subCatId = 0,catId=0,brandID=0;
  if(subcat_id){
    subCatId=subcat_id;
  }
  if(cat_id){
    catId=cat_id;
  }
  if(brand_id){
    brandID=brand_id;
  }


  const variationsArr = JSON.parse(variations);
  const sizeArr = JSON.parse(sizes);
  const addProductQuery = `INSERT INTO products (product_name, price, old_price, quantity, warranty, is_offer, description,sku, status, brand_id, cat_id, subcat_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

  pool.query(addProductQuery, [product_name, price, old_price, quantity, warranty, offer, description, sku, status, brandID, catId, subCatId], async (addError, addResults) => {
    if (addError) {
      throw addError;
    }
    if (addResults) {
      const product_id = addResults.insertId;

      // Fetch the inserted product's ID
      const getProductQuery = `SELECT id FROM products WHERE product_name = ?`;
      pool.query(getProductQuery, [product_name], async (getProductError, getProductResults) => {
        if (getProductError) {
          throw getProductError;
        }
        if (getProductResults) {
          const product_id = getProductResults[0].id;

          // Insert image URLs into the 'product_images' table
          await Promise.all(
            req.files.map(async (file) => {
              const filePath = file.path.replace("public\\", "");
              await pool.query(
                `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
                [product_id, filePath]
              );
            })
          );
          await Promise.all(
            sizeArr.map(async (size) => {

              const colorId = 0;
              const Ssize = size.size;
              const Squantity = size.quantity;
              await pool.query(
                `INSERT INTO product_sizes (product_id,color_id,size, stock_quantity) VALUES (?, ?, ?, ?)`,
                [product_id, colorId, Ssize, Squantity]
              );
            })
          );
        }
        const productId = addResults.insertId;
        res.status(201).json({ productId: productId, message: "Product created successfully!" });
      });
    }
  });
};

const addVariations = async (req, res) => {
  const { product_id, color, quantity, price } = req.body;
  const images = req.files[0]?.path?.replace("public\\", ""); // An array of image files, you can access individual files using req.files[index]

  await pool.query(
    `INSERT INTO product_variations (product_id,color, stock_quantity,price_variation,image) VALUES (?, ?, ?, ?, ?)`,
    [product_id, color, quantity, price, images]
  );

  res.status(201).send("Variations added successfully!");
};



const removeProduct = async (req, res) => {
  const productId = req.params.id;

  const deleteProductQuery = `
    DELETE FROM products
    WHERE id = ?
  `;

  const deleteImageQuery = `
    DELETE FROM product_images
    WHERE product_id = ?
  `;
  const deleteVariation = `
    DELETE FROM product_variations
    WHERE product_id = ?
  `;
  const deleteSize = `
    DELETE FROM product_sizes
    WHERE product_id = ?
  `;

  const getImageQuery = `
    SELECT image_url
    FROM product_images
    WHERE product_id = ?
  `;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Fetch the image URLs for the product
    const imageResult = await queryPromise(getImageQuery, [productId]);
    const imageUrls = imageResult.map(row => row.image_url);

    // Delete the product from the products table
    await queryPromise(deleteSize, [productId]);
    await queryPromise(deleteVariation, [productId]);
    await queryPromise(deleteProductQuery, [productId]);

    // Delete the related image records from the product_images table
    await queryPromise(deleteImageQuery, [productId]);


    // Delete the image files from the server storage
    imageUrls.forEach(imageUrl => {
      const imageName = imageUrl.split('/').pop();
      const imagePath = `public/images/${imageName}`;

      // Check if the image file exists and delete it
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, brand_id, cat_id, subcat_id, price, old_price, quantity, description, warranty, sku, offer, removedImages, sizes,removedVariations,removedSizes } = req.body;
  const sizeArr = JSON.parse(sizes);

  console.log(removedVariations,removedSizes);

  const getProductQuery = `
    SELECT *
    FROM products
    WHERE id = ?
  `;

  const updateProductQuery = `
    UPDATE products
    SET ${name !== '' ? 'product_name = ?,' : ''} ${brand_id !== '' ? 'brand_id = ?,' : ''} 
    ${cat_id !== '' ? 'cat_id = ?,' : ''} ${subcat_id !== '' ? 'subcat_id = ?,' : ''} 
    ${price !== '' ? 'price = ?,' : ''} ${old_price !== '' ? 'old_price = ?,' : ''} 
    ${quantity !== '' ? 'quantity = ?,' : ''} ${description !== '' ? 'description = ?,' : ''} 
    ${warranty !== '' ? 'warranty = ?,' : ''} ${sku !== '' ? 'sku = ?,' : ''} 
    ${offer !== '' ? 'is_offer = ?,' : ''} 
    updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    name, brand_id, cat_id, subcat_id, price, old_price, quantity, description, warranty, sku, offer, productId
  ].filter(value => value !== '');

  // Split the removedImages string into an array of image URLs
  const removedImageURLs = removedImages.split(',');
  const removedVar = removedVariations.split(',');
  const removedSize = removedSizes.split(',');

  // Remove the base URL from each image URL
  const formattedRemovedImageURLs = removedImageURLs.map(url =>
    url.replace(`${process.env.BASE_URL}/`, '')

  );

  const deleteImagesQuery = `
  DELETE FROM product_images
  WHERE product_id = ? AND image_url = ?
`;
  const deleteVariationQuery = `
  DELETE FROM product_variations
  WHERE variation_id = ?
`;
  const deleteSizesQuery = `
  DELETE FROM product_sizes
  WHERE id = ?
`;

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Check if the product exists
    const productResult = await queryPromise(getProductQuery, [productId]);
    const product = productResult[0];

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate brand_id, cat_id, and subcat_id before updating
    const brandExists = await queryPromise('SELECT * FROM brands WHERE id = ?', [brand_id]);
    const categoryExists = await queryPromise('SELECT * FROM categories WHERE id = ?', [cat_id]);
    const subcategoryExists = await queryPromise('SELECT * FROM subcategories WHERE id = ?', [subcat_id]);

    if (!brandExists[0]) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    if (!categoryExists[0]) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (!subcategoryExists[0]) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    await Promise.all(
      req.files.map(async (file) => {
        const filePath = file.path.replace("public\\", "");
        await pool.query(
          `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
          [productId, filePath]
        );
      })
    );

    await Promise.all(
      formattedRemovedImageURLs.map(url =>
        queryPromise(deleteImagesQuery, [productId, url])
      )
    );
    await Promise.all(
      removedVar.map(id =>
        queryPromise(deleteVariationQuery, [id])
      )
    );
    await Promise.all(
      removedSize.map(id =>
        queryPromise(deleteSizesQuery, [id])
      )
    );

    await Promise.all(
      sizeArr.map(async (size) => {

        const colorId = 1;
        const Ssize = size.size;
        const Squantity = size.quantity;
        await pool.query(
          `INSERT INTO product_sizes (product_id,color_id,size, stock_quantity) VALUES (?, ?, ?, ?)`,
          [productId, colorId, Ssize, Squantity]
        );
      })
    );


    // Update the product in the database with non-null values
    await queryPromise(updateProductQuery, [...values, productId]);



    // await queryPromise(deleteImagesQuery, [productId, formattedRemovedImageURLs]);



    res.status(200).json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};










module.exports = {
  getAllProducts,
  getProductByID,
  addProduct,
  removeProduct,
  updateProduct,
  addVariations,

};
