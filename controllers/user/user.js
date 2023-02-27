const pool = require("../../db");
const queries = require("./userQueries");

const getAllUsers =async (req,res) =>{
    pool.query(queries.getAllUsers,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getUserByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getUserByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addUser = (req,res) =>{
    const {first_name, last_name, email, phone, password, address_line1, address_line2, city, zipcode, country} =req.body; 
    
    pool.query(queries.checkEmailExists,[email],(error,results)=>{
        if(results.rows.length){
            res.send("Email already used !");
        }
        
    })
}

module.exports = {
    getAllUsers,
    getUserByID,
    addUser,
};

