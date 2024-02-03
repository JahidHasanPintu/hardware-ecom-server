const getAllOrders = "SELECT * FROM orderData";
const getOrderByID = "SELECT * FROM orderData WHERE id = $1 ";
const checkOrderExists = "SELECT s FROM orderData s WHERE s.id = $1  ";
const addOrder = "INSERT INTO orderData(user_id, total_price, billing_address, shipping_address, status_id) VALUES ($1,$2,$3,$4,$5);";
const removeOrder = "DELETE FROM orderData WHERE id = $1 ";
const updateOrder = "UPDATE orderData SET status_id=$1 WHERE id =$2; ";


module.exports ={
    getAllOrders,
    getOrderByID,
    checkOrderExists,
    addOrder,
    removeOrder,
    updateOrder,
}