const pool = require("../../config/db");
const queries = require("./orderQueries");

const getAllOrders =async (req,res) =>{
    pool.query(queries.getAllOrders,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getOrderByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getOrderByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addOrder = (req,res) =>{
    const {user_id, total_price, billing_address, shipping_address, status_id} =req.body; 
    
    
        pool.query(queries.addOrder,[user_id, total_price, billing_address, shipping_address, status_id],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Order created successfully!");
        });

        
    
};

const removetOrder =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getOrderByID,[id],(error,results)=>{
        const noOrderFound= !results.rows.length;
        if(noOrderFound){
            res.send("Order does not exist");
        }
        pool.query(queries.removeOrder,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Order deleted sucessfully!");
            
           
        });
    });
};

const updateOrder =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {title} =req.body; 
    pool.query(queries.getOrderByID,[id],(error,results)=>{
        const noOrderFound= !results.rows.length;
        if(noOrderFound){
            res.send("Order does not exist");
        }
        pool.query(queries.updateOrder,[title,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Order updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllOrders,
    getOrderByID,
    addOrder,
    removetOrder,
    updateOrder,
};

