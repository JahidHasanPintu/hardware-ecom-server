const getAllBlogs = "SELECT * FROM blogs";
const getBlogByID = "SELECT * FROM blogs WHERE id = $1 ";
const checkBlogExists = "SELECT s FROM blogs s WHERE s.title = $1  ";
// const addBlog = "INSERT INTO blogs(title, details,blog_images) VALUES ($1, $2,$3);";
const addBlog = "INSERT INTO blogs (user_id, title, details) VALUES ($1, $2,$3);";
const addBlogImages = "INSERT INTO blog_images (blog_id, image_url) VALUES ($1, $2);";
const removeBlog = "DELETE FROM blogs WHERE id = $1 ";
const updateBlog = "UPDATE blogs SET title=$1 WHERE id =$2; ";

const checkBlogExistsQuery = `
    SELECT id
    FROM blogs
    WHERE title = $1;
  `;

  const addBlogQuery = `
    INSERT INTO blogs (user_id, title, details)
    VALUES (1, $1, $2)
    RETURNING id;
  `;

  const addBlogImagesQuery = `
    INSERT INTO blog_images (blog_id, image_url)
    VALUES ($1, $2);
  `;


module.exports ={
    getAllBlogs,
    getBlogByID,
    checkBlogExists,
    addBlog,
    removeBlog,
    updateBlog,
    addBlogQuery,
    addBlogImagesQuery,
    checkBlogExistsQuery
}