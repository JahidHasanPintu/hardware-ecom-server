const pool = require("../../config/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const queries = require("./userQueries");
const { generateToken } = require("../../config/jwtToken");

const getAllUsers = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Current page number
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of records to show per page
  const offset = (page - 1) * limit; // Offset to skip the previous pages

  const { search, isblocked, role } = req.query;

  let query = `
    SELECT *
    FROM users
  `;

  const values = [];

  // If search query parameter is provided, add WHERE clause to search by fullname, email, and phone
  if (search) {
    query += `
      WHERE fullname ILIKE $${values.length + 1}
        OR email ILIKE $${values.length + 2}
        OR phone::text ILIKE $${values.length + 3}
    `;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // If isblocked query parameter is provided, add WHERE clause to filter by isblocked
  if (isblocked) {
    query += `
      ${search ? "AND" : "WHERE"} isblocked = $${values.length + 1}
    `;
    values.push(isblocked);
  }

  // If role query parameter is provided, add WHERE clause to filter by role
  if (role) {
    query += `
      ${search || isblocked ? "AND" : "WHERE"} role = $${values.length + 1}
    `;
    values.push(role);
  }

  query += `
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;
  values.push(limit, offset);
  const totalCountQuery = `
  SELECT COUNT(*) as total_count
  FROM users
`;
  try {
    const result = await pool.query(query, values);
    const users = result.rows;
    const totalCountResult = await pool.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

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


const addUser = (req, res) => {
  const { fullname, email, phone, password, address, city, zipcode, country,isblocked,role } = req.body;

  if (req.file) {
    const filePath = req.file.path.replace("public\\", "");
  }

  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (results.rows.length) {
      res.send('Email already used !');
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal server error');
        } else {
          pool.query(
            queries.addUser, [fullname, email, phone, hash, address, city, zipcode, country,isblocked,role],
            (error, results) => {
              if (error) throw error;
              res.status(201).send('User created successfully!');
            }
          );
        }
      });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (error) {
      console.log(error); 7
      res.status(500).send('Internal server error');
    } else {
      if (results.rows.length === 0) {
        res.status(401).send('Invalid email or password');
      } else {
        const user = results.rows[0];

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
          } else if (result === false) {
            res.status(401).send('Invalid email or password');
          } else {
            const userDetails =
            {
              id: user.id,
              name: user.fullname,
              email: user.email,
              phone: user.phone,
              address: user.address,
              city: user.city,
              zipcode: user.zipcode,
              country: user.country,
              token: generateToken(user.id),
            }


            res.status(200).json(userDetails);
          }
        });
      }
    }
  });
};



const removeUser = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserByID, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("User does not exist");
    }
    pool.query(queries.removeUser, [id], (error, results) => {

      if (error) throw error;
      res.status(200).json({ success: true, message: "User deleted sucessdully" });


    });
  });
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { fullname } = req.body;
  pool.query(queries.getUserByID, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("User does not exist");
    }
    pool.query(queries.updateUser, [fullname, id], (error, results) => {

      if (error) throw error;

      res.status(200).send("User updated sucessfully!");


    });
  });
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
  addUser,
  removeUser,
  updateUser,
  login,
  blockUnblock
};

