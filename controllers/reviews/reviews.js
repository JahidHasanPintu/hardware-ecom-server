const pool = require("../../config/db");
const util = require('util');
const crypto = require('crypto');



const getAllReviews = async (req, res) => {
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
            searchCondition = `AND (o.order_number LIKE '%${search}%' OR u.fullname LIKE '%${search}%')`;
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
    SELECT o.id AS order_id, o.order_number, o.user_id, o.order_status, u.fullname AS user_name, o.created_at, pd.total, pd.payment_status
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

const getReviewByProdID = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);

        const query = `SELECT pr.review_text, pr.rating,pr.created_at, u.fullname, u.photo_url
        FROM product_reviews pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = ?;
    `;

        const reviews = await queryPromise(query, [id]);

       

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getReviewByID = async (req, res) => {
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


const getReviewByUser = async (req, res) => {
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



const addReview = async (req, res) => {
    const { userID, productId, rating, reviewText } = req.body;

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);

        const insertReviewQuery = `
      INSERT INTO product_reviews (product_id, user_id, review_text, rating)
      VALUES (?, ?, ?, ?)
    `;
        const reviewValues = [productId, userID, reviewText, rating];
        const insertReviewResult = await queryPromise(insertReviewQuery, reviewValues);

        const revID = insertReviewResult.insertId;


        res.status(200).json({ success: true, reviewId: revID, message: 'Review given successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



const removeReview = async (req, res) => {
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





module.exports = {
    getAllReviews,
    getReviewByProdID,
    addReview,
    removeReview,
    getReviewByUser,
    getReviewByID,
};

