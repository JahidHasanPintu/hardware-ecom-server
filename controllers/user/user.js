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
    const {fullname, email, phone, password, address, city, zipcode, country} =req.body; 
    
    pool.query(queries.checkEmailExists,[email],(error,results)=>{
        if(results.rows.length){
            res.send("Email already used !");
        }
        pool.query(queries.addUser,[fullname, email, phone, password, address, city, zipcode, country],(error,results)=>{
            if(error) throw error;
            res.status(201).send("User created successfully!");
        });

        
    });
};

const removetUser =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getUserByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("User does not exist");
        }
        pool.query(queries.removeUser,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("User deleted sucessfully!");
            
           
        });
    });
};

const updateUser =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {fullname} =req.body; 
    pool.query(queries.getUserByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("User does not exist");
        }
        pool.query(queries.updateUser,[fullname,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("User updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllUsers,
    getUserByID,
    addUser,
    removetUser,
    updateUser,
};

