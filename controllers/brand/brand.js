const pool = require("../../config/db");
const queries = require("./brandQueries");

const getAllBrands =async (req,res) =>{
    pool.query(queries.getAllBrands,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const getBrandByID =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};


const addBrand = (req,res) =>{
    const {brand_name,brand_image,status} =req.body;
    const filePath = req.file.path;
    // console.log(req); 
    
    pool.query(queries.checkBrandExists,[brand_name],(error,results)=>{
        if(results.rows.length){
            res.send("Brand already exist !");
        }
        pool.query(queries.addBrand,[brand_name,filePath,status],(error,results)=>{
            if(error) throw error;
            res.status(201).send("Brand created successfully!");
        });

        
    });
};

const removeBrand =async (req,res) =>{
    const id = parseInt(req.params.id);
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Brand does not exist");
        }
        pool.query(queries.removeBrand,[id],(error,results)=>{

            if(error) throw error;
             res.status(200).send("Brand deleted sucessfully!");
            
           
        });
    });
};

const updateBrand =async (req,res) =>{
    const id = parseInt(req.params.id);
    const {brand_name} =req.body; 
    pool.query(queries.getBrandByID,[id],(error,results)=>{
        const noUserFound= !results.rows.length;
        if(noUserFound){
            res.send("Brand does not exist");
        }
        pool.query(queries.updateBrand,[brand_name,id],(error,results)=>{

            if(error) throw error;
            
             res.status(200).send("Brand updated sucessfully!");
            
           
        });
    });
};


module.exports = {
    getAllBrands,
    getBrandByID,
    addBrand,
    removeBrand,
    updateBrand,
};

