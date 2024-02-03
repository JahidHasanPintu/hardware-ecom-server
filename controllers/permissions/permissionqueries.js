const getAllPermissions = "SELECT * FROM public.permissions";
const getPermissionByID = "SELECT * FROM public.permissions WHERE id = $1 ";
const addPermission = "INSERT INTO public.permissions(permission_name) VALUES ($1);";

const removePermission = "DELETE FROM public.permissions WHERE id = $1 ";
const updatePermission = "UPDATE public.permissions SET permission_name=$1 WHERE id =$2; ";


module.exports ={
    getAllPermissions,
    getPermissionByID,
    
    addPermission,
    removePermission,
    updatePermission,
   
}