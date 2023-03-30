const getAllSubCategories = "SELECT * FROM subcategories";
const getSubCategoryByID = "SELECT * FROM subcategories WHERE subcat_id = $1 ";
const checkSubCategoryExists = "SELECT s FROM subcategories s WHERE s.subcat_name = $1  ";
const addSubCategory = "INSERT INTO subcategories(cat_id,subcat_name,status) VALUES ($1, $2,$3);";
const removeSubCategory = "DELETE FROM subcategories WHERE subcat_id = $1 ";
const updateSubCategory = "UPDATE subcategories SET subcat_name=$1,cat_id=$2,status=$3 WHERE subcat_id =$4; ";


module.exports ={
    getAllSubCategories,
    getSubCategoryByID,
    checkSubCategoryExists,
    addSubCategory,
    removeSubCategory,
    updateSubCategory,
}