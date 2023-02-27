const getAllUsers = "SELECT * FROM public.user";
const getUserByID = "SELECT * FROM public.user WHERE id = $1 ";
const checkEmailExists = "SELECT s FROM public.user s WHERE s.email = $1  ";
const addUser = "INSERT INTO public.user(first_name, last_name, email, phone, password, address_line1, address_line2, city, zipcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";

module.exports ={
    getAllUsers,
    getUserByID,
    checkEmailExists,
    addUser,
}