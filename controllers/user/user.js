const pool = require("../../config/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const queries = require("./userQueries");
const { generateToken } = require("../../config/jwtToken");

const getAllUsers = async (req, res) => {
  pool.query(queries.getAllUsers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};


const getUserByID = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserByID, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};


const addUser = (req, res) => {
  const { fullname, email, phone, password, address, city, zipcode, country } = req.body;

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
            queries.addUser, [fullname, email, phone, hash, address, city, zipcode, country],
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
      res.status(200).send("User deleted sucessfully!");


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

