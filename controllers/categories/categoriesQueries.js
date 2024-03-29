const getAllCategories = "SELECT * FROM categories";
const getCategoryByID = "SELECT * FROM categories WHERE cat_id = $1 ";
const checkCategoryExists = "SELECT s FROM categories s WHERE s.cat_name = $1  ";
const addCategory = "INSERT INTO categories(cat_name, cat_image,status) VALUES ($1, $2,$3);";
const removeCategory = "DELETE FROM categories WHERE cat_id = $1 ";
const updateCategory = "UPDATE categories SET cat_name=$1,cat_image=$2,status=$3 WHERE cat_id =$4; ";


module.exports ={
    getAllCategories,
    getCategoryByID,
    checkCategoryExists,
    addCategory,
    removeCategory,
    updateCategory,
}