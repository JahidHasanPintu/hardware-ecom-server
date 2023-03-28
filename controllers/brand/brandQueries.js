const getAllBrands = "SELECT * FROM brands";
const getBrandByID = "SELECT * FROM brands WHERE brand_id = $1 ";
const checkBrandExists = "SELECT s FROM brands s WHERE s.brand_name = $1  ";
const addBrand = "INSERT INTO brands(brand_name, brand_image,status) VALUES ($1,$2,$3);";
const removeBrand = "DELETE FROM brands WHERE brand_id = $1 ";
const updateBrand = "UPDATE brands SET brand_name=$1, brand_image=$2,status=$3 WHERE brand_id =$4; ";


module.exports ={
    getAllBrands,
    getBrandByID,
    checkBrandExists,
    addBrand,
    removeBrand,
    updateBrand,
}