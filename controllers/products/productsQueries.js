const getAllProducts = "SELECT p.*, b.brand_name, c.cat_name, s.subcat_name FROM public.products p LEFT JOIN public.brands b ON p.brand_id = b.brand_id LEFT JOIN public.categories c ON p.cat_id = c.cat_id LEFT JOIN public.subcategories s ON p.subcat_id = s.subcat_id";
const getProductByID = "SELECT * FROM products WHERE id = $1 ";
const checkProductExists = "SELECT * FROM products  WHERE name = $1  ";
const addProduct = "INSERT INTO products(name, description, price, images, quantity,  cat_id, brand_id, subcat_id) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8);";
const removeProduct = "DELETE FROM products WHERE id = $1 ";
const updateProduct = "UPDATE products SET name=$1 WHERE id =$2; ";


module.exports = {
    getAllProducts,
    getProductByID,
    checkProductExists,
    addProduct,
    removeProduct,
    updateProduct,
}