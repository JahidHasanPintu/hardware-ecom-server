const getAllBlogs = "SELECT * FROM blogs";
const getBlogByID = "SELECT * FROM blogs WHERE id = $1 ";
const checkBlogExists = "SELECT s FROM blogs s WHERE s.title = $1  ";
const addBlog = "INSERT INTO blogs(title, details,blog_images) VALUES ($1, $2,$3);";
const removeBlog = "DELETE FROM blogs WHERE id = $1 ";
const updateBlog = "UPDATE blogs SET title=$1 WHERE id =$2; ";


module.exports ={
    getAllBlogs,
    getBlogByID,
    checkBlogExists,
    addBlog,
    removeBlog,
    updateBlog,
}