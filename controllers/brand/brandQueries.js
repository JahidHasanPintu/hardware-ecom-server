const getAllBrands = "SELECT * FROM brands";
const getBrandByID = "SELECT * FROM brands WHERE brand_id = $1 ";
const checkBrandExists = "SELECT s FROM brands s WHERE s.brand_name = $1  ";
const addBrand = "INSERT INTO brands(brand_name, brand_image) VALUES ($1, $2);";
const removeBrand = "DELETE FROM brands WHERE brand_id = $1 ";
const updateBrand = "UPDATE brands SET brand_name=$1 WHERE brand_id =$2; ";


module.exports ={
    getAllBrands,
    getBrandByID,
    checkBrandExists,
    addBrand,
    removeBrand,
    updateBrand,
}