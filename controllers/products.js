const getAllProducts =async (req,res) =>{
    res.status(200).json({msg: "Here are all products."});
};
const getAllProductsTesting =async (req,res) =>{
    res.status(200).json({msg: "Here are all productsTesting."});
};

module.exports = {getAllProducts,getAllProductsTesting};

