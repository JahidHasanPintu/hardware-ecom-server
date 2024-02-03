const pool = require("../../config/db");
const util = require('util');


const getAllCupons = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Offset to skip the previous pages

    const { search, sortBy } = req.query;

    let query = `
    SELECT *
    FROM coupon
  `;

    const values = [];

    // If search query parameter is provided, add WHERE clause to search by code or description
    if (search) {
        query += `
      WHERE code LIKE ?
    `;
        values.push(`%${search}%`);
    }

    // If sortBy query parameter is provided, add ORDER BY clause
    if (sortBy) {
        switch (sortBy) {
            case "oldest":
                query += `
          ORDER BY created_at ASC
        `;
                break;
            case "newest":
                query += `
          ORDER BY created_at DESC
        `;
                break;
            case "popular":
                query += `
          ORDER BY used_count DESC
        `;
                break;
            default:
                break;
        }
    }

    query += `
    LIMIT ? OFFSET ?
  `;
    values.push(limit, offset);

    const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM coupon
  `;

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);

        const result = await queryPromise(query, values);
        const coupons = result;

        const data = coupons.map((coupon) => ({
            id: coupon.id,
            code: coupon.code,
            discount: coupon.discount,
            expiry_date: coupon.expiry_date,
            max_uses: coupon.max_uses,
            created_at: coupon.created_at,
            used_count: coupon.used_count,
        }));

        const totalCountResult = await queryPromise(totalCountQuery);
        const totalCount = parseInt(totalCountResult[0].total_count, 10);

        res.status(200).json({
            success: true,
            page,
            limit,
            total: coupons.length,
            totalItem: totalCount,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const useCoupon = async (req, res) => {
    const { couponCode } = req.query;
    const query = `
      SELECT *
      FROM coupon
      WHERE code = ?
    `;

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);
        const result = await queryPromise(query, [couponCode]);
        const coupon = result[0];

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }


        // Check if the coupon has expired
        const currentDate = new Date();
        const expiryDate = new Date(coupon.expiry_date);
        if (expiryDate < currentDate) {
            return res.status(400).json({ success: false, message: "Coupon has expired" });
        }


        // Check if the coupon has reached its maximum usage limit
        if (coupon.used_count >= coupon.max_uses) {
            return res.status(400).json({ success: false, message: "Coupon has reached its maximum usage limit" });
        }

        // Update the used_count for the coupon
        const updateQuery = "UPDATE coupon SET used_count = used_count + 1 WHERE id = ?";
        await pool.query(updateQuery, [coupon.id]);

        res.status(200).json({ success: true, message: "Coupon used successfully", discount: coupon.discount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getCuponByID = async (req, res) => {
    const couponId = req.params.id;

    const query = `
      SELECT *
      FROM coupon
      WHERE id = ?
    `;

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);
        const result = await queryPromise(query, [couponId]);
        const coupon = result[0];

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        const couponData = {
            id: coupon.id,
            code: coupon.code,
            discount: coupon.discount,
            expiry_date: coupon.expiry_date,
            max_uses: coupon.max_uses,
            created_at: coupon.created_at,
            used_count: coupon.used_count,
        };

        res.status(200).json({ success: true, data: couponData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const addCupon = (req, res) => {
    const checkExistingCouponQuery = "SELECT * FROM coupon WHERE code = ?;";
    const addCuponQuery = "INSERT INTO coupon (code, discount, expiry_date, max_uses) VALUES (?, ?, ?, ?);";

    const { code, discount, expiry_date, max_uses } = req.body;
    console.log(req.body);

    pool.query(checkExistingCouponQuery, [code], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        } else if (results.length > 0) {
            res.status(200).json({ message: "Coupon with similar name already exists!" });
        } else {
            pool.query(addCuponQuery, [code, discount, expiry_date, max_uses], (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(201).json({ message: "Coupon added successfully!" });
                }
            });
        }
    });
};


const removeCupon = async (req, res) => {
    const { id } = req.params;
    const deleteCouponQuery = "DELETE FROM coupon WHERE id = ?";

    pool.query(deleteCouponQuery, [id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "Coupon deleted successfully!" });
            } else {
                res.status(404).json({ message: "Coupon not found!" });
            }
        }
    });

};

const updateCupon = async (req, res) => {

    const { id } = req.params;
    const { code, discount, expiry_date, max_uses } = req.body;
    const updateCouponQuery = "UPDATE coupon SET";
    const queryValues = [];
    let querySet = "";

    if (code) {
        querySet += " code = ?,";
        queryValues.push(code);
    }
    if (discount) {
        querySet += " discount = ?,";
        queryValues.push(discount);
    }
    if (expiry_date) {
        querySet += " expiry_date = ?,";
        queryValues.push(expiry_date);
    }
    if (max_uses) {
        querySet += " max_uses = ?,";
        queryValues.push(max_uses);
    }

    // Remove trailing comma from the querySet
    querySet = querySet.replace(/,\s*$/, '');

    const finalQuery = `${updateCouponQuery}${querySet} WHERE id = ?`;
    queryValues.push(id);

    pool.query(finalQuery, queryValues, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "Coupon updated successfully!" });
            } else {
                res.status(404).json({ message: "Coupon not found!" });
            }
        }
    });


};

const addOfferDate = (req, res) => {
    const addOfferQuery = "INSERT INTO offer_date (expire_date) VALUES (?);";
    const { date } = req.body;


    pool.query(addOfferQuery, [date], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        } else {
            res.status(201).json({ message: "Expire date added successfully!" });
        }
    });
    // res.status(201).json({ message: "Working!" });
}


const updateOfferDate = (req, res) => {
    const addOfferQuery = "UPDATE offer_date SET expire_date = ? WHERE id = ?;";
    const { date } = req.body;
    const id = 1;

    pool.query(addOfferQuery, [date, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        } else {
            res.status(201).json({ message: "Expire date updated successfully!" });
        }
    });
};

const getOfferDate = async (req, res) => {
    const couponId = 1;

    const query = `
      SELECT *
      FROM offer_date
      WHERE id = ?
    `;

    try {
        const queryPromise = util.promisify(pool.query).bind(pool);
        const result = await queryPromise(query, [couponId]);
        const offerDate = result[0];

        if (!offerDate) {
            return res.status(404).json({ success: false, message: "offerDate not found" });
        }

        

        res.status(200).json({ success: true, data: offerDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = {
    getAllCupons,
    getCuponByID,
    addCupon,
    removeCupon,
    updateCupon,
    useCoupon,
    addOfferDate,
    updateOfferDate,
    getOfferDate,

};

