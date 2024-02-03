const pool = require("../../config/db");
const queries = require("./orderQueries");
const util = require('util');
const crypto = require('crypto');


const getAllOrders = async (req, res) => {
  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 40;
    const offset = (page - 1) * limit;

    let searchCondition = '';
    let filterCondition = '';
    let sortCondition = '';

    // Build search condition
    if (req.query.search) {
      const search = req.query.search;
      searchCondition = `AND (o.order_number LIKE '%${search}%' OR u.fullname LIKE '%${search}%' OR u.phone LIKE '%${search}%')`;
    }

    // Build filter condition
    if (req.query.payment_status) {
      const paymentStatus = req.query.payment_status;
      filterCondition = `AND pd.payment_status = '${paymentStatus}'`;
    }

    if (req.query.order_status) {
      const orderStatus = req.query.order_status;
      filterCondition += ` AND o.order_status = '${orderStatus}'`;
    }

    // Build sort condition
    if (req.query.sortBy === 'low_price') {
      sortCondition = 'ORDER BY pd.total ASC';
    } else if (req.query.sortBy === 'high_price') {
      sortCondition = 'ORDER BY pd.total DESC';
    } else if (req.query.sortBy === 'oldest') {
      sortCondition = 'ORDER BY o.created_at ASC';
    } else if (req.query.sortBy === 'newest') {
      sortCondition = 'ORDER BY o.created_at DESC';
    } else {
      sortCondition = 'ORDER BY o.created_at DESC'
    }

    // Fetch orders with search, filter, sort, pagination
    const query = `
    SELECT o.id AS order_id, o.order_number, o.user_id, o.order_status,u.phone as user_phone, u.fullname AS user_name, o.created_at, pd.total, pd.payment_status
    FROM order_data o
    LEFT JOIN payment_details pd ON o.id = pd.order_id
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1 ${searchCondition} ${filterCondition}
    ${sortCondition}
    LIMIT ${limit}
    OFFSET ${offset}
    `;

    const [orders, totalCount] = await Promise.all([
      queryPromise(query),
      queryPromise(`SELECT COUNT(*) as count FROM order_data o LEFT JOIN payment_details pd ON o.id = pd.order_id LEFT JOIN users u ON o.user_id = u.id WHERE 1 ${searchCondition} ${filterCondition}`)
    ]);

    const data = orders.map((order) => ({
      order_id: order.order_id,
      order_number: order.order_number,
      user_id: order.user_id,
      order_status: order.order_status,
      user_name: order.user_name,
      user_phone: order.user_phone,
      created_at: order.created_at,
      total: order.total,
      payment_status: order.payment_status,
    }));

    res.status(200).json({
      success: true,
      page,
      limit,
      total: data.length,
      totalItem: totalCount[0].count,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getOrderByID = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const query = `
      SELECT o.id AS order_id, o.order_number, o.order_status, o.order_notes, o.applied_cupon, o.comments, o.created_at,
        u.fullname, u.email, u.phone, u.address, u.division, u.city, u.upazila, u.zipcode, u.country,
        pd.total, pd.payment_status, pd.payment_method, pd.transaction_id, pd.subtotal, pd.shipping, pd.discount,
        oi.product_id, oi.quantity, oi.price, oi.order_color,oi.order_size,
        p.product_name,
        b.brand_name,
        c.cat_name,
        s.subcat_name,
        pi.image_url
      FROM order_data o
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN payment_details pd ON o.id = pd.order_id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.cat_id = c.id
      LEFT JOIN subcategories s ON p.subcat_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE o.id = ?;
    `;

    const orders = await queryPromise(query, [id]);

    // Create separate objects for payment details, user information, and product items
    const paymentDetails = {
      total: null,
      payment_status: null,
      payment_method: null,
      transaction_id: null,
      subtotal: null,
      shipping: null,
      discount: null
    };

    const userInfo = {
      fullname: null,
      email: null,
      phone: null,
      address: null,
      division: null,
      city: null,
      upazila: null,
      zipcode: null,
      country: null
    };

    const productItems = [];

    // Populate payment details, user information, and product items
    if (orders.length > 0) {
      orders.forEach(order => {
        paymentDetails.total = order.total;
        paymentDetails.payment_status = order.payment_status;
        paymentDetails.payment_method = order.payment_method;
        paymentDetails.transaction_id = order.transaction_id;
        paymentDetails.subtotal = order.subtotal;
        paymentDetails.shipping = order.shipping;
        paymentDetails.discount = order.discount;

        userInfo.fullname = order.fullname;
        userInfo.email = order.email;
        userInfo.phone = order.phone;
        userInfo.address = order.address;
        userInfo.division = order.division;
        userInfo.city = order.city;
        userInfo.upazila = order.upazila;
        userInfo.zipcode = order.zipcode;
        userInfo.country = order.country;

        productItems.push({
          product_id: order.product_id,
          quantity: order.quantity,
          price: order.price,
          color: order.order_color,
          size: order.order_size,
          product_name: order.product_name,
          brand_name: order.brand_name,
          cat_name: order.cat_name,
          subcat_name: order.subcat_name,
          image_url: process.env.BASE_URL + "/" + order.image_url
        });
      });
    }

    // Create the result object with organized payment details, user information, and product items
    const result = {
      order_id: id,
      order_number: orders.length > 0 ? orders[0].order_number : null,
      order_status: orders.length > 0 ? orders[0].order_status : null,
      order_notes: orders.length > 0 ? orders[0].order_notes : null,
      applied_cupon: orders.length > 0 ? orders[0].applied_cupon : null,
      comments: orders.length > 0 ? orders[0].comments : null,
      created_at: orders.length > 0 ? orders[0].created_at : null,
      payment_details: paymentDetails,
      user_info: userInfo,
      items: productItems
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getOrderByOrderID = async (req, res) => {
  const id = req.query.orderNumber;
  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    const query = `
      SELECT order_status, comments
      FROM order_data 
      WHERE order_number = ?;
    `;

    const orders = await queryPromise(query, [id]);

    // Create the result object with organized payment details, user information, and product items
    const result = {
      order_status: orders.length > 0 ? orders[0].order_status : null,
      comments: orders.length > 0 ? orders[0].comments : null,
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getOrderByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const sortBy = req.query.sortBy || 'latest'; // Default to sorting by latest if sortBy query parameter is not provided
  const page = parseInt(req.query.page) || 1; // Default to page 1 if page query parameter is not provided
  const limit = parseInt(req.query.limit) || 10; // Default to a limit of 10 if limit query parameter is not provided
  let sortQuery;

  if (sortBy === 'latest') {
    sortQuery = 'ORDER BY created_at DESC';
  } else if (sortBy === 'oldest') {
    sortQuery = 'ORDER BY created_at ASC';
  } else {
    return res.status(400).json({ error: 'Invalid sortBy value. Must be either "latest" or "oldest".' });
  }

  const offset = (page - 1) * limit;
  const countQuery = 'SELECT COUNT(*) as total FROM order_data WHERE user_id = ?';
  const query = `
    SELECT od.*, pd.payment_status, pd.transaction_id
    FROM order_data od
    LEFT JOIN payment_details pd ON od.id = pd.order_id
    WHERE od.user_id = ? ${sortQuery}
    LIMIT ? OFFSET ?
  `;

  pool.getConnection((error, connection) => {
    if (error) throw error;

    connection.query(countQuery, [userId], (error, countResult) => {
      if (error) throw error;
      const totalCount = parseInt(countResult[0].total);
      const totalPages = Math.ceil(totalCount / limit);

      connection.query(query, [userId, limit, offset], (error, results) => {
        connection.release(); // Release the connection

        if (error) throw error;
        res.status(200).json({
          success: true,
          page,
          totalPages,
          limit,
          total: results.length,
          totalItem: totalCount,
          data: results,
        });
      });
    });
  });
};

const getAllStats = async (req, res) => {
  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Get the dynamic order status from the request
    const orderStatus = req.query.order_status;

    // Fetch total orders and revenue for all time by dynamic order status
    const allTimeQuery = `
      SELECT
        COUNT(*) AS total_orders,
        SUM(total) AS total_revenue
      FROM
        order_data
    `;

    const allTimeResult = await queryPromise(allTimeQuery, [orderStatus]);

    // Fetch total orders and revenue for today by dynamic order status
    const todayQuery = `
      SELECT
        order_status,
        COUNT(*) AS total_orders,
        SUM(total) AS total_revenue
      FROM
        order_data
      WHERE 
      DATE(created_at) = CURRENT_DATE;
    `;
    const pendingOrder = `
      SELECT
        order_status,
        COUNT(*) AS total_pending
      FROM
        order_data
      WHERE 
      order_status = 'pending' AND DATE(created_at) = CURRENT_DATE;
    `;
    const deliveredOrder = `
      SELECT
        
        COUNT(*) AS total_delivered
      FROM
        order_data
      WHERE 
      order_status = 'delivered' AND DATE(created_at) = CURRENT_DATE;
    `;

    const todayResult = await queryPromise(todayQuery);
    const todayPending = await queryPromise(pendingOrder);
    const todayDelivered = await queryPromise(deliveredOrder);
    const data = {
      all_time: {
        total_orders: allTimeResult[0].total_orders,
        total_revenue: allTimeResult[0].total_revenue,
      },
      today: {

        todayTotalOrder: todayResult[0].total_orders,
        total_revenue: todayResult[0].total_revenue,
        todayTotalPending: todayPending[0].total_pending,
        todayTotalDelivered: todayDelivered[0].total_delivered,
      },
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

function generateInvoiceID() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const randomBytes = crypto.randomBytes(4).toString('hex');
  const invoiceID = `DH-${year}${month}${day}${hours}${minutes}${seconds}${randomBytes}`;

  return invoiceID;
}

const addOrder = async (req, res) => {
  const { userID, shippingCharge, subtotal, discount, total, paymentMethod, paymentStatus, transaction_id, appliedCupon, notes, products } = req.body;
  const status = "pending";

  // Usage example
  const orderNumber = generateInvoiceID();

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Insert the order into the orderdata table
    const insertOrderQuery = `
      INSERT INTO order_data (user_id, order_number, order_status, total, applied_cupon, order_notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [userID, orderNumber, status, total, appliedCupon, notes];
    const insertOrderResult = await queryPromise(insertOrderQuery, orderValues);

    const orderId = insertOrderResult.insertId;

    // Prepare the values for inserting the order items into the orderitems table
    const orderItemsValues = products.map(item => [
      orderId,
      item.id,
      item.orderQuantity,

      item.orderSize,
      item.orderColor,
      item.price
    ]);
    // console.log(products[0]);

    // Iterate through each order item to update stock quantities
    for (const item of orderItemsValues) {
      
      const [orderID,productId,orderQuantity, orderSize, orderColor, ] = item;
      if (orderSize && orderColor) {
        // Update both product_variations and product_sizes
        const updateColorQuery = `
      UPDATE product_variations
      SET stock_quantity = stock_quantity - ?
      WHERE product_id = ? AND color = ?
    `;
        const updateBothParams = [orderQuantity, productId, orderColor];

        const updateSizesQuery = `
      UPDATE product_sizes
      SET stock_quantity = stock_quantity - ?
      WHERE product_id = ? AND size = ?
    `;
        const updateSizesParams = [orderQuantity, productId, orderSize];

        await queryPromise(updateColorQuery, updateBothParams);
        await queryPromise(updateSizesQuery, updateSizesParams);
      } else if (orderColor) {
        // Update only product_variations
        const updateVariationsQuery = `
      UPDATE product_variations
      SET stock_quantity = stock_quantity - ?
      WHERE product_id = ? AND color = ?
    `;
        const updateVariationsParams = [orderQuantity, productId, orderColor];

        await queryPromise(updateVariationsQuery, updateVariationsParams);
      } else if (orderSize) {
        // Update only product_sizes
        const updateSizesQuery = `
      UPDATE product_sizes
      SET stock_quantity = stock_quantity - ?
      WHERE product_id = ? AND size = ?
    `;
        const updateSizesParams = [orderQuantity, productId, orderSize];

        await queryPromise(updateSizesQuery, updateSizesParams);
      }
    }

    // Now you can proceed to insert the order items into the order_items table
    // const insertOrderItemsQuery = `
    //   INSERT INTO order_items (order_id, product_id, quantity, order_color, order_size, price)
    //   VALUES ?
    // `;
    // await queryPromise(insertOrderItemsQuery, [orderItemsValues]);



    // Insert the order items into the orderitems table
    const insertOrderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, quantity,order_color,order_size, price)
      VALUES ?
    `;
    await queryPromise(insertOrderItemsQuery, [orderItemsValues]);

    // Insert the payment data
    const insertPaymentQuery = `
      INSERT INTO payment_details (order_id,	payment_method,	payment_status,	transaction_id,	subtotal,	shipping,	discount,	total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const paymentValue = [orderId, paymentMethod, paymentStatus, transaction_id, subtotal, shippingCharge, discount, total];
    const insertPaymentResult = await queryPromise(insertPaymentQuery, paymentValue);

    res.status(200).json({ success: true, invoiceId: orderNumber, orderStatus: status, paymentStatus: paymentStatus, message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



const removeOrder = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const queryPromise = util.promisify(pool.query).bind(pool);

    // Delete the order items associated with the order
    const deleteOrderItemsQuery = `
      DELETE FROM order_items
      WHERE order_id = ?
    `;
    await queryPromise(deleteOrderItemsQuery, [id]);

    // Delete the payment details associated with the order
    const deletePaymentDetailsQuery = `
      DELETE FROM payment_details
      WHERE order_id = ?
    `;
    await queryPromise(deletePaymentDetailsQuery, [id]);

    // Delete the order
    const deleteOrderQuery = `
      DELETE FROM order_data
      WHERE id = ?
    `;
    await queryPromise(deleteOrderQuery, [id]);

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const updateOrder = async (req, res) => {
  const id = parseInt(req.params.id);
  const { comments, orderStatus, paymentStatus } = req.body;
  try {
    const checkOrderQuery = 'SELECT * FROM order_data WHERE id = ?';
    const queryPromise = util.promisify(pool.query).bind(pool);
    const checkOrderResults = await queryPromise(checkOrderQuery, [id]);

    if (!checkOrderResults || !checkOrderResults.length) {
      return res.send("Order does not exist");
    }

    const existingOrderData = checkOrderResults[0];
    const updatedUserData = {
      orderStatus: orderStatus || existingOrderData.order_status,
      comments: comments || existingOrderData.comments,


    };

    const updateUserQuery = 'UPDATE order_data SET order_status = ?, comments = ? WHERE id = ?';
    const updatePaymentQuery = 'UPDATE payment_details SET payment_status = ? WHERE order_id = ?';
    await queryPromise(updateUserQuery, [
      updatedUserData.orderStatus,
      updatedUserData.comments,
      id
    ]);
    await queryPromise(updatePaymentQuery, [
      paymentStatus,
      id
    ]);

    res.status(200).send("order updated successfully!");

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }

};


module.exports = {
  getAllOrders,
  getOrderByID,
  addOrder,
  removeOrder,
  updateOrder,
  getOrderByUser,
  getOrderByOrderID,
  getAllStats,
};

