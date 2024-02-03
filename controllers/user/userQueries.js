const getAllUsers = "SELECT * FROM public.users";
const getUserByID = "SELECT * FROM public.users WHERE id = $1 ";
const getUserByEmail = "SELECT id, fullname, email, phone, address, city, zipcode, country, role, permission, isblocked, photourl, created_at FROM public.users WHERE email = $1";
const checkEmailExists = "SELECT * FROM public.users  WHERE email = $1  ";
const addUser = "INSERT INTO public.users(fullname, email, phone, password, address, city, zipcode, country,role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
const addGoogleUser = "INSERT INTO public.users(fullname, email, password,photourl) VALUES ($1, $2, $3, $4);";
const removeUser = "DELETE FROM public.users WHERE id = $1 ";
const updateUser = "UPDATE public.users SET fullname=$1 WHERE id =$2; ";
const blockingUser = "UPDATE public.users SET isblocked=$1 WHERE id =$2; ";


module.exports ={
    getAllUsers,
    getUserByID,
    getUserByEmail,
    checkEmailExists,
    addUser,
    removeUser,
    updateUser,
    blockingUser,
    addGoogleUser,
}