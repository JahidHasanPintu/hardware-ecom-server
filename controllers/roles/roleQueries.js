const getAllRoles = "SELECT * FROM public.user_role";
const getRoleByID = "SELECT * FROM public.user_role WHERE id = $1 ";
const addRole = 'INSERT INTO user_role (role, permissions, status) VALUES ($1,  $2::text[],$3)';

const removeRole = "DELETE FROM public.user_role WHERE id = $1 ";
const updateRole = "UPDATE public.user_role SET role=$1,permissions=$2 WHERE id =$3; ";


module.exports ={
    getAllRoles,
    getRoleByID,
    
    addRole,
    removeRole,
    updateRole,
   
}