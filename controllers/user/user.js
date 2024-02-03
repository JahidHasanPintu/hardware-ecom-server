const pool = require("../../config/db");
// const bcrypt = require('bcrypt');
const util = require('util');
// const saltRounds = 10;
const queries = require("./userQueries");
const { generateToken } = require("../../config/jwtToken");
const { promisify } = require('util');

const getAllUsers = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
  const offset = (page - 1) * limit; // Offset to skip the previous pages

  const { search, isblocked, role } = req.query;

  let query = `
    SELECT u.*, r.name AS user_role
    FROM users AS u
    LEFT JOIN user_roles AS ur ON u.id = ur.user_id
    LEFT JOIN roles AS r ON ur.role_id = r.id
  `;

  const values = [];

  let conditions = '';

  // If search query parameter is provided, add WHERE clause to search by fullname, email, and phone
  if (search) {
    conditions += `
      WHERE u.fullname LIKE ?
        OR u.email LIKE ?
        OR u.phone LIKE ?
    `;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // If isblocked query parameter is provided, add WHERE clause to filter by isblocked
  if (isblocked) {
    conditions += `${conditions ? 'AND' : 'WHERE'} u.status = ?`;
    values.push(isblocked);
  }

  // If role query parameter is provided, add WHERE clause to filter by role
  if (role) {
    conditions += `${conditions ? 'AND' : 'WHERE'} r.id = ?`;
    values.push(role);
  }

  query += conditions;

  query += `
    ORDER BY u.id ASC
    LIMIT ?
    OFFSET ?
  `;
  values.push(limit, offset);

  const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM users AS u
    LEFT JOIN user_roles AS ur ON u.id = ur.user_id
    LEFT JOIN roles AS r ON ur.role_id = r.id
    ${conditions}
  `;

  try {
    const queryAsync = promisify(pool.query).bind(pool);
    const result = await queryAsync(query, values);
    const users = result;

    const totalCountResult = await queryAsync(totalCountQuery, values);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    res.status(200).json({
      success: true,
      page,
      limit,
      total: users.length,
      totalItem: totalCount,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




const getUserByID = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserByID, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getUserByEmail = async (req, res) => {
  const email = req.query.email;

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const queryPromise = util.promisify(pool.query).bind(pool);
    const results = await queryPromise(query, [email]);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

const addUser = (req, res) => {
  const addUserQuery = "INSERT INTO users(fullname, email, phone, password, address, division, city, upazila, zipcode, country, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);";
  const addGoogleUserQuery = "INSERT INTO users(fullname, email, password, photo_url) VALUES (?, ?, ?, ?);";
  const checkEmailExistsQuery = "SELECT * FROM users WHERE email = ?";
  const addRoleQuery = "INSERT INTO user_roles(user_id, role_id) VALUES (?, ?)";

  let photoUrl = null;

  if (req.file) {
    const filePath = req.file.path.replace("public\\", "");
    photoUrl = filePath;
  }

  if (req.body.type === 'google') {
    const { fullname, email, photoUrl } = req.body;
    const password = 'google8483X39874@jh$l#';

    pool.query(checkEmailExistsQuery, [email], (error, results) => {
      if (results.length) {
        res.status(200).json({ message: "Data already stored!" });
      } else {
        pool.query(
          addGoogleUserQuery, [fullname, email, password, photoUrl],
          (error, results) => {
            if (error) throw error;

            // Get the newly created user ID
            const userId = results.insertId;

            // Add the default role (role_id = 2) to the user
            pool.query(
              addRoleQuery, [userId, 2],
              (error, results) => {
                if (error) throw error;

                res.status(201).json({ message: "User data stored successfully!" });
              }
            );
          }
        );
        // bcrypt.hash(password, saltRounds, (err, hash) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send('Internal server error');
        //   } else {

        //   }
        // });
      }
    });
  } else {
    const { fullname, email, phone, password, address, division, city, upazila, zipcode, country, role } = req.body;

    pool.query(checkEmailExistsQuery, [email], (error, results) => {
      if (results.length) {
        res.status(200).json({ message: "Email already exists!" });
      } else {
        pool.query(
          addUserQuery, [fullname, email, phone, password, address, division, city, upazila, zipcode, country, photoUrl],
          (error, results) => {
            if (error) throw error;

            // Get the newly created user ID
            const userId = results.insertId;

            // Add the specified role to the user
            pool.query(
              addRoleQuery, [userId, role],
              (error, results) => {
                if (error) throw error;

                res.status(201).json({ message: "User registration complete!" });
              }
            );
          }
        );
        // bcrypt.hash(password, saltRounds, (err, hash) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send('Internal server error');
        //   } else {

        //   }
        // });
      }
    });
  }
};


const login = (req, res) => {
  const { email, password } = req.body;

  const checkEmailExistsQuery = "SELECT u.*, r.id AS role_id, r.name AS role_name FROM users AS u LEFT JOIN user_roles AS ur ON u.id = ur.user_id LEFT JOIN roles AS r ON ur.role_id = r.id WHERE u.email = ?";

  pool.query(checkEmailExistsQuery, [email], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    } else {
      if (results.length === 0) {
        res.status(401).send('Invalid email or password');
      } else {
        const user = results[0];
        if (password === user.password) {
          
          const userDetails = {
            id: user.id,
            name: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            zipcode: user.zipcode,
            country: user.country,
            role: user.role_name,
            role_id: user.role_id,
            token: generateToken(user.id),
          };
          res.status(200).json(userDetails);
        }else{
          res.status(401).send('Invalid password');
        }

        // bcrypt.compare(password, user.password, (err, result) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send('Internal server error');
        //   } else if (result === false) {
        //     res.status(401).send('Invalid email or password');
        //   } else {


        //     res.status(200).json(userDetails);
        //   }
        // });
      }
    }
  });
};





const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // First, delete the role from the 'roles' table
    const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
    await pool.query(deleteUserQuery, [userId]);

    // Next, delete the corresponding role permissions from the 'role_permissions' table
    const deleteUserRoleQuery = 'DELETE FROM user_roles WHERE user_id = ?';
    await pool.query(deleteUserRoleQuery, [userId]);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { fullname, email, phone, password, address, division, city, upazila, zipcode, country, photo_url, status, role } = req.body;

  let photoUrl = null;

  if (req.file) {
    const filePath = req.file.path.replace("public\\", "");
    photoUrl = filePath;
  } else if (photo_url) {
    photoUrl = photo_url;
  }

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    const queryPromise = util.promisify(pool.query).bind(pool);
    const checkUserResults = await queryPromise(checkUserQuery, [id]);

    if (!checkUserResults || !checkUserResults.length) {
      return res.send("User does not exist");
    }

    const existingUserData = checkUserResults[0];
    const updatedUserData = {
      fullname: fullname || existingUserData.fullname,
      email: email || existingUserData.email,
      phone: phone || existingUserData.phone,
      password: password || existingUserData.password,
      address: address || existingUserData.address,
      division: division || existingUserData.division,
      city: city || existingUserData.city,
      upazila: upazila || existingUserData.upazila,
      zipcode: zipcode || existingUserData.zipcode,
      country: country || existingUserData.country,
      photo_url: photoUrl || existingUserData.photo_url,
      status: status || existingUserData.status,
    };

    const updateUserQuery = 'UPDATE users SET fullname = ?, email = ?, phone = ?, password = ?, address = ?, division = ?, city = ?, upazila = ?, zipcode = ?, country = ?, photo_url = ?, status = ? WHERE id = ?';
    await queryPromise(updateUserQuery, [
      updatedUserData.fullname,
      updatedUserData.email,
      updatedUserData.phone,
      updatedUserData.password,
      updatedUserData.address,
      updatedUserData.division,
      updatedUserData.city,
      updatedUserData.upazila,
      updatedUserData.zipcode,
      updatedUserData.country,
      updatedUserData.photo_url,
      updatedUserData.status,
      id,
    ]);
    const updatedRoleQuery = "UPDATE user_roles SET role_id = ? WHERE user_id = ?";
    if (role) {
      console.log(role);
      await queryPromise(updatedRoleQuery, [
        role,
        id,
      ]);
    }

    res.status(200).send("User updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};


const blockUnblock = async (req, res) => {
  const id = parseInt(req.params.id);
  const { fullname } = req.body;
  try {
    const { rows } = await pool.query(queries.getUserByID, [id]);
    if (!rows.length) {
      res.send("User does not exist");
    } else {
      const userBlocked = rows[0].isblocked;
      if (userBlocked) {
        await pool.query(queries.blockingUser, [false, id]);
        res.status(200).send("User Unblocked successfully!");
      } else {
        await pool.query(queries.blockingUser, [true, id]);
        res.status(200).send("User Blocked successfully!");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};



module.exports = {
  getAllUsers,
  getUserByID,
  getUserByEmail,
  addUser,
  removeUser,
  updateUser,
  login,
  blockUnblock
};

