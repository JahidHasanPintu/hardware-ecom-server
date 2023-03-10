const getAllUsers = "SELECT * FROM public.users";
const getUserByID = "SELECT * FROM public.users WHERE id = $1 ";
const checkEmailExists = "SELECT s FROM public.users s WHERE s.email = $1  ";
const addUser = "INSERT INTO public.users(fullname, email, phone, password, address, city, zipcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
const removeUser = "DELETE FROM public.users WHERE id = $1 ";
const updateUser = "UPDATE public.users SET fullname=$1 WHERE id =$2; ";


module.exports ={
    getAllUsers,
    getUserByID,
    checkEmailExists,
    addUser,
    removeUser,
    updateUser,
}