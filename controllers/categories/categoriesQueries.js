const getAllCategories = "SELECT * FROM categories";
const getCategoryByID = "SELECT * FROM categories WHERE cat_id = $1 ";
const checkCategoryExists = "SELECT s FROM categories s WHERE s.cat_name = $1  ";
const addCategory = "INSERT INTO categories(cat_name, cat_image) VALUES ($1, $2);";
const removeCategory = "DELETE FROM categories WHERE cat_id = $1 ";
const updateCategory = "UPDATE categories SET cat_name=$1 WHERE cat_id =$2; ";


module.exports ={
    getAllCategories,
    getCategoryByID,
    checkCategoryExists,
    addCategory,
    removeCategory,
    updateCategory,
}